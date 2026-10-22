// ─── Шаблоны тренировок ───────────────────────────────────────────────────────
// kind: 'time' — секундное упражнение (таймер в плеере);
// kind: 'strength' — силовое: sets × reps × weight (кг, базовый вес недели 1);
// timePR — участвует в личных рекордах по времени (максимум секунд удержания).

const TEMPLATES = [
  {
    id: 'w1',
    title: 'Сила и выносливость',
    subtitle: 'Все тело. Полная отдача.',
    time: '35 мин',
    exercises: '8 упражнений',
    level: 'Средний уровень',
    category: 'СИЛА',
    image: 'workout-1',
    workoutExercises: [
      { name: 'Берпи', kind: 'time', seconds: 45, icon: 'runner', hint: 'Мягкое приземление. Держи темп.' },
      { name: 'Приседания', kind: 'strength', seconds: 60, sets: 4, reps: 12, weight: 40, icon: 'squat', hint: 'Глубоко, спина прямая.' },
      { name: 'Отжимания', kind: 'time', seconds: 40, icon: 'pushup', hint: 'Локти под 45 градусов.' },
      { name: 'Тяга гантели', kind: 'strength', seconds: 60, sets: 3, reps: 10, weight: 24, icon: 'weights', hint: 'Лопатки сведены, без рывков.' },
      { name: 'Планка', kind: 'time', seconds: 50, timePR: true, icon: 'plank', hint: 'Пресс в напряжении, спина прямая.' },
      { name: 'Скалолаз', kind: 'time', seconds: 35, icon: 'mountain', hint: 'Быстрые шаги, корпус стабилен.' },
      { name: 'Махи гирей', kind: 'strength', seconds: 60, sets: 3, reps: 12, weight: 20, icon: 'weights', hint: 'Вес — от бедра, не от рук.' },
      { name: 'Скручивания', kind: 'time', seconds: 45, icon: 'refresh', hint: 'Тянитесь рёбрами к тазу.' },
    ],
  },
  {
    id: 'w2',
    title: 'Нижняя часть тела',
    subtitle: 'Ягодицы, ноги, пресс.',
    time: '28 мин',
    exercises: '6 упражнений',
    level: 'Новичок',
    category: 'НИЖНЯЯ ЧАСТЬ ТЕЛА',
    image: 'workout-2',
    workoutExercises: [
      { name: 'Приседания', kind: 'strength', seconds: 60, sets: 4, reps: 10, weight: 30, icon: 'squat', hint: 'Колени по линии стоп.' },
      { name: 'Выпады', kind: 'strength', seconds: 60, sets: 3, reps: 10, weight: 16, icon: 'walk', hint: 'Колено над стопой, шаг шире.' },
      { name: 'Румынская тяга', kind: 'strength', seconds: 60, sets: 3, reps: 10, weight: 40, icon: 'weights', hint: 'Спина прямая, тянем задней цепью.' },
      { name: 'Подъёмы на носки', kind: 'strength', seconds: 45, sets: 4, reps: 15, weight: 30, icon: 'walk', hint: 'Медленно вниз, мощно вверх.' },
      { name: 'Ягодичный мост', kind: 'time', seconds: 45, timePR: true, icon: 'plank', hint: 'Бёдра выше, ягодицы сжаты.' },
      { name: 'Планка', kind: 'time', seconds: 50, timePR: true, icon: 'plank', hint: 'Пресс в напряжении, спина прямая.' },
    ],
  },
  {
    id: 'w3',
    title: 'Верхняя часть тела',
    subtitle: 'Грудь, спина, руки, плечи.',
    time: '30 мин',
    exercises: '7 упражнений',
    level: 'Средний уровень',
    category: 'ВЕРХНЯЯ ЧАСТЬ ТЕЛА',
    image: 'workout-3',
    workoutExercises: [
      { name: 'Жим гантелей', kind: 'strength', seconds: 60, sets: 4, reps: 10, weight: 20, icon: 'weights', hint: 'Плечи вниз, без прогиба поясницы.' },
      { name: 'Отжимания', kind: 'time', seconds: 40, icon: 'pushup', hint: 'Локти под 45 градусов.' },
      { name: 'Тяга в наклоне', kind: 'strength', seconds: 60, sets: 4, reps: 10, weight: 24, icon: 'weights', hint: 'Тяни к поясу, лопатки вместе.' },
      { name: 'Подъём гантелей сидя', kind: 'strength', seconds: 50, sets: 3, reps: 12, weight: 14, icon: 'weights', hint: 'Без раскачки, ровный выдох.' },
      { name: 'Берпи', kind: 'time', seconds: 45, icon: 'runner', hint: 'Мягкое приземление. Держи темп.' },
      { name: 'Боковая планка', kind: 'time', seconds: 40, timePR: true, icon: 'plank', hint: 'Корпус — одна линия, бёдра выше.' },
      { name: 'Скручивания', kind: 'time', seconds: 45, icon: 'refresh', hint: 'Тянитесь рёбрами к тазу.' },
    ],
  },
  {
    id: 'w4',
    title: 'Кардио жиросжигание',
    subtitle: 'Интервальная тренировка.',
    time: '22 мин',
    exercises: '5 упражнений',
    level: 'Продвинутый',
    category: 'КАРДИО',
    image: 'workout-4',
    workoutExercises: [
      { name: 'Джампинг', kind: 'time', seconds: 45, icon: 'runner', hint: 'Дышите ровно. Мягкие колени.' },
      { name: 'Скалолаз', kind: 'time', seconds: 40, icon: 'mountain', hint: 'Быстрые шаги, корпус стабилен.' },
      { name: 'Берпи', kind: 'time', seconds: 50, icon: 'runner', hint: 'Держи темп до финала.' },
      { name: 'Выпады', kind: 'time', seconds: 45, icon: 'walk', hint: 'Колено над стопой, шаг шире.' },
      { name: 'Планка', kind: 'time', seconds: 60, timePR: true, icon: 'plank', hint: 'Пресс в напряжении, спина прямая.' },
    ],
  },
];

