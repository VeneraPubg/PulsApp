import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { Colors, radius } from '../theme';
import { registerUser, loginUser } from '../userStore';
import { syncRefresh } from '../store';
import Icon from '../components/Icon';

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setError('');
  };

  const switchMethod = (m) => {
    setMethod(m);
    setError('');
  };

  const submit = async () => {
    setError('');

    if (!contact.trim()) {
      setError(method === 'email' ? 'Введите почту.' : 'Введите номер телефона.');
      return;
    }
    if (password.length < 6) {
      setError('Пароль — не менее 6 символов.');
      return;
    }

    setBusy(true);
    let result;
    if (mode === 'register') {
      if (!name.trim()) {
        setBusy(false);
        setError('Введите имя.');
        return;
      }
      if (password !== password2) {
        setBusy(false);
        setError('Пароли не совпадают.');
        return;
      }
      result = await registerUser({
        name: name.trim(),
        contact: contact.trim(),
        method,
        password,
      });
    } else {
      result = await loginUser({ contact: contact.trim(), password });
    }
    setBusy(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    // После входа подтягиваем облачный прогресс (сессии/вес/план)
    syncRefresh().catch(() => {});
    onAuth(result.user);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Верхняя шапка */}
      <View style={styles.header}>
        <Text style={styles.appName}>PULSE</Text>
        <TouchableOpacity style={styles.accountPill} activeOpacity={0.9}>
          <View style={styles.accountPillRow}>
            <Icon name="lock" size={12} color={Colors.green} />
            <Text style={styles.accountPillText}>АККАУНТ</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.overtitle}>ТВОЯ ТОЧКА СТАРТА</Text>
        <Text style={styles.title}>
          {mode === 'login' ? 'ВОЙДИ В СВОЙ РИТМ.' : 'СОЗДАЙ СВОЙ РИТМ.'}
        </Text>
        <View style={styles.titleDash} />
        <Text style={styles.subtitle}>
          {mode === 'login'
            ? 'Войди в аккаунт, чтобы вернуться к тренировкам.'
            : 'Зарегистрируйся по почте или номеру телефона — и начнём.'}
        </Text>

        <View style={styles.card}>
          {/* Вход / Регистрация */}
          <View style={styles.segmentWrap}>
            <TouchableOpacity
              style={[styles.segmentBtn, mode === 'login' && styles.segmentBtnActive]}
              onPress={() => switchMode('login')}
            >
              <Text
                style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}
              >
                Вход
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, mode === 'register' && styles.segmentBtnActive]}
              onPress={() => switchMode('register')}
            >
              <Text
                style={[styles.segmentText, mode === 'register' && styles.segmentTextActive]}
              >
                Регистрация
              </Text>
            </TouchableOpacity>
          </View>

          {/* Почта / Телефон */}
          <View style={styles.methodRow}>
            <TouchableOpacity
              style={[styles.methodBtn, method === 'email' && styles.methodBtnActive]}
              onPress={() => switchMethod('email')}
            >
              <View style={styles.methodInner}>
                <Icon
                  name="mail"
                  size={14}
                  color={method === 'email' ? Colors.green : Colors.gray}
                />
                <Text
                  style={[styles.methodText, method === 'email' && styles.methodTextActive]}
                >
                  Почта
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodBtn, method === 'phone' && styles.methodBtnActive]}
              onPress={() => switchMethod('phone')}
            >
              <View style={styles.methodInner}>
                <Icon
                  name="phone"
                  size={14}
                  color={method === 'phone' ? Colors.green : Colors.gray}
                />
                <Text
                  style={[styles.methodText, method === 'phone' && styles.methodTextActive]}
                >
                  Телефон
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Имя (только для регистрации) */}
          {mode === 'register' && (
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>ИМЯ</Text>
              <View style={styles.inputRow}>
                <Icon name="user" size={14} color={Colors.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Как тебя зовут?"
                  placeholderTextColor={Colors.grayDark}
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />
              </View>
            </View>
          )}

          {/* Почта или телефон */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>{method === 'email' ? 'EMAIL' : 'НОМЕР ТЕЛЕФОНА'}</Text>
            <View style={styles.inputRow}>
              <Icon
                name={method === 'email' ? 'mail' : 'phone'}
                size={14}
                color={Colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={method === 'email' ? 'name@test.com' : '+7-900-123-45-67'}
                placeholderTextColor={Colors.grayDark}
                value={contact}
                onChangeText={setContact}
                autoCapitalize="none"
                keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Пароль */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>ПАРОЛЬ</Text>
            <View style={styles.inputRow}>
              <Icon name="lock" size={14} color={Colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Не менее 6 символов"
                placeholderTextColor={Colors.grayDark}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((s) => !s)}
              >
                <Icon
                  name={showPassword ? 'eyeOff' : 'eye'}
                  size={15}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Повтор пароля */}
          {mode === 'register' && (
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>ПОВТОРИТЕ ПАРОЛЬ</Text>
              <View style={styles.inputRow}>
                <Icon name="lock" size={14} color={Colors.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ещё раз"
                  placeholderTextColor={Colors.grayDark}
                  value={password2}
                  onChangeText={setPassword2}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                />
              </View>
            </View>
          )}

          {/* Ошибка */}
          {error !== '' && <Text style={styles.error}>{error}</Text>}

          {/* Кнопка */}
          <TouchableOpacity
            style={[styles.submitBtn, busy && styles.submitBtnDisabled]}
            activeOpacity={0.9}
            onPress={submit}
            disabled={busy}
          >
            <Text style={styles.submitText}>
              {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </Text>
            <Text style={styles.submitArrow}>→</Text>
          </TouchableOpacity>

          {/* Переключение */}
          <TouchableOpacity
            style={styles.switchWrap}
            onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? (
              <Text style={styles.switchText}>
                Нет аккаунта? <Text style={styles.switchLink}>Зарегистрироваться</Text>
              </Text>
            ) : (
              <Text style={styles.switchText}>
                Уже есть аккаунт? <Text style={styles.switchLink}>Войти</Text>
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>{'Pulse · аккаунты синхронизируются через облако'}</Text>
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
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  accountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  accountPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.green,
    letterSpacing: 0.5,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  overtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.green,
    letterSpacing: 1,
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 36,
    marginTop: 6,
    letterSpacing: -0.5,
  },
  titleDash: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.green,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 10,
    marginBottom: 18,
  },
  card: {
    backgroundColor: Colors.surface2,
    borderRadius: radius + 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: Colors.bg,
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: Colors.green },
  segmentText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.gray,
  },
  segmentTextActive: { color: Colors.bg },
  methodRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  methodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  methodBtnActive: { borderColor: Colors.green },
  methodInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
  },
  methodTextActive: { color: Colors.green },
  fieldWrap: { marginBottom: 12 },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: { fontSize: 14, marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.white,
  },
  eyeBtn: { padding: 6 },
  eyeIcon: { fontSize: 14 },
  error: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: Colors.green,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.bg,
  },
  submitArrow: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.bg,
  },
  switchWrap: { alignItems: 'center', marginTop: 14 },
  switchText: {
    fontSize: 13,
    color: Colors.gray,
  },
  switchLink: {
    fontWeight: '800',
    color: Colors.green,
  },
  note: {
    fontSize: 10,
    color: Colors.grayDark,
    textAlign: 'center',
    marginTop: 16,
  },
};
