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

// Универсальный кастомный диалог подтверждения — замена системному Alert.alert
// с двумя кнопками (Отмена / Действие). Стиль как у FinishModal.
export default function ConfirmModal({ visible, icon = 'profile', title, subtitle, confirmLabel = 'Подтвердить', cancelLabel = 'Отмена', onConfirm, onCancel }) {
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

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={onCancel}>
      <Animated.View style={[st.backdrop, { opacity: fade }]}>
        <Animated.View style={[st.card, { transform: [{ scale }] }]}>
          {/* Иконка */}
          <View style={st.badge}>
            <Icon name={icon} size={26} color={Colors.danger} />
          </View>

          <Text style={st.title}>{title}</Text>
          {subtitle ? <Text style={st.subtitle}>{subtitle}</Text> : null}

          {/* Кнопки */}
          <TouchableOpacity style={st.primaryBtn} activeOpacity={0.85} onPress={onConfirm} accessibilityLabel={confirmLabel}>
            <Text style={[st.primaryText, { color: Colors.danger }]}>
              {confirmLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={st.ghostBtn} activeOpacity={0.85} onPress={onCancel}>
            <Text style={st.ghostText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const { width: W } = Dimensions.get('window');

const st = {
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
  primaryBtn: {
    width: '100%',
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    borderRadius: radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.4)',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ghostBtn: {
    width: '100%',
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
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
