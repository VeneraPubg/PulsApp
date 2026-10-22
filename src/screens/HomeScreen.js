import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const GOALS = [
  { id: 'loss', title: 'Похудение', sub: 'Сжигай жир и будь в тонусе', icon: '🔥' },
  { id: 'mass', title: 'Набор массы', sub: 'Расти мышцы и силу', icon: '💪' },
  { id: 'endurance', title: 'Выносливость', sub: 'Дыши глубже, работай дольше', icon: '⚡' },
];

const LEVELS = ['Новичок', 'Средний', 'Продвинутый'];

export default function HomeScreen() {
  const [goal, setGoal] = useState('loss');
  const [level, setLevel] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appName}>PULSE</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
  <View style={styles.progressFill} />
</View>
            <Text style={styles.progressText}>01 / 02</Text>
          </View>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTop}>ТВОЙ ТОННА СТАРТА</Text>
        <Text style={styles.bannerTitle}>СТАНЬ\nСИЛЬНЕЕ\nСЕБЯ ВЧЕРА.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Цель */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Какая у тебя цель?</Text>
            <Text style={styles.sectionLink}>ВЫБРЫТЬ ДРУГУЮ</Text>
          </View>
          <View style={styles.goalsRow}>
            {GOALS.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[styles.goalCard, goal === g.id && styles.goalCardActive]}
                onPress={() => setGoal(g.id)}
              >
                <Text style={styles.goalIcon}>{g.icon}</Text>
                <Text style={[styles.goalTitle, goal === g.id && styles.goalTitleActive]}>{g.title}</Text>
                <Text style={[styles.goalSub, goal === g.id && styles.goalSubActive]}>{g.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Уровень */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Твой уровень</Text>
          <View style={styles.levelsRow}>
            {LEVELS.map((l, i) => (
              <TouchableOpacity
                key={l}
                style={[styles.levelBtn, level === i && styles.levelBtnActive]}
                onPress={() => setLevel(i)}
              >
                <Text style={[styles.levelText, level === i && styles.levelTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.levelHint}>
            Тренируйся регулярно, 2-3 раза в неделю
          </Text>
        </View>

        <View style={styles.space} />

        <TouchableOpacity style={styles.planBtn} activeOpacity={0.9}>
          <Text style={styles.planText}>Собрать мой план</Text>
        </TouchableOpacity>

        <Text style={styles.planHint}>
          Цель и уровень можно изменить в любой момент
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  progressRow: { marginLeft: 16, alignItems: 'flex-end' },
  progressBar: {
    width: 56,
    height: 4,
    backgroundColor: Colors.surface2,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.green,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.green,
  },
  banner: {
    height: 320,
    borderRadius: radius,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'flex-end',
    padding: 24,
    ...shadow,
  },
  bannerGradient: {
    position: 'absolute',
    inset: 0,
  },
  bannerTop: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.green,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 36,
    marginTop: 8,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.green,
  },
  goalsRow: { flexDirection: 'row', gap: 12 },
  goalCard: {
    flex: 1,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: radius,
    padding: 16,
    minHeight: 100,
    ...shadow,
  },
  goalCardActive: {
    backgroundColor: Colors.greenDim,
    borderColor: Colors.green,
  },
  goalIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  goalTitleActive: { color: Colors.green },
  goalSub: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  goalSubActive: { color: Colors.white },
  levelsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  levelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface2,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    ...shadow,
  },
  levelBtnActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
  },
  levelTextActive: { color: Colors.bg },
  levelHint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 10,
  },
  space: { height: 20 },
  planBtn: {
    backgroundColor: Colors.green,
    borderRadius: radius,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    ...shadow,
  },
  planText: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.bg,
  },
  planHint: {
    fontSize: 11,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 6,
  },
};
