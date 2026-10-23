import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

// Аутентификация через облачный бэкенд (Render + MongoDB Atlas).
// Токен и профиль кешируются на устройстве, поэтому приложение
// работает и офлайн (прогресс при этом хранится локально).

const AUTH_KEY = 'pulse_auth_v1';

export async function loadSession() {
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user || null;
  } catch (e) {
    return null;
  }
}

export async function getToken() {
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch (e) {
    return null;
  }
}

async function saveAuth({ token, user }) {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
}

export async function registerUser({ name, contact, method, password }) {
  try {
    const data = await api.register({
      name,
      contact,
      method: method || 'email',
      password,
    });
    if (data.error) return { error: data.error };
    await saveAuth(data);
    return { user: data.user };
  } catch (e) {
    return { error: 'Нет связи с сервером. Проверьте интернет.' };
  }
}

export async function loginUser({ contact, password }) {
  try {
    const data = await api.login({ contact, password });
    if (data.error) return { error: data.error };
    await saveAuth(data);
    return { user: data.user };
  } catch (e) {
    return { error: 'Нет связи с сервером. Проверьте интернет.' };
  }
}

export async function updateUser(user, patch) {
  try {
    const token = await getToken();
    if (!token) return { error: 'Сессия истекла. Войдите снова.' };
    const data = await api.patchMe(token, patch);
    if (data.error) return { error: data.error };

    const user2 = { ...user, ...data.user };
    const token2 = token; // токен не меняется
    await saveAuth({ token: token2, user: user2 });
    return { user: user2 };
  } catch (e) {
    return { error: 'Нет связи с сервером. Проверьте интернет.' };
  }
}

export async function signOutUser() {
  // Просто сбрасываем локальную сессию; на сервере JWT без состояния.
  await AsyncStorage.removeItem(AUTH_KEY);
}
