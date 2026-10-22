import React, { useState, useEffect, useCallback } from 'react';
import {
  StatusBar,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

import { Colors, radius } from '../theme';

const { width } = Dimensions.get('window');

const EXERCISES = [
  { name: 'Планка', date: '03 / 08 · 45 сек', time: '03:22' },
  { name: 'Скалолаз', date: '04 / 08 · 45 сек', time: '02:18' },
];

export default function WorkoutDetailScreen({ route }) {
  const { workout } = route.params || {};
  const [seconds, setSeconds] = useState(38);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const toggle = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsPaused((p) => !p);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.close} onPress={reset}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.subtitle}>все тело</Text>
          <Text style={styles.subtitleSmall}>Круг 1 из 3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.music} onPress={reset}>
          <Text style={styles.musicIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          <View style={styles.progressLine} />
          <Text style={styles.progressText}>УПРАЖНЕНИЕ 02 / 08</Text>
        </View>

        <View style={styles.title}>
          <Text style={styles.exercise}>{workout?.title || 'БЕРПИ'}</Text>
          <Text style={styles.exerciseSub}>
            Мягкое прижатие. Держи темп.
          </Text>
        </View>

        {/* Таймер */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>ОСТАЛОСЬ</Text>
          <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
          <Text style={styles.timerSub}>из 45 секунд</Text>
        </View>

        {/* Метрики */}
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>ОБЩЕЕ ВРЕМЯ</Text>
            <Text style={styles.metricValue}>{formatTime(198)}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>ПУЛЬС, УД/МИН</Text>
            <Text style={styles.metricValue} style={{ color: Colors.green }}>
              142
            </Text>
          </View>
        </View>

        <View style={styles.divider}>
          <Text style={styles.dividerText}>ДАЛЬШЕ — ПЛАНКА</Text>
        </View>

        <View style={styles.prevRow}>
          <TouchableOpacity style={styles.prevCard} activeOpacity={0.9}>
            <View style={styles.prevImage}>🏋️</View>
            <View style={styles.prevInfo}>
              <Text style={styles.prevTitle}>Планка</Text>
              <Text style={styles.prevSub}>{EXERCISES[0].date}</Text>
            </View>
            <Text style={styles.prevArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.prevCard} activeOpacity={0.9}>
            <View style={styles.prevImage}>🧗</View>
            <View style={styles.prevInfo}>
              <Text style={styles.prevTitle}>Скалолаз</Text>
              <Text style={styles.prevSub}>{EXERCISES[1].date}</Text>
            </View>
            <Text style={styles.prevArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.space} />

        <TouchableOpacity style={styles.controls} activeOpacity={0.9}>
          <Text style={styles.controlsText}>Закрыть тренировку</Text>
          <View style={styles.controlsIcons}>
            <Text>⏸</Text>
            <Text>⏹</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Нижняя панель управления */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} activeOpacity={0.8} onPress={reset}>
          <Text style={styles.bottomIcon}>⏪</Text>
          <Text style={styles.bottomLabel}>Назад</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomBtn, styles.bottomBtnActive]}
          activeOpacity={0.9}
          onPress={toggle}
        >
          <View style={styles.pauseWrap}>
            <Text style={styles.pauseIcon}>{isRunning && !isPaused ? '⏸' : '▶'}</Text>
          </View>
          <Text style={styles.bottomLabelActive}>
            {isRunning && !isPaused ? 'Пауза' : 'Продолжить'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} activeOpacity={0.8} onPress={reset}>
          <Text style={styles.bottomIcon}>⏩</Text>
          <Text style={styles.bottomLabel}>Вперёд</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingBottom: 12,
  },
  close: { padding: 4 },
  closeIcon: { fontSize: 20, color: Colors.white },
  titleWrap: { flex: 1, alignItems: 'center' },
  subtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.green,
    textTransform: 'uppercase',
  },
  subtitleSmall: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
  },
  music: { padding: 4 },
  musicIcon: { fontSize: 20, color: Colors.white },
  scroll: { paddingHorizontal: 20, paddingBottom: 80 },
  progressRow: { marginTop: 4 },
  progressLine: {
    width: 60,
    height: 4,
    backgroundColor: Colors.green,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.green,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: { alignItems: 'center', marginTop: 8 },
  exercise: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 44,
  },
  exerciseSub: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  timerCard: {
    alignItems: 'center',
    marginTop: 14,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
  timerValue: {
    fontSize: 64,
    fontWeight: '900',
    color: Colors.green,
    letterSpacing: -2,
    marginTop: 4,
  },
  timerSub: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 22,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metric: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  metricDivider: { width: 1, backgroundColor: Colors.border },
  metricLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  prevRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  prevCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: Colors.surface2,
    borderRadius: radius,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  prevImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
  },
  prevInfo: { flex: 1 },
  prevTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  prevSub: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
  },
  prevArrow: {
    fontSize: 16,
    color: Colors.green,
    fontWeight: '900',
  },
  space: { height: 20 },
  controls: {
    backgroundColor: Colors.surface2,
    borderRadius: radius,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  controlsText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gray,
  },
  controlsIcons: { flexDirection: 'row', gap: 10 },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  bottomBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  bottomBtnActive: {
    backgroundColor: Colors.surface2,
    borderRadius: radius,
    paddingVertical: 10,
  },
  bottomIcon: { fontSize: 24, color: Colors.white, marginBottom: 4 },
  bottomLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray,
  },
  bottomLabelActive: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.green,
  },
  pauseWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pauseIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.bg,
  },
};
