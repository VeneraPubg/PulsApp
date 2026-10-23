import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StatusBar,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

import { Colors, radius } from '../theme';
import * as store from '../store';
import Icon from '../components/Icon';

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function dateLabel(key) {
  const d = new Date(`${key}T12:00:00`);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

function durLabel(sec) {
  const m = Math.round(sec / 60);
  return `${m} мин`;
}

// «Мои тренировки»: история всех сохранённых сессий.
export default function HistoryScreen({ navigation }) {
  const data = store.useAppData();
  const [openId, setOpenId] = useState(null);

  const sessions = [...(data?.sessions || [])].sort((a, b) => (a.date < b.date ? 1 : -1));

  const totalMin = Math.round(sessions.reduce((a, s) => a + s.durationSec, 0) / 60);
  const totalKcal = sessions.reduce((a, s) => a + s.kcal, 0);

  const toggle = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((cur) => (cur === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>МОИ ТРЕНИРОВКИ</Text>
        <View style={styles.backBtn} />
      </View>

      {sessions.length === 0 ? (
        <Text style={styles.empty}>Пока нет сохранённых тренировок.</Text>
      ) : (
        <>
          <View style={styles.summary}>
            <View style={styles.sumItem}>
              <Text style={styles.sumValue}>{sessions.length}</Text>
              <Text style={styles.sumLabel}>ТРЕНИРОВОК</Text>
            </View>
            <View style={styles.sumDivider} />
            <View style={styles.sumItem}>
              <Text style={styles.sumValue}>{totalMin}</Text>
              <Text style={styles.sumLabel}>МИНУТ ВСЕГО</Text>
            </View>
            <View style={styles.sumDivider} />
            <View style={styles.sumItem}>
              <Text style={styles.sumValue}>{totalKcal}</Text>
              <Text style={styles.sumLabel}>ККАЛ ВСЕГО</Text>
            </View>
          </View>

          <FlatList
            data={sessions}
            keyExtractor={(s) => s.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: s }) => {
              const open = openId === s.id;
              return (
                <TouchableOpacity
                  style={[styles.card, open && styles.cardOpen]}
                  activeOpacity={0.9}
                  onPress={() => toggle(s.id)}
                >
                  <View style={styles.cardHead}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{s.title}</Text>
                      <Text style={styles.cardSub}>
                        {`${dateLabel(s.date)} · ${durLabel(s.durationSec)} · ${s.kcal} ккал · ${s.exercisesDone}/${s.exercisesTotal} упр.`}
                      </Text>
                      <Text style={styles.cardMeta}>
                        {`${s.category} · ${s.level}`}
                      </Text>
                    </View>
                    <Text style={styles.cardChevron}>{open ? '⌃' : '⌄'}</Text>
                  </View>

                  {open ? (
                    <>
                      <View style={styles.divider} />
                      <Text style={styles.exListTitle}>УПРАЖНЕНИЯ</Text>
                      {(s.perExercise || []).map((ex, i) => (
                        <View key={`${ex.name}-${i}`} style={styles.exRow}>
                          <Icon name={ex.icon} size={15} color={Colors.gray} />
                          <Text style={styles.exName}>{ex.name}</Text>
                          <Text style={styles.exLoad}>
                            {ex.kind === 'strength'
                              ? `${ex.sets}×${ex.reps} · ${String(ex.weight).replace('.', ',')} кг`
                              : `${ex.seconds} сек${ex.timePR ? ' · рекорд' : ''}`}
                          </Text>
                        </View>
                      ))}
                    </>
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}
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
  summary: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: Colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
  },
  sumItem: { flex: 1, alignItems: 'center' },
  sumDivider: { width: 1, backgroundColor: Colors.border },
  sumValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
  },
  sumLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  cardOpen: { borderColor: Colors.green },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  cardSub: {
    fontSize: 11,
    color: Colors.green,
    fontWeight: '700',
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 10,
    color: Colors.gray,
    marginTop: 3,
  },
  cardChevron: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '900',
  },
  divider: { height: 1, backgroundColor: Colors.border, marginTop: 12, marginBottom: 10 },
  exListTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1,
    marginBottom: 8,
  },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  exName: {
    flex: 1,
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700',
  },
  exLoad: {
    fontSize: 11,
    color: Colors.gray,
  },
  empty: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
};
