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

// ─── Библиотека упражнений ────────────────────────────────────────────────────
// Группы мышц для фильтров + подробные техники выполнения.
// Ключ — имя упражнения из шаблонов workoutExercises.

export const MUSCLE_GROUPS = ['Все', 'Ноги и ягодицы', 'Грудь и руки', 'Спина и плечи', 'Пресс и кор', 'Кардио'];

export const EXERCISE_GUIDES = {
  'Берпи': {
    group: 'Кардио',
    muscles: 'Грудь, трицепс, квадрицепсы, пресс, сердечная мышца',
    technique: [
      'Из стойки присядь, поставь ладони на пол перед собой.',
      'Прыжком выброси ноги назад — тело планкой, не заваливай таз.',
      'Отжавшись (опционально), закинь ноги к рукам одним движением.',
      'Выпрыгни вверх, дотягиваясь руками к потолку.',
    ],
    mistakes: 'Каменеть в пояснице при выбросе ног; приземляться «плоским» ударом — осаживай прыжок мягко.',
    breathing: 'Вдох на движении вниз, выдох на выбросе ног и при прыжке вверх.',
  },
  'Приседания': {
    group: 'Ноги и ягодицы',
    muscles: 'Квадрицепсы, ягодицы, задняя поверхность бедра, кор',
    technique: [
      'Стопы чуть шире плеч, носки слегка развёрнуты наружу.',
      'Отводя таз назад, опускайся до параллели бёдер с полом.',
      'Колени едут по линии стоп — не сваливай их внутрь.',
      'Вставай, отталкиваясь пятками, ягодицы — в сжатие вверху.',
    ],
    mistakes: 'Отрыв пятки от пола; круглая поясница; слишком быстрый подъём без контроля.',
    breathing: 'Вдох при опускании, выдох при подъёме.',
  },
  'Отжимания': {
    group: 'Грудь и руки',
    muscles: 'Грудь, трицепс, передняя дельта, кор',
    technique: [
      'Ладони чуть шире плеч, тело — одна прямая линия от шеи до пят.',
      'Опускайся, разводя локти под 45°, грудь — почти до пола.',
      'Пресс и ягодицы держи в напряжении, таз не «висит».',
      'Выжимайся вверх одним усилием, вверху — лёгкий доупор в лопатках.',
    ],
    mistakes: 'Провисшая поясница; локти расставлены на 90° к корпусу; неполная амплитуда.',
    breathing: 'Вдох на опускании, выдох на выжимании.',
  },
  'Тяга гантели': {
    group: 'Спина и плечи',
    muscles: 'Широчайшая мышца спины, задняя дельта, бицепс',
    technique: [
      'Наклонись с прямой спиной, опорная рука на бедро или устойчивую опору.',
      'Тяни гантель к поясу, ведя локоть близко к корпусу.',
      'В верхней точке сведи лопатку, задержка — 0,5 сек.',
      'Опускай подконтрольно, не бросай вес.',
    ],
    mistakes: 'Скругление спины; рывок корпусом; тяга к груди вместо пояса.',
    breathing: 'Вдох перед тягой, выдох на подъёме веса.',
  },
  'Планка': {
    group: 'Пресс и кор',
    muscles: 'Прямая мышца живота, поперечная мышца, плечевой пояс, ягодицы',
    technique: [
      'Упирайся в предплечья, локти строго под плечевыми суставами.',
      'Тело — жёсткая линия: ягодицы ниже сжимаются, поясница нейтральна.',
      'Смотри в пол перед собой, шея длинная.',
      'Дыши ровно и держи полный контакт стопы/предплечья с полом.',
    ],
    mistakes: 'Провал таза или «зад» вверх; задержка дыхания; взгляд вверх в шею.',
    breathing: 'Спокойный ритмичный дыхательный цикл без задержек.',
  },
  'Скалолаз': {
    group: 'Кардио',
    muscles: 'Пресс, сгибатели бедра, дельты, ноговые мышцы',
    technique: [
      'Старт в планке на прямых руках, ладони под плечами.',
      'Подтягивай колено к груди попеременно, таз держи низко.',
      'Скорость высокая, но корпус — стабилен, не лавируй.',
      'Стопы мягко приземляются у пальцев рук.',
    ],
    mistakes: 'Таз вверх — изоляция пресса теряется; «топанье» стопами.',
    breathing: 'Короткий вдох/выдох на каждом шаге.',
  },
  'Махи гирей': {
    group: 'Спина и плечи',
    muscles: 'Ягодицы, задняя поверхность бедра, поясница, дельты',
    technique: [
      'Ноги на ширине плеч, гиря в метре перед стопами.',
      'Сデルай наклон тазом назад, схватив гирю двумя руками.',
      'Мощный выпрямляющий толчок бёдрами вперёд — гиря летит до груди.',
      'Возвращай гирю между ног, сохраняя спину прямой.',
    ],
    mistakes: 'Вес перехватывают руками вместо бёдер; круглая поясница; приседание вместо наклона.',
    breathing: 'Вдох при замахе назад, мощный выдох в верхней точке.',
  },
  'Скручивания': {
    group: 'Пресс и кор',
    muscles: 'Прямая мышца живота, косые мышцы',
    technique: [
      'Ляг на спину, колени согнуты, стопы на полу.',
      'Тяни рёбра к тазу — отрывается только верх спины.',
      'Руки у виска или скрестно на груди, не тягать шею.',
      'Опускай подконтрольно 2 секунды, не расслабляй пресс.',
    ],
    mistakes: 'Тяга головы руками; отрыв поясницы; «зад» темпа падением вниз.',
    breathing: 'Выдох на скручивании, вдох при опускании.',
  },
  'Выпады': {
    group: 'Ноги и ягодицы',
    muscles: 'Квадрицепсы, ягодицы, бицепс бедра',
    technique: [
      'Шаг вперёд — длина чуть больше комфортной ширины стопы.',
      'Опускайся, пока заднее колено не коснётся почти пола.',
      'Переднее колено остаётся над стопой, не заезжай на носок.',
      'Встань толчком передней ноги, заднюю — приставляй.',
    ],
    mistakes: 'Колено заваливается внутрь; корпус заваливается вперёд; узкий шаг «канатоходцем».',
    breathing: 'Вдох при опускании, выдох при подъёме.',
  },
  'Румынская тяга': {
    group: 'Ноги и ягодицы',
    muscles: 'Бицепс бедра, ягодицы, разгибатели спины',
    technique: [
      'Стопы под бёдрами, гантель в прямых руках у бедра.',
      'С прямой спиной отводи таз назад, вес скользит по ногам.',
      'Ощути растяжение задней цепи — опускайся до середины голени.',
      'Вставай «скручивая» таз вперёд, ягодицы сжимаются.',
    ],
    mistakes: 'Скруглённая спина; перекачивание в коленях (превращается в приседание); отвесная гантель от ног.',
    breathing: 'Вдох вниз, выдох вверх.',
  },
  'Подъёмы на носки': {
    group: 'Ноги и ягодицы',
    muscles: 'Икроножная и камбаловидная мышцы',
    technique: [
      'Стопы параллельно, полный упор на стопу.',
      'Поднимайся на носки до максимального сокращения.',
      'Задержись сверху на 1 секунду.',
      'Опускайся медленно, 2–3 секунды вниз, до полного спокойного растяжения.',
    ],
    mistakes: 'Быстрые «пружинные» подъёмы без паузы вверх; перекос стоп; неполная амплитуда.',
    breathing: 'Выдох на подъёме, вдох на опускании.',
  },
  'Ягодичный мост': {
    group: 'Ноги и ягодицы',
    muscles: 'Ягодицы, бицепс бедра, поясница',
    technique: [
      'Спина на полу, колени согнуты, стопы около таза.',
      'Выталкивай таз вверх, сжимая ягодицы в точке максимума.',
      'Тело — от колен до плеч прямая линия.',
      'Задержись 1–2 секунды, опускайся без «удара» тазом.',
    ],
    mistakes: 'Перегиб в пояснице (боль — сигнал стоп); упор на носки вместо пяток.',
    breathing: 'Выдох на подъёме, вдох при опускании.',
  },
  'Жим гантелей': {
    group: 'Грудь и руки',
    muscles: 'Грудь, передняя дельта, трицепс',
    technique: [
      'Сядь/стань, гантели у плеч, локти чуть ниже линии плеч.',
      'Жми вверх до почти прямых рук, не «замки» локти.',
      'Лопатки сведены и опущены — грудь ведёт движение.',
      'Опускай подконтрольно до уровня дельт.',
    ],
    mistakes: 'Прогиб поясницы; разведение рук в стороны; броски гантелей вниз.',
    breathing: 'Выдох на жиме, вдох на опускании.',
  },
  'Тяга в наклоне': {
    group: 'Спина и плечи',
    muscles: 'Широчайшие, трапеции, задняя дельта, бицепс',
    technique: [
      'Корпус наклонён на 45°, спина прямая, вес в обеих руках.',
      'Тяни локти назад-вверх, к поясу.',
      'Сведи лопатки в верхней точке.',
      'Опускай медленно, сохраняя наклон.',
    ],
    mistakes: 'Раскачивание корпусом; тяга к груди; поднятая голова и запрокинутая шея.',
    breathing: 'Вдох вниз, выдох на тяге.',
  },
  'Подъём гантелей сидя': {
    group: 'Спина и плечи',
    muscles: 'Средняя и передняя дельта, трапеции',
    technique: [
      'Сядь с прямой спиной, гантели у плеч, ладони вперёд.',
      'Жми вверх, слегка сходя гантели к центру.',
      'Вверху руки почти прямые, плечи — вниз.',
      'Опускай до уровня ушей, не ниже.',
    ],
    mistakes: 'Отбивание у плеч; размахивание корпусом; жим «за голову».',
    breathing: 'Выдох на подъёме, вдох при опускании.',
  },
  'Боковая планка': {
    group: 'Пресс и кор',
    muscles: 'Косые мышцы, поперечная мышца живота, ягодичный стабилизатор',
    technique: [
      'Опираешься на предплечье и ребро стопы, тело боком.',
      'Подними таз вверх, пока корпус не станет прямой линией.',
      'Свободную руку — на пояс или вверх.',
      'Держи плечевой сустав над локтем, не заваливайся.',
    ],
    mistakes: 'Провал таза вниз; наклон корпуса вперёд; локоть не под плечом.',
    breathing: 'Ровное дыхание в такт удержанию.',
  },
  'Джампинг': {
    group: 'Кардио',
    muscles: 'Ноги, ягодицы, сердечная мышца',
    technique: [
      'Лёгкие прыжки на месте или с разворотом, колени мягкие.',
      'Приземляйся на подушечки стоп, смягчая колени.',
      'Держи темп дыхания — 2 вдоха / 2 выдоха.',
      'Убавляй амплитуду, если сердце стучит до предела.',
    ],
    mistakes: 'Жёсткое приземление на пятки; блокировка коленей; перевёрнутое дыхание.',
    breathing: 'Ритмично и носом, без задержек.',
  },
};

