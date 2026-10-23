import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Colors, radius } from '../theme';
import Icon from '../components/Icon';
import {
  PLAN,
  planWeekDays,
  dateKey,
  formatDateShort,
  weekdayName,
} from '../data';
import * as store from '../store';

export default function PlanScreen({ navigation }) {
  const data = store.useAppData();
  const planStart = data?.planStart || null;

  const now = new Date();
  const todayKey = dateKey(now);
  const byDate = data ? store.sessionsByDate(data) : {};

  // Недели плана (по порядку тренировок 1→2→3→4, старт — день регистрации)
  const weeks = planWeekDays(planStart).map((days, wi) =>
    days.map(({ date, info }) => {
      const key = date;
      return {
        key,
        info,
        done: !!(byDate[key] && byDate[key].length > 0),
        isToday: key === todayKey,
        isPast: key < todayKey,
      };
    }),
  );

  const totalDone = weeks.flat().filter((d) => d.done).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>МОЙ ПЛАН</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.planTitle}>{PLAN.title.toUpperCase()}</Text>
        <Text style={styles.planSub}>
          {`Пройдено ${totalDone} из ${PLAN.weeks * PLAN.goalPerWeek} тренировок`}
        </Text>

        {weeks.map((days, wi) => (
          <View key={wi} style={styles.weekBlock}>
            <Text style={styles.weekTitle}>{`НЕДЕЛЯ ${wi + 1}`}</Text>
            {days.map((d) => {
              if (!d.info) return null;
              const { info } = d;
              const statusDone = d.done;
              const statusToday = d.isToday;
              const statusMissed = d.isPast && !d.done;
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[
                    styles.dayRow,
                    statusToday && styles.dayRowToday,
                  ]}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('WorkoutDetail', { workout: info, date: d.key })}
                >
                  <View
                    style={[
                      styles.dayDot,
                      statusDone && styles.dayDotDone,
                    ]}
                  >
                    <Text style={statusDone ? styles.dayDotCheck : styles.dayDotNum}>
                      {statusDone ? '✓' : info.dayNum}
                    </Text>
                  </View>
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayTitle}>{info.title}</Text>
                    <Text style={styles.daySub}>
                      {`${formatDateShort(d.key)} · ${weekdayName(d.key).toUpperCase()} · ${info.time} · ${info.exercisesTotal} упр.`}
                    </Text>
                  </View>
                  {statusToday && !statusDone ? (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>СЕГОДНЯ</Text>
                    </View>
                  ) : statusMissed ? (
                    <Text style={styles.missedText}>ПРОПУЩЕНО</Text>
                  ) : (
                    <Icon name="arrowUpRight" size={16} color={statusDone ? Colors.green : Colors.grayDark} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <Text style={styles.footNote}>
          Прогрессия нагрузки: +2,5 кг каждую неделю плана
        </Text>
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
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: '900',
    marginTop: -2,
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  planTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  planSub: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
  },
  weekBlock: {
    marginTop: 20,
    backgroundColor: Colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  weekTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.green,
    letterSpacing: 1,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface2,
    borderRadius: radius - 6,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 8,
  },
  dayRowToday: {
    borderColor: Colors.green,
  },
  dayDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotDone: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  dayDotCheck: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.bg,
  },
  dayDotNum: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
  },
  dayInfo: { flex: 1 },
  dayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  daySub: {
    fontSize: 10,
    color: Colors.gray,
    marginTop: 3,
  },
  todayBadge: {
    backgroundColor: Colors.green,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  todayBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.bg,
    letterSpacing: 0.5,
  },
  missedText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.grayDark,
    letterSpacing: 0.5,
  },
  footNote: {
    fontSize: 11,
    color: Colors.grayDark,
    textAlign: 'center',
    marginTop: 6,
  },
};
