import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useContext } from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Colors, radius } from '../theme';
import { UserContext } from '../context';
import { signOutUser } from '../userStore';
import Icon from '../components/Icon';

const MENU = [
  { icon: 'doc', title: 'Мои тренировки', sub: 'История и результаты' },
  { icon: 'gear', title: 'Настройки', sub: 'Уведомления и звуки' },
  { icon: 'bell', title: 'Уведомления', sub: 'Напоминания о тренировке' },
  { icon: 'save', title: 'Резервная копия', sub: 'Экспорт данных' },
  { icon: 'help', title: 'Помощь', sub: 'Частые вопросы и поддержка' },
];

export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const initial = (user?.name || 'S').trim().charAt(0).toUpperCase();

  const logout = () => {
    Alert.alert('Выйти из аккаунта?', 'Прогресс тренировок останется на устройстве.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () =>
          signOutUser().then(() => {
            setUser(null);
          }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            </View>
            <Text style={styles.name}>{user?.name || 'Атлет'}</Text>
            <Text style={styles.contact}>{user?.contact || ''}</Text>
            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ProfileEdit', { user })}
            >
              <View style={styles.editBtnRow}>
                <Icon name="edit" size={15} color={Colors.green} />
                <Text style={styles.editBtnText}>Редактировать профиль</Text>
              </View>
            </TouchableOpacity>
          </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>тренировок</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>48 ч</Text>
            <Text style={styles.statLabel}>в движении</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>98 %</Text>
            <Text style={styles.statLabel}>выполнено плана</Text>
          </View>
        </View>

        <View style={styles.sectionTitleWrap}>
          <Text style={styles.sectionTitle}>МЕНЮ</Text>
        </View>

        <View style={styles.menu}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuItem}
              activeOpacity={0.9}
            >
                <Icon name={item.icon} size={20} color={Colors.gray} />
                <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logout} activeOpacity={0.9} onPress={logout}>
          <Text style={styles.logoutText}>ВЫЙТИ ИЗ АККАУНТА</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>Pulse · версия 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 16, marginBottom: 22 },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.green,
    marginBottom: 12,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
    marginBottom: 4,
  },
  contact: {
    fontSize: 13,
    color: Colors.gray,
  },
  editBtn: {
    marginTop: 14,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  editBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.green,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitleWrap: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  menu: { gap: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface2,
    borderRadius: radius,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIcon: { fontSize: 20, width: 32, textAlign: 'center' },
  menuInfo: { flex: 1, marginHorizontal: 10 },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  menuSub: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 16,
    color: Colors.green,
    fontWeight: '900',
  },
  logout: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.danger,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 26,
  },
  version: {
    fontSize: 11,
    color: Colors.grayDark,
  },
};
