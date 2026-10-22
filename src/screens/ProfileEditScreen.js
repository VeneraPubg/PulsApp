import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useContext } from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { Colors, radius } from '../theme';
import { updateUser } from '../userStore';
import { UserContext } from '../context';
import Icon from '../components/Icon';

const GOALS = [
  { id: 'loss', title: 'Похудение' },
  { id: 'mass', title: 'Набор массы' },
  { id: 'endurance', title: 'Выносливость' },
];

const LEVELS = ['Новичок', 'Средний', 'Продвинутый'];

export default function ProfileEditScreen({ route, navigation }) {
  const { user } = route.params || {};
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || '');
  const [contact, setContact] = useState(user?.contact || '');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState(user?.goal || 'loss');
  const [level, setLevel] = useState(user?.level || 1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setError('');
    if (!name.trim()) {
      setError('Введите имя.');
      return;
    }
    if (!contact.trim()) {
      setError('Введите почту или номер телефона.');
      return;
    }
    if (password.length > 0 && password.length < 6) {
      setError('Новый пароль — не менее 6 символов.');
      return;
    }
    setBusy(true);
    const patch = { name: name.trim(), contact: contact.trim(), goal, level };
    if (password.length > 0) patch.password = password;
    const result = await updateUser(user, patch);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setUser(result.user);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>РЕДАКТИРОВАНИЕ</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>ТВОЙ ПРОФИЛЬ.</Text>
        <View style={styles.titleDash} />

        {/* Имя */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>ИМЯ</Text>
          <View style={styles.inputRow}>
            <Icon name="user" size={15} color={Colors.gray} style={styles.inputIcon} />
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

        {/* Контакт */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>{user?.method === 'phone' ? 'НОМЕР ТЕЛЕФОНА' : 'EMAIL'}</Text>
          <View style={styles.inputRow}>
            <Icon
              name={user?.method === 'phone' ? 'phone' : 'mail'}
              size={15}
              color={Colors.gray}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={user?.method === 'phone' ? '+7-900-123-45-67' : 'name@test.com'}
              placeholderTextColor={Colors.grayDark}
              value={contact}
              onChangeText={setContact}
              autoCapitalize="none"
              keyboardType={user?.method === 'phone' ? 'phone-pad' : 'email-address'}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Новый пароль */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>НОВЫЙ ПАРОЛЬ (НЕОБЯЗАТЕЛЬНО)</Text>
          <View style={styles.inputRow}>
            <Icon name="lock" size={15} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Не менее 6 символов"
              placeholderTextColor={Colors.grayDark}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Цель */}
        <Text style={styles.label}>ЦЕЛЬ</Text>
        <View style={styles.chipsRow}>
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[styles.chip, goal === g.id && styles.chipActive]}
              onPress={() => setGoal(g.id)}
            >
              <Text style={[styles.chipText, goal === g.id && styles.chipTextActive]}>
                {g.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Уровень */}
        <Text style={styles.label}>УРОВЕНЬ</Text>
        <View style={styles.chipsRow}>
          {LEVELS.map((l, i) => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, level === i && styles.chipActive]}
              onPress={() => setLevel(i)}
            >
              <Text style={[styles.chipText, level === i && styles.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        {/* Сохранить */}
        <TouchableOpacity
          style={[styles.submitBtn, busy && styles.submitBtnDisabled]}
          activeOpacity={0.9}
          onPress={save}
          disabled={busy}
        >
          <Text style={styles.submitText}>Сохранить</Text>
          <Text style={styles.submitArrow}>→</Text>
        </TouchableOpacity>
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
    paddingBottom: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: Colors.white, fontWeight: '900' },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 1,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 36,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  titleDash: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.green,
    marginTop: 10,
    marginBottom: 18,
  },
  fieldWrap: { marginBottom: 14 },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface2,
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
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  chipActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
  },
  chipTextActive: { color: Colors.bg },
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
    marginTop: 14,
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
};
