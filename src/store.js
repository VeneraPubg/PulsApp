// ─── Хранилище активности: сессии, вес тела, личные рекорды ───────────────────
// Формат JSON в AsyncStorage:
// {
//   planStart: 'YYYY-MM-DD',            // старт плана
//   sessions: [{id,date,workoutId,title,category,level,durationSec,kcal,
//               avgPulse,exercisesDone,exercisesTotal,volumeKg,perExercise:[…]}],
//   weights:  [{date:'YYYY-MM-DD',kg}],
// }

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  WORKOUTS,
  PLAN,
  buildDay,
  dateKey,
  addDays,
} from './data';

const STORE_KEY = 'pulse_activity_v2';

let cache = null;
const listeners = new Set();

export function getData() {
  return cache;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Хук: подписка на данные (обновление приходит после сохранения сессии/веса)
export function useAppData() {
  const [data, setData] = useState(cache);
  useEffect(() => {
    let alive = true;
    init().then((d) => {
      if (alive && d) setData(d);
    });
    return subscribe((d) => {
      if (alive) setData(d);
    });
  }, []);
  return data;
}

function notify() {
  listeners.forEach((fn) => fn(cache));
}

async function persist() {
  try {
    await AsyncStorage.setItem(STORE_KEY, JSON.stringify(cache));
  } catch (e) {
    // ignore write errors
  }
}

const EMPTY = { planStart: null, sessions: [], weights: [] };

async function readStore() {
  try {
    const raw = await AsyncStorage.getItem(STORE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        planStart: p.planStart || null,
        sessions: Array.isArray(p.sessions) ? p.sessions : [],
        weights: Array.isArray(p.weights) ? p.weights : [],
      };
    }
  } catch (e) {
    // повреждённое хранилище — начинаем с чистого листа
  }
  return { planStart: null, sessions: [], weights: [] };
}

// ─── Сиды (демо-данные при первом запуске, чтобы всё «ожило» сразу) ───────────
// Тренировки 8/6/3 дней назад + история веса. При желании легко аккуратно
// чистится: AsyncStorage.removeItem('pulse_activity_v1').

function seedExercises(day) {
  // калиброванные для игры: пользователь выполняет все упражнения полностью
  return day.exercises.map((ex) => ({
    name: ex.name,
    icon: ex.icon,
    kind: ex.kind,
    seconds: ex.seconds,
    sets: ex.sets,
    reps: ex.reps,
    weight: ex.weight,
    volumeKg: ex.volumeKg,
    secondsPR: !!ex.timePR,
  }));
}

function makeSeedSession(day, when, opts) {
  const perExercise = seedExercises(day);
  return {
    id: `seed_${opts.n}`,
    date: when,
    workoutId: day.workoutId,
    title: day.title,
    category: day.category,
    level: day.level,
    durationSec: opts.durationSec,
    kcal: opts.kcal,
    avgPulse: opts.avgPulse,
    exercisesDone: perExercise.length,
    exercisesTotal: perExercise.length,
    volumeKg: perExercise.reduce((acc, x) => acc + (x.volumeKg || 0), 0),
    perExercise,
  };
}

function ensureSeed(data) {
  if (data.sessions.length > 0 || data.weights.length > 0) return;

  const today = new Date();
  const planStart = dateKey(addDays(today, -8)); // сегодня — 9-й день → неделя 2
  data.planStart = planStart;

  // Сиды: 3 тренировки в тренировочные дни Пн/Ср/Пт прошлой недели.
  // planStart = сегодня-8 (周三), поэтому: 14 окт → T2 (k1), 16 окт → T3 (k2),
  // 19 окт (Пн) → T1 (k4, неделя 2)
  const seedDefs = [
    { off: -8, tplIdx: 1, week: 1, n: 1, kcal: 268, avgPulse: 137, durationSec: 28 * 60 },
    { off: -6, tplIdx: 2, week: 1, n: 2, kcal: 287, avgPulse: 144, durationSec: 30 * 60 },
    { off: -3, tplIdx: 0, week: 2, n: 3, kcal: 335, avgPulse: 141, durationSec: 35 * 60 },
  ];
  let kCounter = 0;
  data.sessions = seedDefs.map((sd) => {
    const key = dateKey(addDays(today, sd.off));
    const day = buildDay(WORKOUTS[sd.tplIdx], sd.week, kCounter++);
    return makeSeedSession(day, key, sd);
  });

  // История веса: −1.6 кг за месяц (как на макете) + старая точка для «Всё время»
  data.weights = [
    { date: dateKey(addDays(today, -180)), kg: 82.0 },
    { date: dateKey(addDays(today, -24)), kg: 80.0 },
    { date: dateKey(addDays(today, -18)), kg: 79.4 },
    { date: dateKey(addDays(today, -12)), kg: 78.9 },
    { date: dateKey(addDays(today, -6)), kg: 78.6 },
    { date: dateKey(addDays(today, -1)), kg: 78.4 },
  ];

  persist();
}

// Каждый день план продвигается сам по себе; пересчёт старта не нужен.

const initPromise = { current: null };