// Совместимость со старым API (карточки списков)
export const WORKOUTS = TEMPLATES;

// ─── План «Сильнее за 4 недели» ───────────────────────────────────────────────
export const PLAN = {
  id: 'plan-4w',
  title: 'Сильнее за 4 недели',
  weeks: 4,
  // Дни тренировок внутри недели: Пн, Ср, Пт, Вс
  trainDays: [0, 2, 4, 6],
  goalPerWeek: 4,
};

// Прогрессия нагрузки: +2.5 кг каждую неделю плана (шаг 1.25 для дробных)
export function weekWeight(base, week) {
  const w = Math.max(1, week);
  return Math.round((base + (w - 1) * 2.5) * 4) / 4;
}

// ─── Работа с датами ──────────────────────────────────────────────────────────
export function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(d, n) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

export function diffDays(fromKey, toKey) {
  const a = new Date(`${fromKey}T12:00:00`);
  const b = new Date(`${toKey}T12:00:00`);
  return Math.round((b - a) / 86400000);
}

// Позиция дня недели: 0 = Пн ... 6 = Вс
export function weekdayIndex(d) {
  return (d.getDay() + 6) % 7;
}

// ─── Тренировка по плану на конкретную дату ───────────────────────────────────

const DAY_SLOTS = ['Понедельник', 'Среда', 'Пятница', 'Воскресенье'];
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export function formatDateShort(key) {
  const d = new Date(`${key}T12:00:00`);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

// Собрать объект тренировки по шаблону, номеру недели и глобальному номеру k
export function buildDay(tpl, week, k) {
  const dayNum = (k % 4) + 1;
  return {
    id: `${PLAN.id}-k${k}`,
    k,
    workoutId: tpl.id,
    title: tpl.title,
    subtitle: tpl.subtitle,
    category: tpl.category,
    level: tpl.level,
    time: tpl.time,
    exercisesTotal: tpl.workoutExercises.length,
    image: tpl.image,
    week,
    dayNum,
    dayLabel: DAY_SLOTS[dayNum - 1],
    exercises: tpl.workoutExercises.map((ex) => {
      const isStrength = ex.kind === 'strength';
      const kg = isStrength ? weekWeight(ex.weight, week) : 0;
      return {
        ...ex,
        weight: kg,
        prescription: isStrength
          ? `${ex.sets} × ${ex.reps}`
          : null,
        volumeKg: isStrength ? ex.sets * ex.reps * kg : 0,
      };
    }),
  };
}

export function buildDayByTemplate(workoutId, week) {
  const tpl = WORKOUTS.find((t) => t.id === workoutId) || WORKOUTS[0];
  return buildDay(tpl, Math.max(1, week), 0);
}

// Инфо о тренировке по плану на дату key (YYYY-MM-DD). null = выходной день.
export function planDayInfo(planStartKey, key) {
  if (!planStartKey) return null;
  const diff = diffDays(planStartKey, key);
  if (diff < 0) return null;

  const target = new Date(`${key}T12:00:00`);
  const week = Math.floor(diff / 7) + 1;
  const wIdx = weekdayIndex(target);
  const pos = PLAN.trainDays.indexOf(wIdx);
  if (pos < 0) return null; // день отдыха

  const k = (week - 1) * 4 + pos;
  if (week > PLAN.weeks) return null; // план завершён
  return buildDay(WORKOUTS[k % 4], week, k);
}

// Следующая запланированная тренировка (искать вперёд до 14 дней)
export function nextPlanDay(planStartKey, key) {
  if (!planStartKey) return null;
  for (let i = 0; i <= 14; i++) {
    const probe = addDays(new Date(`${key}T12:00:00`), i);
    const info = planDayInfo(planStartKey, dateKey(probe));
    if (info) return info;
  }
  return null;
}

// Номер недели плана на дату
export function planWeek(planStartKey, key) {
  if (!planStartKey) return 1;
  const diff = Math.max(0, diffDays(planStartKey, key));
  return Math.min(PLAN.weeks, Math.floor(diff / 7) + 1);
}
