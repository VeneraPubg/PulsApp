import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import { Colors, radius, shadow } from '../theme';
import { updateUser } from '../userStore';
import Icon from '../components/Icon';

const { width } = Dimensions.get('window');

const GOALS = [
  { id: 'loss', title: 'Похудение', sub: 'Сжигать жир и быть в тонусе', icon: 'flame' },
  { id: 'mass', title: 'Набор массы', sub: 'Растить мышцы и силу', icon: 'weights' },
  { id: 'endurance', title: 'Выносливость', sub: 'Двигаться дольше. Уставать меньше.', icon: 'bolt' },
];

const LEVELS = [
  { id: 0, title: 'Новичок', hint: 'Возвращаюсь после перерыва' },
  { id: 1, title: 'Средний', hint: 'Тренируюсь регулярно, 2-3 раза в неделю' },
  { id: 2, title: 'Продвинутый', hint: 'В спортзале почти каждый день' },
];

export default function OnboardingScreen({ user, onComplete }) {
  const [goal, setGoal] = useState(null);
  const [level, setLevel] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const buildPlan = async () => {
    if (!goal) {
      setError('Сначала выбери цель.');
      return;
    }
    setBusy(true);
    const result = await updateUser(user, { goal, level });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onComplete(result.user);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Шапка: PULSE + зелёный dash + серый dash + 01/02 */}
        <View style={styles.header}>
          <Text style={styles.appName}>PULSE</Text>
          <View style={styles.dashGreen} />
          <View style={styles.dashGray} />
          <Text style={styles.stepText}>01/02</Text>
        </View>

        {/* Баннер с фото */}
        <View style={styles.banner}>
          <Image
            source={require('../assets/onboarding.jpg')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>ТВОЯ ТОЧКА{'\n'}СТАРТА</Text>
          </View>
        </View>

        {/* Карточка выбора */}
        <View style={styles.card}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Твой фокус</Text>
            <Text style={styles.sectionLink}>ВЫБЕРИ ОДНУ</Text>
          </View>

          {/* Цели — вертикальные строки */}
          <View style={styles.goalList}>
            {GOALS.map((g) => {
              const active = goal === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.goalRow, active && styles.goalRowActive]}
                  activeOpacity={0.85}
                  onPress={() => {
                    setGoal(g.id);
                    setError('');
                  }}
                >
                  <View style={styles.goalIconWrap}>
                    <Icon
                      name={g.icon}
                      size={20}
                      color={active ? Colors.green : Colors.white}
                    />
                  </View>
                  <View style={styles.goalTextWrap}>
                    <Text style={[styles.goalTitle, active && styles.goalTitleActive]}>
                      {g.title}
                    </Text>
                    <Text style={[styles.goalSub, active && styles.goalSubActive]}>
                      {g.sub}
                    </Text>
                  </View>
                  <View style={[styles.goalRadio, active && styles.goalRadioActive]}>
                    {active && <View style={styles.goalRadioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Уровень */}
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Твой уровень</Text>
            <Text style={styles.sectionLink}>02/02</Text>
          </View>
          <View style={styles.levelsRow}>
            {LEVELS.map((l) => {
              const active = level === l.id;
              return (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.levelChip, active && styles.levelChipActive]}
                  activeOpacity={0.85}
                  onPress={() => setLevel(l.id)}
                >
                  <Text style={[styles.levelText, active && styles.levelTextActive]}>
                    {l.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.levelHint}>{LEVELS[level].hint}</Text>

          {error !== '' && <Text style={styles.error}>{error}</Text>}

          {/* Кнопка «Собрать мой план →» */}
          <TouchableOpacity
            style={[styles.planBtn, busy && styles.planBtnDisabled]}
            activeOpacity={0.9}
            onPress={buildPlan}
            disabled={busy}
          >
            <Text style={styles.planText}>Собрать мой план →</Text>
          </TouchableOpacity>
          <Text style={styles.planNote}>План можно поменять позже в профиле</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
    marginRight: 12,
  },
  dashGreen: {
    width: 26,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.green,
    marginRight: 6,
  },
  dashGray: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surface2,
    marginRight: 10,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 0.5,
  },
  banner: {
    height: 210,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  bannerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,5,5,0.45)',
  },
  bannerContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    paddingBottom: 16,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: radius + 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginTop: 16,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.white,
  },
  sectionLink: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.green,
    letterSpacing: 0.8,
  },
  goalList: {
    gap: 10,
    marginBottom: 18,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  goalRowActive: {
    borderColor: Colors.green,
    backgroundColor: Colors.greenDim,
  },
  goalIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalIcon: { fontSize: 20 },
  goalTextWrap: { flex: 1 },
  goalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.white,
  },
  goalTitleActive: { color: Colors.green },
  goalSub: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  goalSubActive: { color: Colors.textDim },
  goalRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalRadioActive: { borderColor: Colors.green },
  goalRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.green,
  },
  levelsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  levelChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  levelChipActive: {
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
    textAlign: 'center',
    marginBottom: 16,
  },
  error: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 10,
  },
  planBtn: {
    backgroundColor: Colors.green,
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  planBtnDisabled: { opacity: 0.6 },
  planText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.bg,
  },
  planNote: {
    fontSize: 11,
    color: Colors.grayDark,
    textAlign: 'center',
    marginTop: 12,
  },
};
