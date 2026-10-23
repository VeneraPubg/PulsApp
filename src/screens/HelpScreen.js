import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

import { Colors, radius } from '../theme';
import Icon from '../components/Icon';

const FAQ = [
  {
    q: 'Как начисляется прогресс плана?',
    a: 'План «Сильнее за 4 недели» — 4 тренировки в неделю (Пн, Ср, Пт, Вс). День закрыт, когда тренировка сохранена: таймер дошёл до конца упражнений, и вы нажали «Сохранить».',
  },
  {
    q: 'Почему растут веса?',
    a: 'Прогрессия нагрузки: каждую неделю плана рабочие веса увеличиваются на 2,5 кг автоматически. База недели 1 задаётся в упражнениях плана.',
  },
  {
    q: 'Что «рекорд» у планки и моста?',
    a: 'Упражнения на удержание (планка, боковая планка, ягодичный мост) участвуют в личных рекордах по времени — максимальное удержание фиксируется на вкладке «Прогресс».',
  },
  {
    q: 'Как работает счётчик калорий?',
    a: 'Расчёт по MET для смеси силовой и кардио нагрузки: примерно 8,5 ккал в минуту, умножается на длительность тренировки.',
  },
  {
    q: 'Пульс — откуда цифры?',
    a: 'Сейчас это тренажёрная модель: пульс «разгоняется» по ходу тренировки в зависимости от типа упражнения и отражается средним значением в итогах.',
  },
  {
    q: 'Пропустил тренировку — план слетает?',
    a: 'Нет, план не сбрасывается. Пропущенный день остаётся незакрытым, на следующем занятии вы продолжаете с текущего места недели.',
  },
  {
    q: 'Куда сохраняются данные?',
    a: 'Всё хранится локально на устройстве (AsyncStorage). Профиль — в pulse_store_v1, прогресс — в pulse_activity_v2, настройки — в pulse_settings_v1. Резервная копия делается из меню профиля.',
  },
  {
    q: 'Нужна помощь от поддержки.',
    a: 'Напишите на support@pulseapp.local — отвечаем в течение рабочего дня. В письме укажите версию приложения (профиль → внизу экрана).',
  },
];

// «Помощь»: частые вопросы в виде раскрывающегося аккордеона.
export default function HelpScreen({ navigation }) {
  const [open, setOpen] = useState(null);

  const toggle = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((cur) => (cur === i ? null : i));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ПОМОЩЬ</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <TouchableOpacity
              key={item.q}
              style={[styles.item, isOpen && styles.itemOpen]}
              activeOpacity={0.9}
              onPress={() => toggle(i)}
            >
              <View style={styles.qRow}>
                <Icon name="help" size={17} color={isOpen ? Colors.green : Colors.gray} />
                <Text style={[styles.q, isOpen && styles.qOpen]}>{item.q}</Text>
                <Text style={styles.chevron}>{isOpen ? '⌃' : '⌄'}</Text>
              </View>
              {isOpen ? <Text style={styles.a}>{item.a}</Text> : null}
            </TouchableOpacity>
          );
        })}
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
  item: {
    backgroundColor: Colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  itemOpen: { borderColor: Colors.green },
  qRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  q: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  qOpen: { color: Colors.green },
  chevron: {
    fontSize: 15,
    color: Colors.gray,
    fontWeight: '900',
  },
  a: {
    fontSize: 12,
    color: Colors.textDim,
    lineHeight: 18,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
};
