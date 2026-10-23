import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

import { Colors, radius } from '../theme';
import Icon from './Icon';

// Кастомный диалог завершения тренировки — замена системному Alert.alert.
// variant 'simple' — ничего не сделано (2 кнопки),
// variant 'stats'  — есть прогресс, показываем итог (кнопки Сохранить/Продолжить/Выйти).
export default function FinishModal({ visible, variant, subtitle, doneCount, totalExercises, minutes, kcal, onContinue, onExit, onSave }) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    fade.setValue(0);
    scale.setValue(0.92);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, speed: 24, bounciness: 6, useNativeDriver: true }),
    ]).start();
  }, [visible, fade, scale]);

  const isStats = variant === 'stats';

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={onContinue}>
      <Animated.View style={[s.backdrop, { opacity: fade }]}>
        <Animated.View style={[s.card, { transform: [{ scale }] }]}>
          {/* Иконка */}
          <View style={[s.badge, isStats ? s.badgeGreen : s.badgeDanger]}>
            <Icon name={isStats ? 'trophy' : 'heart'} size={26} color={isStats ? Colors.green : Colors.danger} />
          </View>

          <Text style={s.title}>{isStats ? 'Завершить\nтренировку?' : 'Завершить без\nрезультата?'}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}

          {isStats && (
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
                <Text style={[s.statValue, { color: Colors.green }]}>{kcal}</Text>
                <Text style={s.statLabel}>ККАЛ</Text>
              </View>
            </View>
          )}

          {/* Кнопки */}
          {isStats ? (
            <>
              <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onSave} accessibilityLabel="Сохранить тренировку">
                <Text style={s.primaryText}>Сохранить</Text>
              </TouchableOpacity>
              <View style={s.ghostRow}>
                <TouchableOpacity style={s.ghostBtn} activeOpacity={0.85} onPress={onContinue}>
                  <Text style={s.ghostText}>Продолжить</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.ghostBtn} activeOpacity={0.85} onPress={onExit}>
                  <Text style={[s.ghostText, { color: Colors.danger }]}>Выйти</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onContinue}>
                <Text style={s.primaryText}>Продолжить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.ghostBtnWide} activeOpacity={0.85} onPress={onExit}>
                <Text style={[s.ghostText, { color: Colors.danger }]}>Выйти без результата</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const { width: W } = Dimensions.get('window');

const s = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 5, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: W - 56,
    backgroundColor: Colors.surface,
    borderRadius: radius + 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 24,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  badgeGreen: {
    backgroundColor: Colors.greenDim,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.35)',
  },
  badgeDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.35)',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 27,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 17,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: radius,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statValue: {
    fontSize: 21,
    fontWeight: '900',
    color: Colors.white,
  },
  statTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gray,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: Colors.green,
    borderRadius: radius,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    elevation: 8,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.bg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ghostRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  ghostBtn: {
    flex: 1,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
    paddingVertical: 13,
    alignItems: 'center',
  },
  ghostBtnWide: {
    width: '100%',
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  ghostText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
};
