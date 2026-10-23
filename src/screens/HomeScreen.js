import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Colors, radius, shadow } from '../theme';
import { UserContext } from '../context';
import { PLAN, planDayInfo, dateKey, addDays, weekdayIndex, formatDateShort } from '../data';
import * as store from '../store';
import Icon from '../components/Icon';

const WORKOUT_IMAGES = {
  'workout-1': require('../assets/today.jpg'),
  'workout-2': require('../assets/today.jpg'),
  'workout-3': require('../assets/today.jpg'),
  'workout-4': require('../assets/today.jpg'),
};

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];
const WEEKDAYS_FULL = [
  'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА', 'ВОСКРЕСЕНЬЕ',
];

const KCAL_GOAL = 500;
const STEPS_PER_ACTIVE_MIN = 150; // темп функциональной тренировки, шагов/мин

export default function HomeScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const firstName = (user?.name || 'Атлет').split(' ')[0];
  const data = store.useAppData();

  const now = new Date();
  const todayKey = dateKey(now);
  const weekday = weekdayIndex(now);
  const dateLabel = `${WEEKDAYS_FULL[weekday]}, ${now.getDate()} ${MONTHS[now.getMonth()].toUpperCase()}`;

  const week = Array.from({ length: 7 }, (_, i) => addDays(now, i - weekday));

  const byDate = data ? store.sessionsByDate(data) : {};
  const streak = data ? store.getStreak(data) : 0;
  const weekGoal = store.sessionsThisWeek(data);
  const planStart = data?.planStart || null;

  // Тренировка дня (или ближайшая следующая, если сегодня день отдыха)
  let planned = planDayInfo(planStart, todayKey);
  let dayTag = 'СЕГОДНЯШНЯЯ ТРЕНИРОВКА';
  let workoutKey = todayKey;
  if (!planned && planStart) {
    for (let i = 1; i <= 7; i++) {
      const key = dateKey(addDays(now, i));
      const info = planDayInfo(planStart, key);
      if (info) {
        planned = info;
        workoutKey = key;
        dayTag = `БЛИЖАЙШАЯ · ${formatDateShort(key).toUpperCase()}`;
        break;
      }
    }
  }
  const workout = planned;

  // Всё движение дня — только из реальных действий: на свежем аккаунте нули,
  // каждая завершённая сегодня тренировка добавляет минуты/шаги/ккал
  const todaySessions = byDate[todayKey] || [];

  const workoutMinToday = todaySessions.reduce((acc, s) => acc + Math.round((s.durationSec || 0) / 60), 0);
  const activeMinToday = workoutMinToday;
  const stepsToday = workoutMinToday * STEPS_PER_ACTIVE_MIN;
  const stepsLabel = stepsToday.toLocaleString('ru-RU');
  const kcalToday = todaySessions.reduce((acc, s) => acc + (s.kcal || 0), 0);
  const progress = Math.min(1, kcalToday / KCAL_GOAL);

  // Номер недели плана
  const weekNum = workout ? workout.week : 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Дата + приветствие + колокольчик */}
        <Text style={styles.dateLabel}>{dateLabel}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{`ТВОЙ РИТМ, ${firstName.toUpperCase()}.`}</Text>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.9}>
            <Icon name="bell" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Полоса ритма */}
        <View style={styles.streakRow}>
          <View style={styles.streakLeftWrap}>
            <Icon name="bolt" size={14} color={Colors.green} />
            <Text style={styles.streakLeft}>{`${streak} ${pluralDays(streak)} в ритме`}</Text>
          </View>
          <Text style={styles.streakRight}>{`Цель недели: ${weekGoal.goal} тренировки · ${weekGoal.done} сделано`}</Text>
        </View>

        {/* Календарь недели */}
        <View style={styles.weekRow}>
          {week.map((d, i) => {
            const key = dateKey(d);
            const hasSession = !!(byDate[key] && byDate[key].length > 0);
            const isPast = i < weekday;
            const isToday = i === weekday;
            const showCheck = (isPast || isToday) && hasSession;
            return (
              <View key={i} style={styles.dayCol}>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelActive]}>
                  {DAY_NAMES[i]}
                </Text>
                <View
                  style={[
                    styles.dayCircle,
                    showCheck && styles.dayCircleDone,
                    !showCheck && isToday && styles.dayCircleToday,
                  ]}
                >
                  {showCheck ? (
                    <Text style={styles.dayCheck}>✓</Text>
                  ) : (
                    <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>
                      {d.getDate()}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Сегодняшняя тренировка */}
        <TouchableOpacity
          style={styles.workoutCard}
          activeOpacity={0.95}
          onPress={() => navigation.navigate('WorkoutDetail', { workout, date: workoutKey })}
        >
          <Image
            source={(workout && WORKOUT_IMAGES[workout.image]) || WORKOUT_IMAGES['workout-1']}
            style={styles.workoutImage}
            resizeMode="cover"
          />
          <View style={styles.workoutOverlay} />
          <View style={styles.workoutTop}>
            <Text style={styles.workoutTag}>{dayTag}</Text>
            <Icon name="bookmark" size={18} color={Colors.white} />
          </View>
          <View style={styles.workoutBody}>
            <Text style={styles.workoutCategory}>{workout?.category || 'ТРЕНИРОВКА'}</Text>
            <Text style={styles.workoutTitle}>{`${(workout?.title || 'Тренировка').toUpperCase()}.\n${(workout?.subtitle || '').toUpperCase()}`}</Text>
            <Text style={styles.workoutMeta}>
              {`${workout?.time || ''}  ·  ${workout?.exercisesTotal || 0} упражнений  ·  ${workout?.level || ''}`}
            </Text>
            <View style={styles.startBtn}>
              <Text style={styles.startText}>Начать тренировку</Text>
              <Icon name="play" size={15} color={Colors.bg} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Активность */}
        <View style={styles.activityCard}>
          {renderRing(progress, kcalToday)}
          <View style={styles.activityInfo}>
            <Text style={styles.activityLabel}>АКТИВНОСТЬ СЕГОДНЯ</Text>
            <Text style={styles.activityValue}>
              {kcalToday} <Text style={styles.activityGray}>/ {KCAL_GOAL} ккал</Text>
            </Text>
            <Text style={styles.activityMeta}>
              {`${stepsLabel} шагов  ·  ${activeMinToday} мин движения`}
            </Text>
            {workoutMinToday > 0 && (
              <Text style={styles.activityExtra}>
                {`Тренировки: ${workoutMinToday} мин · ${todaySessions.reduce((acc, s) => acc + (s.kcal || 0), 0)} ккал`}
              </Text>
            )}
          </View>
        </View>

        {/* Твой план */}
        <TouchableOpacity
          style={styles.planCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Plan')}
        >
          <View style={styles.planInfo}>
            <Text style={styles.planTitle}>{`Твой план «${PLAN.title}»`}</Text>
            <Text style={styles.planSub}>{`Неделя ${weekNum} из ${PLAN.weeks}  ·  Не сдавай темп`}</Text>
          </View>
          <View style={styles.planArrow}>
            <Icon name="arrowUpRight" size={17} color={Colors.green} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function pluralDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}

function renderRing(progress, kcalToday) {
  const ringR = 44;
  const ringC = 2 * Math.PI * ringR;
  return (
    <View style={styles.ringWrap}>
      <Svg width={ringR * 2 + 12} height={ringR * 2 + 12}>
        <Circle
          cx={ringR + 6}
          cy={ringR + 6}
          r={ringR}
          stroke={Colors.surface2}
          strokeWidth={9}
          fill="none"
        />
        <Circle
          cx={ringR + 6}
          cy={ringR + 6}
          r={ringR}
          stroke={Colors.green}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${ringC * progress} ${ringC}`}
          transform={`rotate(-90 ${ringR + 6} ${ringR + 6})`}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={styles.ringValue}>{`${Math.round(progress * 100)}%`}</Text>
        <Text style={styles.ringSub}>от цели</Text>
      </View>
    </View>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  dateLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 1,
    marginTop: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
    marginRight: 12,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  streakLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  streakLeft: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.green,
    flexShrink: 0,
  },
  streakRight: {
    fontSize: 12,
    color: Colors.gray,
    flex: 1,
    textAlign: 'right',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray,
  },
  dayLabelActive: { color: Colors.green },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleDone: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  dayCircleToday: {
    backgroundColor: Colors.bg,
    borderColor: Colors.green,
    borderWidth: 2,
  },
  dayCheck: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.bg,
  },
  dayNum: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  dayNumToday: { color: Colors.green },
  workoutCard: {
    marginTop: 18,
    height: 340,
    borderRadius: radius + 4,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workoutImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  workoutOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,10,10,0.55)',
  },
  workoutTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  workoutTag: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.8,
  },
  workoutBody: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  workoutCategory: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.green,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  workoutTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  workoutMeta: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 8,
    marginBottom: 14,
  },
  startBtn: {
    backgroundColor: Colors.green,
    borderRadius: 26,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow,
  },
  startText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.bg,
  },
  activityCard: {
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: radius + 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringValue: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.white,
  },
  ringSub: {
    fontSize: 9,
    color: Colors.gray,
    marginTop: 1,
  },
  activityInfo: { flex: 1 },
  activityLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 0.6,
  },
  activityValue: {
    fontSize: 25,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 4,
  },
  activityGray: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gray,
  },
  activityMeta: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 4,
  },
  activityExtra: {
    fontSize: 10,
    color: Colors.grayDark,
    marginTop: 3,
  },
  planCard: {
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: radius + 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  planInfo: { flex: 1 },
  planTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.white,
  },
  planSub: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 3,
  },
  planArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