// Уникальные упражнения всех тренировок + их нагрузки иewhere они встречаются.
export function buildExerciseLibrary() {
  const byName = new Map();
  for (const tpl of TEMPLATES) {
    for (const ex of tpl.workoutExercises) {
      const guide = EXERCISE_GUIDES[ex.name];
      const entry = byName.get(ex.name) || {
        name: ex.name,
        icon: ex.icon,
        kind: ex.kind,
        seconds: ex.seconds,
        timePR: ex.timePR || false,
        groups: guide ? [guide.group] : [],
        usedIn: [],
      };
      if (ex.kind === 'strength') {
        entry.sets = Math.max(entry.sets || 0, ex.sets);
        entry.reps = Math.max(entry.reps || 0, ex.reps);
        entry.weight = Math.max(entry.weight || 0, ex.weight);
        if ((entry.sets !== ex.sets || entry.reps !== ex.reps) && !entry.variants) entry.variants = [];
        if (entry.variants && !entry.variants.some((v) => v.sets === ex.sets && v.reps === ex.reps && v.weight === ex.weight)) {
          entry.variants.push({ sets: ex.sets, reps: ex.reps, weight: ex.weight });
        }
      }
      if (!entry.usedIn.includes(tpl.title)) entry.usedIn.push(tpl.title);
      byName.set(ex.name, entry);
    }
  }
  return [...byName.values()];
}

