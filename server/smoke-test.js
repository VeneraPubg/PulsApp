// Локальный смоук-тест API: поднимает in-memory MongoDB и прогоняет
// весь флоу: регистрация → вход → профиль → прогресс.
// Запуск:  node smoke-test.js   (порт по умолчанию 8090)

process.env.PORT = process.env.PORT || '8090';
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri('pulseapp');

  require('./index.js');
  await new Promise((r) => setTimeout(r, 2500));

  const base = `http://localhost:${process.env.PORT}/api`;
  const j = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    return { status: res.status, data: await res.json().catch(() => null) };
  };

  let ok = true;
  const check = (name, cond) => {
    console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
    if (!cond) ok = false;
  };

  const reg = await j('/register', { method: 'POST', body: { name: 'ApiTest', method: 'email', contact: 'apitest@test.io', password: 'secret123' } });
  check('register 200 + token', reg.status === 200 && !!reg.data.token);
  check('register user payload', reg.data.user && reg.data.user.name === 'ApiTest');
  const token = reg.data.token;

  const dup = await j('/register', { method: 'POST', body: { name: 'X', method: 'email', contact: 'APItest@test.io', password: 'secret123' } });
  check('register duplicate 409', dup.status === 409);

  const short = await j('/register', { method: 'POST', body: { name: 'Y', method: 'email', contact: 'y@test.io', password: '123' } });
  check('register short password 400', short.status === 400);

  const login = await j('/login', { method: 'POST', body: { contact: 'apitest@test.io', password: 'secret123' } });
  check('login 200 + user', login.status === 200 && login.data.user.id === 'email:apitest@test.io');

  const bad = await j('/login', { method: 'POST', body: { contact: 'apitest@test.io', password: 'nope' } });
  check('login wrong password 401', bad.status === 401);

  const patch = await j('/me', { token, method: 'PATCH', body: { name: 'Кирилл', goal: 'endurance', level: 'novice' } });
  check('patch name/goal/level', patch.status === 200 && patch.data.user.name === 'Кирилл' && patch.data.user.goal === 'endurance');

  const put = await j('/state', { token, method: 'PUT', body: { planStart: '2026-10-23', sessions: [{ id: 's1', date: '2026-10-23', title: 'T', kcal: 300 }], weights: [{ date: '2026-10-23', kg: 78 }] } });
  check('put state ok', put.status === 200);

  const get = await j('/state', { token });
  check('get state roundtrip', get.status === 200 && get.data.activity.planStart === '2026-10-23' && get.data.activity.sessions.length === 1 && get.data.activity.weights[0].kg === 78);

  const noAuth = await j('/state');
  check('no token 401', noAuth.status === 401);

  // второй пользователь — изоляция данных
  const reg2 = await j('/register', { method: 'POST', body: { name: 'Other', method: 'email', contact: 'other@test.io', password: 'secret123' } });
  const get2 = await j('/state', { token: reg2.data.token });
  check('users isolated (empty state)', get2.data.activity.planStart === null && get2.data.activity.sessions.length === 0);

  console.log(ok ? '\nВСЕ ТЕСТЫ ПРОШЛИ' : '\nЕСТЬ ПРОВАЛЫ');
  process.exit(ok ? 0 : 1);
})().catch((e) => {
  console.error('smoke error:', e);
  process.exit(1);
});
