import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';

import { Colors, radius } from '../theme';
import {
  REMINDER_TIMES,
  useAppSettings,
  saveAppSettings,
} from '../appSettings';
import Icon from '../components/Icon';

// Экран «Настройки»: звук, вибрация, напоминания о тренировке.
// Изменения применяются мгновенно и сохраняются в AsyncStorage.
export default function SettingsScreen({ navigation }) {
  const settings = useAppSettings();

  const sound = settings?.sound !== false;
  const vibration = settings?.vibration !== false;
  const reminder = settings?.reminder === true;
  const reminderTime = settings?.reminderTime || '19:00';

  const rows = [
    {
      icon: 'volume',
      title: 'Звуковые сигналы',
      sub: 'Сигнал в конце упражнения и финале',
      value: sound,
      onChange: (v) => saveAppSettings({ sound: v }),
    },
    {
      icon: 'phone',
      title: 'Вибрация',
      sub: 'Отклик таймера и похвалы',
      value: vibration,
      onChange: (v) => saveAppSettings({ vibration: v }),
    },
    {
      icon: 'bell',
      title: 'Напоминание о тренировке',
      sub: `Ежедневно в ${reminderTime}`,
      value: reminder,
      onChange: (v) => saveAppSettings({ reminder: v }),
      isReminder: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>НАСТРОЙКИ</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {rows.map((row) => (
          <View key={row.title} style={styles.row}>
            <View style={styles.rowIcon}>
              <Icon name={row.icon} size={18} color={Colors.green} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowSub}>{row.sub}</Text>

              {row.isReminder && reminder && (
                <View style={styles.timeChips}>
                  {REMINDER_TIMES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.timeChip, t === reminderTime && styles.timeChipActive]}
                      activeOpacity={0.85}
                      onPress={() => saveAppSettings({ reminderTime: t })}
                    >
                      <Text style={[styles.timeChipText, t === reminderTime && styles.timeChipTextActive]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <Switch
              value={row.value}
              onValueChange={row.onChange}
              trackColor={{ false: Colors.surface2, true: Colors.greenDim }}
              thumbColor={row.value ? Colors.green : Colors.grayDark}
              ios_backgroundColor={Colors.surface2}
            />
          </View>
        ))}

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Напоминание сработает через систему «поделиться», пока приложение открыто, — push-уведомления без нативного модуля недоступны.
          </Text>
        </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: { flex: 1 },
  rowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  rowSub: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
  },
  timeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  timeChip: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  timeChipActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  timeChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gray,
  },
  timeChipTextActive: {
    color: Colors.bg,
  },
  note: {
    marginTop: 16,
  },
  noteText: {
    fontSize: 11,
    color: Colors.grayDark,
    lineHeight: 16,
  },
};