export const EXERCISE_LIBRARY = buildExerciseLibrary();

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

// Реальное имя дня недели по дате (YYYY-MM-DD)
const WEEKDAYS_RU = [
  'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье',
];

export function weekdayName(key) {
  const d = new Date(`${key}T12:00:00`);
  return WEEKDAYS_RU[weekdayIndex(d)];
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

// ─── Последовательность тренировок от старта плана ───────────────────────────
// Неделя 1 начинается со ДНЯ СТАРТА: первая тренировка = день регистрации,
// неделя плана = 4 последовательные тренировки (шаблон Пн/Ср/Пт/Вс применяется
// к неделям, отсчитанным от дня старта, а не от календарного понедельника).
// Дни внутри недели плана всегда по порядку: 1 → 2 → 3 → 4.

// Смещения тренировочных дней внутри первой недели плана (от дня старта).
// Индекс массива = порядок тренировки в неделе плана (ранг).
function dayOffsetsByPos(planStartKey) {
  const start = new Date(`${planStartKey}T12:00:00`);
  const sIdx = weekdayIndex(start);
  return PLAN.trainDays
    .map((weekday, pos) => ({ pos, offset: (weekday - sIdx + 7) % 7 }))
    .sort((a, b) => a.offset - b.offset)
    .map((o) => o.offset);
}

// Дата тренировки с порядковым номером k (0..15 = неделя 1 день 1 ... неделя 4 день 4)
export function planDayDate(planStartKey, k) {
  if (!planStartKey) return null;
  const offsets = dayOffsetsByPos(planStartKey);
  const week = Math.floor(k / 4) + 1;
  const rank = k % 4;
  const start = new Date(`${planStartKey}T12:00:00`);
  return dateKey(addDays(start, (week - 1) * 7 + offsets[rank]));
}

// Собрать все недели плана: массив из PLAN.weeks массивов дней,
// дни упорядочены по k (то есть по номеру дня 1..4 внутри недели).
export function planWeekDays(planStartKey) {
  if (!planStartKey) return [];
  const weeks = Array.from({ length: PLAN.weeks }, () => []);
  for (let k = 0; k < PLAN.weeks * 4; k++) {
    const week = Math.floor(k / 4);
    weeks[week].push({
      date: planDayDate(planStartKey, k),
      info: buildDay(WORKOUTS[k % 4], week + 1, k),
    });
  }
  return weeks;
}

// Инфо о тренировке по плану на дату key (YYYY-MM-DD). null = день отдыха.
export function planDayInfo(planStartKey, key) {
  if (!planStartKey) return null;
  const diff = diffDays(planStartKey, key);
  if (diff < 0) return null;

  const offsets = dayOffsetsByPos(planStartKey);
  for (let rank = 0; rank < offsets.length; rank++) {
    const local = diff - offsets[rank];
    if (local < 0 || local % 7 !== 0) continue;
    const weekIdx = local / 7; // 0-based неделя плана
    if (weekIdx >= PLAN.weeks) return null; // план завершён
    const k = weekIdx * 4 + rank;
    return buildDay(WORKOUTS[k % 4], weekIdx + 1, k);
  }
  return null;
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

// Номер недели плана на дату: последняя неделя, в которой тренировка уже наступила
export function planWeek(planStartKey, key) {
  if (!planStartKey) return 1;
  let week = 1;
  for (let k = 0; k < PLAN.weeks * 4; k++) {
    const d = planDayDate(planStartKey, k);
    if (d && key >= d) week = Math.floor(k / 4) + 1;
  }
  return week;
}