export function init() {
  if (!initPromise.current) {
    initPromise.current = (async () => {
      try {
        if (!cache) {
          cache = await readStore();
          ensureSeed(cache);
          await persist();
          notify();
        }
        return cache;
      } catch (e) {
        console.error('PULSE-INIT-ERROR:', e?.message || e, '\n', e?.stack || '');
        throw e;
      }
    })();
  }
  return initPromise.current;
}

// ─── Сохранение и анализ ──────────────────────────────────────────────────────

export function sessionsByDate(data) {
  const map = {};
  data.sessions.forEach((s) => {
    map[s.date] = map[s.date] || [];
    map[s.date].push(s);
  });
  return map;
}

// Подсчёт ккал тренировки: ~8.5 ккал/мин (метол MET для сил/кардио микса)
export function kcalFor(totalSec) {
  return Math.round((totalSec / 60) * 8.5);
}

export function saveSession(day, totalSec, avgPulse, doneNames) {
  if (!cache || !day) return null;

  const doneSet = new Set(doneNames || []);
  const doneList = (day.exercises || []).filter((ex) => doneSet.has(ex.name));
  if (doneList.length === 0) return null;

  const session = {
    id: `s_${Date.now()}`,
    date: dateKey(new Date()),
    workoutId: day.workoutId,
    title: day.title,
    category: day.category,
    level: day.level,
    durationSec: totalSec,
    kcal: kcalFor(totalSec),
    avgPulse: avgPulse || 0,
    exercisesDone: doneList.length,
    exercisesTotal: day.exercises.length,
    volumeKg: doneList.reduce((acc, x) => acc + (x.volumeKg || 0), 0),
    perExercise: doneList.map((ex) => ({
      name: ex.name,
      icon: ex.icon,
      kind: ex.kind,
      seconds: ex.seconds,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      volumeKg: ex.volumeKg,
      timePR: !!ex.timePR,
    })),
  };

  cache = {
    ...cache,
    sessions: [...cache.sessions, session],
  };
  persist();
  notify();
  return session;
}

// Личные рекорды: считаются из персистентного лога на лету (для нуля
// ре-fetch при переключениях). Формат: {value, date, kind}
export function getPRs(data = cache) {
  if (!data) return [];
  const map = {}; // name → {name, icon, kind, value, date}
  const order = [];
  const sessions = [...data.sessions].sort((a, b) => (a.date < b.date ? -1 : 1));

  sessions.forEach((session) => {
    (session.perExercise || []).forEach((ex) => {
      let candidate = null;
      let kind = null;
      if (ex.kind === 'strength') {
        kind = 'weight';
        candidate = ex.weight;
      } else if (ex.timePR) {
        kind = 'time';
        candidate = ex.seconds;
      }
      if (candidate == null) return;

      if (!map[ex.name]) {
        map[ex.name] = { name: ex.name, icon: ex.icon, kind, value: candidate, date: session.date };
        order.push(ex.name);
      } else if (candidate > map[ex.name].value) {
        map[ex.name] = { ...map[ex.name], kind, value: candidate, date: session.date, icon: ex.icon };
      }
    });
  });

  const lastSessionDate = sessions.length
    ? sessions[sessions.length - 1].date
    : null;

  return order
    .map((n) => map[n])
    .map((pr) => ({
      ...pr,
      isNew: lastSessionDate != null && pr.date === lastSessionDate,
    }))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function addWeight(kg) {
  if (!cache) return;
  const todayKey = dateKey(new Date());
  const filtered = cache.weights.filter((w) => w.date !== todayKey);
  cache = {
    ...cache,
    weights: [...filtered, { date: todayKey, kg }].sort((a, b) => (a.date < b.date ? -1 : 1)),
  };
  persist();
  notify();
}

// Стрик: сколько тренировочных дней плана подряд закрыто (заканчивая
// днём последней тренировки)
export function getStreak(data = cache) {
  if (!data) return 0;
  const byDate = sessionsByDate(data);

  // Последняя сессия
  let lastKey = null;
  data.sessions.forEach((s) => {
    if (!lastKey || s.date > lastKey) lastKey = s.date;
  });
  if (!lastKey) return 0;

  let streak = 0;
  // идём назад по календарю от дня последней сессии
  for (let i = 0; i < 120; i++) {
    const d = new Date(`${lastKey}T12:00:00`);
    d.setDate(d.getDate() - i);
    const wIdx = (d.getDay() + 6) % 7;
    if (PLAN.trainDays.indexOf(wIdx) < 0) continue; // день отдыха — пропускаем

    const key = dateKey(d);
    if (byDate[key] && byDate[key].length > 0) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

// Кол-во сессий за текущую (Пн–Вс) неделю
export function sessionsThisWeek(data = cache) {
  if (!data) return { done: 0, goal: PLAN.goalPerWeek };
  const now = new Date();
  const mondayOffset = -((now.getDay() + 6) % 7);
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const mondayKey = dateKey(monday);
  const done = data.sessions.filter((s) => s.date >= mondayKey && s.date <= dateKey(now)).length;
  return { done, goal: PLAN.goalPerWeek };
}
