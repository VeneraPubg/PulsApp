import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Vibration,
} from 'react-native';

import { Colors, radius } from '../theme';
import Icon from './Icon';
import { useAppSettings } from '../appSettings';

const PRAISES = [
  'МОЛОДЕЦ!',
  'ОТЛИЧНАЯ РАБОТА!',
  'ТЫ БЫЛ СИЛЬНЕЕ СЕБЯ!',
  'КРУТО!',
  'ЗАСЛУЖЕНО!',
  'ГОТОВО КАК НАДО!',
];

// Финальный экран похвалы после сохранения тренировки.
export default function PraiseModal({ visible, workoutTitle, doneCount, totalExercises, minutes, kcal, onDone }) {
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const settings = useAppSettings();
  // Случайная похвала выбирается заново при каждом открытии модала
  const [praise, setPraise] = useState(null);
  useEffect(() => {
    if (visible) setPraise(PRAISES[Math.floor(Math.random() * PRAISES.length)]);
  }, [visible, workoutTitle]);

  useEffect(() => {
    if (!visible) return;
    if (settings?.vibration !== false) {
      Vibration.vibrate([0, 250, 120, 250, 120, 500]);
    }
    fade.setValue(0);
    scale.setValue(0.9);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, speed: 22, bounciness: 7, useNativeDriver: true }),
    ]).start();
  }, [visible, fade, scale, settings]);

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={onDone}>
      <Animated.View style={[s.backdrop, { opacity: fade }]}>
        <Animated.View style={[s.card, { transform: [{ scale }] }]}>
          <View style={s.badge}>
            <Icon name="trophy" size={40} color={Colors.green} />
          </View>

          <Text style={s.praise}>{praise}</Text>
          <Text style={s.sub}>
            {`Тренировка «${workoutTitle}» сохранена`}
          </Text>

          <View style={s.stats}>
            <View style={s.stat}>
              <Text style={s.statValue}>{doneCount}<Text style={s.statTotal}>{`/${totalExercises}`}</Text></Text>
              <Text style={s.statLabel}>УПРАЖНЕНИЙ</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statValue}>{minutes}</Text>
              <Text style={s.statLabel}>МИНУТ</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statValue}>{kcal}</Text>
              <Text style={s.statLabel}>ККАЛ</Text>
            </View>
          </View>

          <TouchableOpacity style={s.doneBtn} activeOpacity={0.85} onPress={onDone}>
            <Text style={s.doneText}>Готово</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const { width: W } = Dimensions.get('window');

const s = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 5, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: W - 56,
    backgroundColor: Colors.surface,
    borderRadius: radius + 4,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.35)',
    padding: 26,
    alignItems: 'center',
    elevation: 24,
  },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.greenDim,
    borderWidth: 2,
    borderColor: 'rgba(57, 255, 20, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  praise: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.green,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sub: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    paddingVertical: 13,
    borderRadius: radius,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
  },
  statTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gray,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: Colors.green,
    borderRadius: radius,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 8,
  },
  doneText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.bg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
};
