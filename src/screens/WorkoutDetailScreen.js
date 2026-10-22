import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Vibration,
  NativeModules,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Colors, radius } from '../theme';
import Icon from '../components/Icon';
import * as store from '../store';

const { width } = Dimensions.get('window');

// Звуковой сигнал: нативный модуль (ToneGenerator). Если модуль недоступен —
// остаётся только вибрация.
function beep(kind) {
  try {
    const m = NativeModules.PulseBeep;
    if (m && m.beep) m.beep(kind);
  } catch (e) {
    // нет нативного модуля — без звука
  }
}

const VIBRO_END = [0, 350, 180, 350];
const VIBRO_FINISH = [0, 250, 120, 250, 120, 500];

export default function WorkoutDetailScreen({ route, navigation }) {
  const workout = route.params?.workout;
  const EXS = workout?.exercises || [];

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [displayLeft, setDisplayLeft] = useState(EXS.length ? EXS[0].seconds : 45);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [pulse, setPulse] = useState(92);
  const [pulseAvg, setPulseAvg] = useState(0);

  const idxRef = useRef(0);
  const pausedRef = useRef(false);
  const exStartRef = useRef(Date.now());
  const totalStartRef = useRef(Date.now());
  const pausedTotalRef = useRef(0);
  const pausedAtRef = useRef(null);
  const doneRef = useRef(EXS.map(() => false));
  const pulseRef = useRef(92);
  const pulseSumRef = useRef(0);
  const pulseCountRef = useRef(0);
  const finishingRef = useRef(false);

  // ── Пауза/возобновление ────────────────────────────────────────────────────
  const doPause = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    pausedAtRef.current = Date.now();
    setPaused(true);
  }, []);

  const doResume = useCallback(() => {
    if (!pausedRef.current) return null;
    const delta = Date.now() - pausedAtRef.current;
    pausedTotalRef.current += delta;
    exStartRef.current += delta; // якорь упражнения сдвигается на время паузы
    pausedAtRef.current = null;
    pausedRef.current = false;
    setPaused(false);
  }, []);

  // ── Пульс: модель разгоняется по ходу тренировки ───────────────────────────
  const updatePulse = useCallback(() => {
    const ex = EXS[idxRef.current];
    const targetBase = ex?.kind === 'strength' ? 150 : 128;
    const elapsedMin = (Date.now() - totalStartRef.current - pausedTotalRef.current) / 60000;
    const warmup = Math.min(1, elapsedMin / 4); // 4 минуты разгон
    const goal = 95 + (targetBase - 95) * warmup;
    let next = pulseRef.current + (goal - pulseRef.current) * 0.07 + (Math.random() - 0.5) * 5;
    next = Math.min(178, Math.max(88, next));
    pulseRef.current = next;
    pulseSumRef.current += next;
    pulseCountRef.current += 1;
    setPulse(Math.round(next));
    setPulseAvg(Math.round(pulseSumRef.current / pulseCountRef.current));
  }, [EXS]);

  // ── Завершение текущего упражнения (натуральный конец) ─────────────────────
  const completeExercise = useCallback(() => {
    if (finishingRef.current) return;
    const i = idxRef.current;
    doneRef.current[i] = true;

    if (i < EXS.length - 1) {
      Vibration.vibrate(VIBRO_END);
      beep('double');
      const nextIdx = i + 1;
      idxRef.current = nextIdx;
      exStartRef.current = Date.now();
      setIdx(nextIdx);
      setDisplayLeft(EXS[nextIdx].seconds);
    } else {
      // последнее упражнение готово → финал
      finishingRef.current = true;
      Vibration.vibrate(VIBRO_FINISH);
      beep('double');
      finishPrompt('Все упражнения выполнены!');
    }
  }, [EXS]);

  // ── Основной цикл таймера (якорный: корректируется после фона) ─────────────
  useEffect(() => {
    const timer = setInterval(() => {
      if (pausedRef.current || finishingRef.current) return;
      const now = Date.now();

      // общее время
      const totalSec = Math.floor((now - totalStartRef.current - pausedTotalRef.current) / 1000);
      setDisplayTotal(totalSec);

      updatePulse();

      // обратный отсчёт упражнения
      const dur = EXS[idxRef.current]?.seconds || 45;
      const left = dur - Math.floor((now - exStartRef.current) / 1000);
      if (left <= 0) {
        completeExercise();
      } else {
        setDisplayLeft(left);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [EXS, completeExercise, updatePulse]);

  // ── Сохранение сессии ──────────────────────────────────────────────────────
  const finishPrompt = (subtitle) => {
    const doneCount = doneRef.current.filter(Boolean).length;
    const totalSec = Math.max(0, Math.floor((Date.now() - totalStartRef.current - pausedTotalRef.current) / 1000));
    const avgPulse = pulseCountRef.current
      ? Math.round(pulseSumRef.current / pulseCountRef.current)
      : 0;

    if (doneCount === 0) {
      Alert.alert('Завершить без результата?', subtitle, [
        { text: 'Продолжить', onPress: resumeFromPrompt },
        { text: 'Выйти', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    const kcal = store.kcalFor(totalSec);
    Alert.alert(
      'Завершить тренировку?',
      `${subtitle} Сохранить: ${doneCount} упр. · ${Math.round(totalSec / 60)} мин · ${kcal} ккал.`,
      [
        { text: 'Продолжить', onPress: resumeFromPrompt },
        {
          text: 'Выйти без сохранения',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Сохранить',
          style: 'default',
          onPress: () => {
            const doneNames = EXS.filter((_, i) => doneRef.current[i]).map((ex) => ex.name);
            store.saveSession(workout, totalSec, avgPulse, doneNames);
            navigation.goBack();
          },
        },
      ],
    );
  };

  // «Продолжить» из промпта: снять финиш-флаг, снять паузу;
  // если последнее упражнение уже выполнено — перезапускаем его.
  const resumeFromPrompt = () => {
    const lastIdx = EXS.length - 1;
    const completedAll = idxRef.current === lastIdx && doneRef.current[lastIdx];
    finishingRef.current = false;
    if (completedAll) {
      doneRef.current[lastIdx] = false;
    }
    doResume();
    if (completedAll) {
      exStartRef.current = Date.now();
      setDisplayLeft(EXS[lastIdx].seconds);
      setIdx(lastIdx);
    }
  };

  // ── Ручные переходы ────────────────────────────────────────────────────────
  const jump = (delta) => {
    if (finishingRef.current) return;
    const cur = idxRef.current;
    const target = Math.min(EXS.length - 1, Math.max(0, cur + delta));
    if (target === cur) return;
    if (delta < 0) {
      // возвращаемся — упражнение будет выполняться заново
      doneRef.current[target] = false;
    }
    idxRef.current = target;
    exStartRef.current = Date.now();
    setIdx(target);
    setDisplayLeft(EXS[target].seconds);
  };

  const pauseToggle = () => {
    if (finishingRef.current) return;
    if (pausedRef.current) doResume();
    else doPause();
  };

  const closeFlow = () => {
    // «Завершить тренировку» и ✕ — единый флоу
    finishingRef.current = true;
    doPause();
    finishPrompt('');
  };

  // Роут без тренировки — уходим
  useEffect(() => {
    if (!workout || !workout.exercises || workout.exercises.length === 0) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return null;
  }

  const current = EXS[idx];
  const next = EXS[(idx + 1) % EXS.length];
  const next2 = EXS[(idx + 2) % EXS.length];
  const pos = (i) => (i % EXS.length) + 1;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const dur = current.seconds;
  const progress = Math.max(0, Math.min(1, displayLeft / dur));

  const prescriptionText =
    current.kind === 'strength'
      ? `${current.sets} × ${current.reps} · ${ruKg(current.weight)} кг`
      : `${dur} сек держи темп`;

  // ── Кольцо ────────────────────────────────────────────────────────────────
  const R = 78;
  const C = 2 * Math.PI * R;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.roundBtn} onPress={closeFlow}>
          <Text style={styles.roundBtnIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.subtitle}>{(workout.subtitle?.split('.')[0] || 'ТРЕНИРОВКА').toUpperCase()}</Text>
          <Text style={styles.subtitleSmall}>{`Неделя ${workout.week} · ${workout.dayLabel}`}</Text>
        </View>
        <TouchableOpacity style={styles.roundBtn}>
          <Icon name="volume" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Сегментированный прогресс */}
      <View style={styles.segments}>
        {EXS.map((ex, i) => (
          <View key={`${ex.name}-${i}`} style={styles.segment}>
            {i < idx && <View style={[styles.segmentFill, { flex: 1 }]} />}
            {i === idx && (
              <View style={[styles.segmentFill, { flex: 1 - progress }]} />
            )}
            <View style={[styles.segmentEmpty, { flex: i === idx ? progress : 1 }]} />
          </View>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.counter}>
          {`УПРАЖНЕНИЕ ${String(idx + 1).padStart(2, '0')} / ${String(EXS.length).padStart(2, '0')}`}
        </Text>
        <Text style={styles.exercise}>{current.name.toUpperCase()}</Text>
        <Text style={styles.exerciseHint}>{current.hint}</Text>

        {/* Кольцо */}
        <View style={styles.ringWrap}>
          <Svg width={R * 2 + 16} height={R * 2 + 16}>
            <Circle
              cx={R + 8}
              cy={R + 8}
              r={R}
              stroke={Colors.surface2}
              strokeWidth={8}
              fill="none"
            />
            <Circle
              cx={R + 8}
              cy={R + 8}
              r={R}
              stroke={Colors.green}
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${C * progress} ${C}`}
              transform={`rotate(-90 ${R + 8} ${R + 8})`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.ringLabel}>{paused ? 'ПАУЗА' : 'ОСТАЛОСЬ'}</Text>
            <Text style={styles.ringValue}>{formatTime(displayLeft)}</Text>
            <Text style={styles.ringSub}>{`из ${dur} секунд`}</Text>
          </View>
        </View>

        {/* Предписание упражнения */}
        <Text style={styles.prescription}>{prescriptionText.toUpperCase()}</Text>

        {/* Метрики */}
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>ОБЩЕЕ ВРЕМЯ</Text>
            <Text style={styles.metricValue}>{formatTime(displayTotal)}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>ПУЛЬС, УД/МИН</Text>
            <View style={styles.metricValueRow}>
              <Icon name="heart" size={15} color={Colors.danger} />
              <Text style={[styles.metricValue, { color: Colors.green }]}>{pulse}</Text>
            </View>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>СРЕДНИЙ ПУЛЬС</Text>
            <Text style={styles.metricValue}>{pulseAvg || '—'}</Text>
          </View>
        </View>

        {/* Дальше */}
        <View style={styles.nextRow}>
          <Text style={styles.nextLeft}>ДАЛЬШЕ — {next.name.toUpperCase()}</Text>
          <View style={styles.nextRightWrap}>
            <Text style={styles.nextRight}>Листать упражнения</Text>
            <Icon name="swap" size={12} color={Colors.grayDark} />
          </View>
        </View>

        <View style={styles.cardsRow}>
          {renderNextCard(next, pos(idx + 1), EXS.length, () => jump(1), styles)}
          {renderNextCard(next2, pos(idx + 2), EXS.length, () => jump(2), styles)}
        </View>
      </ScrollView>

      {/* Нижние контролы */}
      <View style={styles.controlsWrap}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.skipBtn} onPress={() => jump(-1)}>
            <Icon name="skipBack" size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} onPress={pauseToggle}>
            <Icon
              name={!paused ? 'pause' : 'play'}
              size={24}
              color={Colors.bg}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={() => jump(1)}>
            <Icon name="skipFwd" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.finishBtn} onPress={closeFlow}>
          <Text style={styles.finishText}>Завершить тренировку</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ruKg(kg) {
  return String(kg).replace('.', ',');
}

function renderNextCard(ex, orderIdx, total, onPress, styles) {
  const sub =
    ex.kind === 'strength'
      ? `${ex.sets}×${ex.reps} · ${ruKg(ex.weight)} кг · ${orderIdx}/${total}`
      : `${ex.seconds} сек · ${orderIdx}/${total}`;
  return (
    <TouchableOpacity style={styles.nextCard} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.nextCardIcon}>
        <Icon name={ex.icon} size={18} color={Colors.white} />
      </View>
      <View style={styles.nextCardInfo}>
        <Text style={styles.nextCardTitle}>{ex.name}</Text>
        <Text style={styles.nextCardSub}>{sub}</Text>
      </View>
      <Text style={styles.nextCardArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  roundBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnIcon: { fontSize: 15, color: Colors.white },
  titleWrap: { flex: 1, alignItems: 'center' },
  subtitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitleSmall: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
  },
  segments: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 4,
    marginBottom: 4,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surface2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  segmentFill: { backgroundColor: Colors.green },
  segmentEmpty: { backgroundColor: Colors.surface2 },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  counter: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.green,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 14,
  },
  exercise: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 40,
    marginTop: 4,
  },
  exerciseHint: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 4,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    alignSelf: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 1,
  },
  ringValue: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -1,
    marginTop: 2,
  },
  ringSub: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  prescription: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.green,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metric: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  metricDivider: { width: 1, backgroundColor: Colors.border },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.white,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 2,
  },
  nextRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  nextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  nextLeft: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextRight: {
    fontSize: 11,
    color: Colors.grayDark,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  nextCard: {
    flex: 1,
    backgroundColor: Colors.surface2,
    borderRadius: radius,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCardInfo: { flex: 1 },
  nextCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
  },
  nextCardSub: {
    fontSize: 10,
    color: Colors.gray,
    marginTop: 2,
  },
  nextCardArrow: {
    fontSize: 15,
    color: Colors.gray,
    fontWeight: '900',
  },
  controlsWrap: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  finishBtn: { alignItems: 'center', paddingVertical: 12 },
  finishText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
};
