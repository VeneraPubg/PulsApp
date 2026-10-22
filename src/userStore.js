import AsyncStorage from '@react-native-async-storage/async-storage';

const STORE_KEY = 'pulse_store_v1';

/**
 * Формат хранилища:
 * { accounts: { [id]: { id, name, contact, method, password } }, session: id|null }
 * id = `${method}:${contact.toLowerCase()}`
 */

async function readStore() {
  try {
    const raw = await AsyncStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { accounts: parsed.accounts || {}, session: parsed.session || null };
    }
  } catch (e) {
    // повреждённое хранилище — начинаем с чистого листа
  }
  return { accounts: {}, session: null };
}

async function writeStore(store) {
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function publicUser(account) {
  if (!account) return null;
  return { ...account };
}

export async function loadSession() {
  const store = await readStore();
  return publicUser(store.accounts[store.session]);
}

export async function registerUser({ name, contact, method, password }) {
  const store = await readStore();
  const id = `${method}:${contact.toLowerCase()}`;
  if (store.accounts[id]) {
    return { error: 'Такой аккаунт уже зарегистрирован. Войдите.' };
  }
  store.accounts[id] = { id, name, contact, method, password };
  store.session = id;
  await writeStore(store);
  return { user: publicUser(store.accounts[id]) };
}

export async function loginUser({ contact, password }) {
  const store = await readStore();
  const idE = `email:${contact.toLowerCase()}`;
  const idP = `phone:${contact.toLowerCase()}`;
  const account = store.accounts[idE] || store.accounts[idP];
  if (!account) {
    return { error: 'Аккаунт не найден. Зарегистрируйтесь.' };
  }
  if (account.password !== password) {
    return { error: 'Неверный пароль.' };
  }
  store.session = account.id;
  await writeStore(store);
  return { user: publicUser(account) };
}

export async function updateUser(user, patch) {
  const store = await readStore();
  const id = user.id;
  if (!store.accounts[id]) {
    return { error: 'Аккаунт не найден.' };
  }
  const account = store.accounts[id];
  const next = {
    ...account,
    ...patch,
    id: account.id,
    method: account.method,
  };
  if (next.contact && next.contact.toLowerCase() !== account.contact.toLowerCase()) {
    const newId = `${account.method}:${next.contact.toLowerCase()}`;
    if (newId !== account.id && store.accounts[newId]) {
      return { error: 'Такой аккаунт уже существует.' };
    }
    delete store.accounts[account.id];
    next.id = newId;
    store.accounts[newId] = next;
    store.session = newId;
  }
  store.accounts[next.id] = next;
  await writeStore(store);
  return { user: publicUser(next) };
}

export async function signOutUser() {
  const store = await readStore();
  store.session = null;
  await writeStore(store);
}
