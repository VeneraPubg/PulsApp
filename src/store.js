// ─── Хранилище активности: сессии, вес тела, личные рекорды ───────────────────
// Формат JSON в AsyncStorage:
// {
//   planStart: 'YYYY-MM-DD',            // старт плана
//   sessions: [{id,date,workoutId,title,category,level,durationSec,kcal,
//               exercisesDone,exercisesTotal,volumeKg,perExercise:[…]}],
//   weights:  [{date:'YYYY-MM-DD',kg}],
// }

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  PLAN,
  dateKey,
} from './data';
import { getToken } from './userStore';
import { api } from './api';

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
  schedulePushToCloud();
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

// ─── Демо-данные отключены ─────────────────────────────────────────────────────
// Новый аккаунт начинается ровно с 1-й недели: старт плана — день регистрации,
// никаких фейковых сессий и веса. История накапливается честно — сама.

// Каждый день план продвигается сам по себе; пересчёт старта не нужен.
function ensureSeed(data) {
  if (data.planStart) return;
  data.planStart = dateKey(new Date());
  persist();
}

// ─── Облачная синхронизация (Render API + MongoDB Atlas) ─────────────────────
// Локальное хранилище остаётся первичным для UI; сервер — синхронный серевер:
// после входа состояние подтягивается, каждое изменение отдаётся debounce-пушем.

const syncState = { token: null, timer: null, busy: false };

export async function syncAttachToken() {
  try {
    syncState.token = await getToken();
  } catch (e) {
    syncState.token = null;
  }
}

function schedulePushToCloud() {
  if (!syncState.token) return;
  if (syncState.timer) clearTimeout(syncState.timer);
  syncState.timer = setTimeout(pushToCloud, 3000);
}

async function pushToCloud() {
  if (!cache || !syncState.token || syncState.busy) return;
  syncState.busy = true;
  try {
    await api.putState(syncState.token, {
      planStart: cache.planStart,
      sessions: cache.sessions,
      weights: cache.weights,
    });
  } catch (e) {
    // сеть отлетела — локальные данные не теряются, пуш повторится
  }
  syncState.busy = false;
}

// Вызывается после входа/выхода: перечитывает токен и, при наличии,
// подтягивает облачное состояние
export async function syncRefresh() {
  await syncAttachToken();
  if (!syncState.token) return;
  await pullFromCloud();
}

async function pullFromCloud() {
  if (!syncState.token) return;
  try {
    const res = await api.getState(syncState.token);
    if (res.error || !res.activity) return;
    const a = res.activity;
    const remoteHasData =
      a && (a.planStart || (a.sessions || []).length > 0 || (a.weights || []).length > 0);
    if (!remoteHasData) return; // в облаке пусто — оставляем локальное

    cache = {
      planStart: a.planStart || dateKey(new Date()),
      sessions: Array.isArray(a.sessions) ? a.sessions : [],
      weights: Array.isArray(a.weights) ? a.weights : [],
    };
    await persist();
    notify();
  } catch (e) {
    // офлайн — работаем дальше на локальных данных
  }
}

export async function importState(remoteData) {
  if (!remoteData) return;
  cache = {
    planStart: remoteData.planStart || dateKey(new Date()),
    sessions: Array.isArray(remoteData.sessions) ? remoteData.sessions : [],
    weights: Array.isArray(remoteData.weights) ? remoteData.weights : [],
  };
  await persist();
  notify();
}

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
        // Облако: если пользователь уже залогинен на этом устройстве —
        // подтягиваем его состояние (серверное побеждает при наличии данных)
        await syncRefresh();
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

export function saveSession(day, totalSec, doneNames) {
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
