import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { Colors, radius, shadow } from '../theme';
import { WORKOUTS, PLAN, planDayInfo, dateKey, addDays, buildDayByTemplate } from '../data';
import { UserContext } from '../context';
import * as store from '../store';
import Icon from '../components/Icon';

const { width } = Dimensions.get('window');

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DAYS_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export default function WorkoutScreen({ navigation }) {
  const { user } = React.useContext(UserContext);
  const data = store.useAppData();

  const today = new Date();
  const todayKey = dateKey(today);
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Пн=0
  const dayNum = today.getDate();
  const month = today.toLocaleString('ru-RU', { month: 'long' }).toUpperCase();

  const byDate = data ? store.sessionsByDate(data) : {};
  const weekGoal = store.sessionsThisWeek(data);
  const planStart = data?.planStart || null;

  // Тренировка дня из плана (или ближайшая)
  let planned = planDayInfo(planStart, todayKey);
  if (!planned && planStart) {
    for (let i = 1; i <= 7; i++) {
      const info = planDayInfo(planStart, dateKey(addDays(today, i)));
      if (info) {
        planned = info;
        break;
      }
    }
  }
  const workout = planned || buildDayByTemplate('w1', 1);
  const firstName = (user?.name || 'Атлет').split(' ')[0];
  const weekNum = workout?.week || 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.date}>{`${DAYS_FULL[dayIndex]}, ${dayNum} ${month.toLowerCase()}`}</Text>
          <TouchableOpacity style={styles.bell}>
            <Icon name="bell" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.greeting}>{`ТВОЙ РИТМ, ${firstName.toUpperCase()}.`}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Календарь 7 дней */}
        <View style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>7 дней в ритме</Text>
          <Text style={styles.calendarSub}>{`Цель: ${weekGoal.goal} тренировки · ${weekGoal.done} готово`}</Text>
          <View style={styles.daysRow}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const d = addDays(today, i - dayIndex);
              const key = dateKey(d);
              const hasSession = !!(byDate[key] && byDate[key].length > 0);
              const isToday = i === dayIndex;
              const showCheck = i <= dayIndex && hasSession;
              return (
                <TouchableOpacity key={i} style={styles.dayBtn}>
                  <View
                    style={[
                      styles.dayCircle,
                      showCheck && styles.dayDone,
                      !showCheck && isToday && styles.dayToday,
                    ]}
                  >
                    {showCheck ? (
                      <Text style={styles.dayNumDone}>✓</Text>
                    ) : (
                      <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>{d.getDate()}</Text>
                    )}
                  </View>
                  <Text style={[styles.dayName, isToday && styles.dayNameToday]}>{DAYS[i]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Сегодняшняя тренировка */}
        <View style={styles.workoutCard}>
          <TouchableOpacity
            style={styles.workoutBodyWrap}
            onPress={() => navigation.navigate('WorkoutDetail', { workout })}
          >
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTag}>{`СЕГОДНЯШНЯЯ ТРЕНИРОВКА · НЕДЕЛЯ ${workout.week || weekNum}`}</Text>
            <Icon name="bookmark" size={18} color={Colors.white} />
          </View>
          <View style={styles.workoutBody}>
            <Text style={styles.workoutCategory}>{workout.category}</Text>
            <Text style={styles.workoutTitle}>{`${workout.title.toUpperCase()}\n${(workout.subtitle || '').toUpperCase()}`}</Text>
            <View style={styles.workoutMeta}>
              <Text style={styles.workoutMetaItem}>{`${workout.time} · ${workout.exercisesTotal} упражнений`}</Text>
              <Text style={styles.workoutMetaItem}>{workout.level}</Text>
            </View>
          </View>
          <View style={styles.workoutBottom}>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() =>
                navigation.navigate('WorkoutDetail', { workout })
              }
            >
              <Text style={styles.startText}>Начать тренировку</Text>
              <Icon name="play" size={15} color={Colors.bg} />
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
        <TouchableOpacity style={styles.planCard} activeOpacity={0.9} onPress={() => navigation.navigate('Plan')}>
          <Text style={styles.planTitle}>{`ТВОЙ ПЛАН · ${PLAN.title.toUpperCase()}`}</Text>
          <View style={styles.planItem}>
            <Text style={styles.planText}>{`Неделя ${weekNum} из ${PLAN.weeks} · Не сдавай темп`}</Text>
            <Text style={styles.planArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
    marginTop: 6,
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
  dayDone: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  dayNumDone: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.bg,
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
  workoutBodyWrap: { paddingTop: 8 },
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
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  startBtn: {
    backgroundColor: Colors.green,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
