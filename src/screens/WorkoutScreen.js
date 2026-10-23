import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useMemo, useState } from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
} from 'react-native';

import { Colors, radius, shadow } from '../theme';
import {
  EXERCISE_LIBRARY,
  EXERCISE_GUIDES,
  MUSCLE_GROUPS,
} from '../data';
import Icon from '../components/Icon';

// ─── Вкладка «Тренировки»: библиотека упражнений ──────────────────────────────
// Поиск + фильтры по группам мышц + раскрывающиеся карточки с инструкцией
// (техника, ошибки, дыхание) и упоминаниями в тренировках плана.

const KIND_LABEL = { time: 'Таймер', strength: 'Силовое' };

// Карточка одного упражнения: свёрнута — краткая нагрузка, развёрнута — инструкция.
function ExerciseCard({ ex, expanded, onToggle, hint }) {
  const guide = EXERCISE_GUIDES[ex.name];
  const isStrength = ex.kind === 'strength';

  const loadLine = isStrength
    ? `${ex.sets} × ${ex.reps} · база ${String(ex.weight).replace('.', ',')} кг`
    : `${ex.seconds} сек${ex.timePR ? ' · рекорд' : ''}`;

  const groupsShort = ex.usedIn.map((t) => t.toLowerCase());

  return (
    <TouchableOpacity
      style={[styles.exCard, expanded && styles.exCardOpen]}
      activeOpacity={0.9}
      onPress={onToggle}
    >
      <View style={styles.exHead}>
        <View style={styles.exIcon}>
          <Icon name={ex.icon} size={22} color={Colors.green} />
        </View>
        <View style={styles.exInfo}>
          <Text style={styles.exName}>{ex.name}</Text>
          <Text style={styles.exMeta}>
            {`${KIND_LABEL[ex.kind]} · ${loadLine}`}
          </Text>
          {guide ? <Text style={styles.exMuscles}>{guide.muscles}</Text> : null}
        </View>
        <Text style={styles.exChevron}>{expanded ? '⌃' : '⌄'}</Text>
      </View>

      {expanded && guide && (
        <View style={styles.exBody}>
          {/* Техника */}
          <Text style={styles.exSectionTitle}>ТЕХНИКА</Text>
          {guide.technique.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          {/* Ошибки */}
          <Text style={[styles.exSectionTitle, styles.exSectionMistakes]}>ЧАСТЫЕ ОШИБКИ</Text>
          <Text style={styles.exMistakes}>{guide.mistakes}</Text>

          {/* Дыхание */}
          <View style={styles.breathRow}>
            <Icon name="volume" size={13} color={Colors.gray} />
            <Text style={styles.breathText}>{`Дыхание: ${guide.breathing}`}</Text>
          </View>

          {/* Где встречается */}
          <View style={styles.usedRow}>
            <Icon name="bookmark" size={13} color={Colors.gray} />
            <Text style={styles.usedText}>
              {`В тренировках: ${groupsShort.join(' · ')}`}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function WorkoutScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('Все');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISE_LIBRARY.filter((ex) => {
      const inGroup = group === 'Все' || ex.groups.includes(group);
      const inQuery = !q || ex.name.toLowerCase().includes(q) ||
        (EXERCISE_GUIDES[ex.name]?.muscles || '').toLowerCase().includes(q);
      return inGroup && inQuery;
    });
  }, [query, group]);

  const toggle = (name) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((cur) => (cur === name ? null : name));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.title}>БИБЛИОТЕКА УПРАЖНЕНИЙ</Text>
        <Text style={styles.subtitle}>{`${EXERCISE_LIBRARY.length} упражнений · техника и инструкция`}</Text>
      </View>

      {/* Поиск */}
      <View style={styles.searchWrap}>
        <Icon name="help" size={16} color={Colors.grayDark} />
        <TextInput
          style={styles.searchInput}
          placeholder="Найти упражнение…"
          placeholderTextColor={Colors.grayDark}
          value={query}
          onChangeText={(t) => setQuery(t)}
          autoCorrect={false}
          returnKeyType="done"
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.searchClear}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Фильтры по группам мышц */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {MUSCLE_GROUPS.map((g) => {
          const active = g === group;
          return (
            <TouchableOpacity
              key={g}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.85}
              onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setGroup(g); }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{g.toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Список упражнений + ссылка на план */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.planBar}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Plan')}
        >
          <Icon name="calendar" size={16} color={Colors.green} />
          <Text style={styles.planBarText}>Мой план «Сильнее за 4 недели»</Text>
          <Text style={styles.planBarArrow}>›</Text>
        </TouchableOpacity>

        {filtered.map((ex) => (
          <ExerciseCard
            key={ex.name}
            ex={ex}
            hint={EXERCISE_GUIDES[ex.name]?.hint}
            expanded={expanded === ex.name}
            onToggle={() => toggle(ex.name)}
          />
        ))}

        {filtered.length === 0 && (
          <Text style={styles.empty}>Ничего не найдено — измени запрос или группу.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 3,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: Colors.surface2,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.white,
    paddingVertical: 0,
  },
  searchClear: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '900',
    padding: 4,
  },
  chipsScroll: { marginTop: 12, flexGrow: 0 },
  chips: { paddingHorizontal: 20, gap: 8 },
  chip: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  chipActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 0.5,
  },
  chipTextActive: {
    color: Colors.bg,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
  },
  planBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 12,
    ...shadow,
  },
  planBarText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
  },
  planBarArrow: {
    fontSize: 20,
    color: Colors.green,
    fontWeight: '900',
  },
  exCard: {
    backgroundColor: Colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  exCardOpen: { borderColor: Colors.green },
  exHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  exIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exInfo: { flex: 1 },
  exName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  exMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.green,
    marginTop: 3,
  },
  exMuscles: {
    fontSize: 10,
    color: Colors.gray,
    marginTop: 3,
    lineHeight: 14,
  },
  exChevron: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '900',
  },
  exBody: { marginTop: 12, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  exSectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.green,
    letterSpacing: 1,
    marginBottom: 8,
  },
  exSectionMistakes: { marginTop: 12, color: Colors.gray },
  stepRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 7,
  },
  stepNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.greenDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.green,
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: Colors.white,
    lineHeight: 17,
  },
  exMistakes: {
    fontSize: 12,
    color: Colors.textDim,
    lineHeight: 17,
  },
  breathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
  },
  breathText: {
    flex: 1,
    fontSize: 11,
    color: Colors.gray,
    lineHeight: 15,
  },
  usedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 6,
  },
  usedText: {
    flex: 1,
    fontSize: 11,
    color: Colors.grayDark,
    lineHeight: 15,
  },
  empty: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 30,
  },
};
