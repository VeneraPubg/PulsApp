// Клиент бэкенда PulseApp (деплой: render.yaml → сервис pulseapp-api).
// Адрес подставляйте своего деплоя Render, если имя сервиса другое.

export const API_URL = 'https://pulseapp-api.onrender.com/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // пустой ответ — оставляем null
  }

  if (!res.ok) {
    const msg = (data && data.error) || `Ошибка сети (${res.status}).`;
    return { error: msg };
  }
  return data || {};
}

export const api = {
  register: (payload) => request('/register', { method: 'POST', body: payload }),
  login: (payload) => request('/login', { method: 'POST', body: payload }),
  me: (token) => request('/me', { token }),
  patchMe: (token, patch) => request('/me', { method: 'PATCH', body: patch, token }),
  getState: (token) => request('/state', { token }),
  putState: (token, activity) => request('/state', { method: 'PUT', body: activity, token }),
};
