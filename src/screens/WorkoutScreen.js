import React from 'react';
import {
  StatusBar,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { Colors, radius, shadow } from '../theme';
import { WORKOUTS } from '../data';

const { width } = Dimensions.get('window');

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DAYS_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export default function WorkoutScreen({ navigation }) {
  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Пн=0
  const dayNum = today.getDate();
  const month = today.toLocaleString('ru-RU', { month: 'long' }).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <Text style={styles.date}>{`${DAYS_FULL[dayIndex]}, ${dayNum} октября`}</Text>
        <Text style={styles.greeting}>ТВОЙ РИТМ, САША.</Text>
        <TouchableOpacity style={styles.bell}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Календарь 7 дней */}
        <View style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>7 дней в ритме</Text>
          <Text style={styles.calendarSub}>Цель: недель · 4 тренировки</Text>
          <View style={styles.daysRow}>
            {DAYS.map((d, i) => {
              const isToday = i === dayIndex;
              const isActive = i <= dayIndex;
              return (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.dayBtn,
                    isToday && styles.dayToday,
                    isActive && styles.dayActive,
                  ]}
                >
                  <View style={styles.dayCircle}>
                    <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.dayName, isToday && styles.dayNameToday]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Сегодняшняя тренировка */}
        <View style={styles.workoutCard}>
          <TouchableOpacity
            style={styles.workoutBodyWrap}
            onPress={() => navigation.navigate('WorkoutDetail', { workout: WORKOUTS[0] })}
          >
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTag}>СЕГОДНЯШНЯЯ ТРЕНИРОВКА</Text>
            <Text style={styles.bookmark}>🔖</Text>
          </View>
          <View style={styles.workoutBody}>
            <Text style={styles.workoutCategory}>СИЛА · ВЫНОСЛИВОСТЬ</Text>
            <Text style={styles.workoutTitle}>ВСЕ ТЕЛО.\nПОЛНАЯ ОТДАЧА.</Text>
            <View style={styles.workoutMeta}>
              <Text style={styles.workoutMetaItem}>35 мин · 8 упражнений</Text>
              <Text style={styles.workoutMetaItem}>Средний уровень</Text>
            </View>
          </View>
          <View style={styles.workoutBottom}>
            <Text style={styles.workoutBottomLeft}>Нажмите, чтобы начать</Text>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={styles.startText}>Начать тренировку</Text>
              <Text style={styles.startIcon}>▶</Text>
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        </View>

        {/* Активность сегодня */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>АКТИВНОСТЬ СЕГОДНЯ</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statRing}>
                <Text style={styles.statRingValue}>72%</Text>
                <Text style={styles.statRingLabel}>из плана</Text>
              </View>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statBig}>360</Text>
              <Text style={styles.statSmall}>/ 500 ккал</Text>
              <Text style={styles.statSmall}>6 420 шагов · 24 мин движения</Text>
            </View>
          </View>
        </View>

        {/* План */}
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>ТВОЙ ПЛАН · Silinae за 4 недели</Text>
          <View style={styles.planItem}>
            <Text style={styles.planText}>Недель 2 из 4 · Он снабжает тело</Text>
            <Text style={styles.planArrow}>›</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  date: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  bell: { padding: 6 },
  bellIcon: { fontSize: 24 },
  scroll: { paddingBottom: 20 },
  calendarCard: {
    backgroundColor: Colors.surface,
    borderRadius: radius,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    ...shadow,
  },
  calendarTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 6,
  },
  calendarSub: {
    fontSize: 11,
    color: Colors.gray,
    marginBottom: 12,
  },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayBtn: { alignItems: 'center', width: 44 },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    ...shadow,
  },
  dayToday: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  dayActive: {
    borderColor: Colors.surface2,
    backgroundColor: Colors.surface2,
  },
  dayNum: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.white,
  },
  dayNumToday: { color: Colors.bg },
  dayName: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.grayDark,
  },
  dayNameToday: { color: Colors.green },
  workoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: radius,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 16,
    ...shadow,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  workoutTag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookmark: { fontSize: 18 },
  workoutBodyWrap: { padding: 16, paddingTop: 8 },
  workoutBody: { padding: 16, paddingTop: 8 },
  workoutCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.green,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 32,
  },
  workoutMeta: { marginTop: 12, flexDirection: 'row', gap: 16 },
  workoutMetaItem: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '800',
  },
  workoutBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  workoutBottomLeft: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
  },
  startBtn: {
    backgroundColor: Colors.green,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadow,
  },
  startText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.bg,
  },
  startIcon: { fontSize: 16, fontWeight: '900', color: Colors.bg },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: radius,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    ...shadow,
  },
  statsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 16,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { marginRight: 20 },
  statRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 8,
    borderColor: Colors.greenDim,
    borderTopColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...shadow,
  },
  statRingValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
  },
  statRingLabel: { fontSize: 11, color: Colors.gray },
  statInfo: { flex: 1 },
  statBig: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.white,
  },
  statSmall: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: radius,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 24,
    ...shadow,
  },
  planTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 12,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  planText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  planArrow: {
    fontSize: 16,
    color: Colors.green,
    fontWeight: '900',
  },
};
