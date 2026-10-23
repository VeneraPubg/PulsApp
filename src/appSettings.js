// ─── Настройки приложения (звук, вибрация, напоминания) ───────────────────────
// persist в AsyncStorage 'pulse_settings_v1'; считываются при старте.

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';

export const REMINDER_TIMES = ['08:00', '12:00', '16:00', '19:00', '21:00'];

const KEY = 'pulse_settings_v1';

export const DEFAULTS = {
  sound: true,
  vibration: true,
  reminder: false,
  reminderTime: '19:00',
};

let cache = null;
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(cache));
}

export async function initAppSettings() {
  if (cache) return cache;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) cache = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (e) {
    // повреждённое хранилище — дефолты
  }
  cache = cache || { ...DEFAULTS };
  notify();
  return cache;
}

export function getAppSettings() {
  return cache;
}

export async function saveAppSettings(patch) {
  cache = cache || { ...DEFAULTS };
  cache = { ...cache, ...patch };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(cache));
  } catch (e) {
    // ignore write errors
  }
  notify();
}

// Хук для компонентов: null пока не загрузилось, затем объект настроек.
// До загрузки компоненты трактуют null как «все включено» (дефолты).
export function useAppSettings() {
  const [settings, setSettings] = useState(cache);
  useEffect(() => {
    let alive = true;
    initAppSettings().then((s) => {
      if (alive) setSettings(s);
    });
    return subscribe(setSettings);
  }, []);
  return settings;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
