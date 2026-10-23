// PulseApp API — аккаунты и прогресс тренировок в MongoDB Atlas.
// Деплой: Render (Web Service, Blueprint render.yaml в корне репозитория).

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'pulse-dev-secret-change-me';
const TOKEN_TTL = '30d';

// ─── Модель ───────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    method: { type: String, enum: ['email', 'phone'], required: true },
    contact: { type: String, required: true }, // в нижнем регистре
    passwordHash: { type: String, required: true },
    // Профиль (онбординг/редактирование)
    goal: { type: String, default: null },
    level: { type: String, default: null },
    // Весь прогресс приложения целиком (формат pulse_activity_v2)
    activity: {
      planStart: { type: String, default: null },
      sessions: { type: Array, default: [] },
      weights: { type: Array, default: [] },
    },
  },
  { timestamps: true },
);
// Один аккаунт на пару метод+контакт
UserSchema.index({ method: 1, contact: 1 }, { unique: true });

const User = mongoose.model('User', UserSchema);

// ─── Помощники ────────────────────────────────────────────────────────────────
const normContact = (s) => String(s || '').trim().toLowerCase();

function publicUser(doc) {
  return {
    id: `${doc.method}:${doc.contact}`,
    _id: String(doc._id),
    name: doc.name,
    contact: doc.contact,
    method: doc.method,
    goal: doc.goal || null,
    level: doc.level || null,
  };
}

function makeToken(doc) {
  return jwt.sign({ uid: String(doc._id) }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Нужен вход в аккаунт.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.uid = payload.uid;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Сессия истекла. Войдите снова.' });
  }
}

// ─── Маршруты ─────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => res.json({ ok: true, service: 'pulseapp-api' }));
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'up' : 'down' }),
);

// Регистрация
app.post('/api/register', async (req, res) => {
  try {
    const method = req.body.method === 'phone' ? 'phone' : 'email';
    const name = String(req.body.name || '').trim();
    const contact = normContact(req.body.contact);
    const password = String(req.body.password || '');

    if (!name) return res.status(400).json({ error: 'Введите имя.' });
    if (!contact) return res.status(400).json({ error: 'Укажите email или телефон.' });
    if (password.length < 6) return res.status(400).json({ error: 'Пароль — не менее 6 символов.' });

    const exists = await User.findOne({ method, contact });
    if (exists) return res.status(409).json({ error: 'Такой аккаунт уже зарегистрирован. Войдите.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const doc = await User.create({ name, contact, method, passwordHash });
    return res.json({ user: publicUser(doc), token: makeToken(doc) });
  } catch (e) {
    if (e && e.code === 11000) {
      return res.status(409).json({ error: 'Такой аккаунт уже зарегистрирован. Войдите.' });
    }
    console.error('register:', e);
    return res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
  }
});

// Вход: пробуем и email, и телефон (в зависимости от наличия @)
app.post('/api/login', async (req, res) => {
  try {
    const contact = normContact(req.body.contact);
    const password = String(req.body.password || '');
    if (!contact) return res.status(400).json({ error: 'Укажите email или телефон.' });

    const method = contact.includes('@') ? 'email' : 'phone';
    const doc =
      (await User.findOne({ method, contact })) ||
      (await User.findOne({ contact }));
    if (!doc) return res.status(404).json({ error: 'Аккаунт не найден. Зарегистрируйтесь.' });

    const ok = await bcrypt.compare(password, doc.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Неверный пароль.' });

    return res.json({ user: publicUser(doc), token: makeToken(doc) });
  } catch (e) {
    console.error('login:', e);
    return res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
  }
});

// Профиль
app.get('/api/me', auth, async (req, res) => {
  try {
    const doc = await User.findById(req.uid);
    if (!doc) return res.status(404).json({ error: 'Аккаунт не найден.' });
    return res.json({ user: publicUser(doc) });
  } catch (e) {
    console.error('me:', e);
    return res.status(500).json({ error: 'Ошибка сервера.' });
  }
});

// Обновление профиля: name / contact / goal / level / password
app.patch('/api/me', auth, async (req, res) => {
  try {
    const doc = await User.findById(req.uid);
    if (!doc) return res.status(404).json({ error: 'Аккаунт не найден.' });

    if (req.body.name != null) doc.name = String(req.body.name).trim() || doc.name;
    if (req.body.goal != null) doc.goal = req.body.goal;
    if (req.body.level != null) doc.level = req.body.level;

    if (req.body.password) {
      const password = String(req.body.password);
      if (password.length < 6) {
        return res.status(400).json({ error: 'Пароль — не менее 6 символов.' });
      }
      doc.passwordHash = await bcrypt.hash(password, 10);
    }

    if (req.body.contact != null) {
      const contact = normContact(req.body.contact);
      const method = contact.includes('@') ? 'email' : 'phone';
      if (contact && (contact !== doc.contact || method !== doc.method)) {
        const clash = await User.findOne({ method, contact });
        if (clash && String(clash._id) !== String(doc._id)) {
          return res.status(409).json({ error: 'Такой аккаунт уже существует.' });
        }
        doc.contact = contact;
        doc.method = method;
      }
    }

    await doc.save();
    return res.json({ user: publicUser(doc) });
  } catch (e) {
    console.error('patch me:', e);
    return res.status(500).json({ error: 'Ошибка сервера.' });
  }
});

// Прогресс тренировок
app.get('/api/state', auth, async (req, res) => {
  try {
    const doc = await User.findById(req.uid, { activity: 1 });
    if (!doc) return res.status(404).json({ error: 'Аккаунт не найден.' });
    return res.json({ activity: doc.activity || {} });
  } catch (e) {
    console.error('get state:', e);
    return res.status(500).json({ error: 'Ошибка сервера.' });
  }
});

app.put('/api/state', auth, async (req, res) => {
  try {
    const a = req.body || {};
    const doc = await User.findById(req.uid);
    if (!doc) return res.status(404).json({ error: 'Аккаунт не найден.' });

    doc.activity = {
      planStart: a.planStart || null,
      sessions: Array.isArray(a.sessions) ? a.sessions.slice(-500) : [],
      weights: Array.isArray(a.weights) ? a.weights.slice(-200) : [],
    };
    await doc.save();
    return res.json({ ok: true });
  } catch (e) {
    console.error('put state:', e);
    return res.status(500).json({ error: 'Ошибка сервера.' });
  }
});

// ─── Старт ────────────────────────────────────────────────────────────────────
(async () => {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
      console.log('MongoDB подключена');
    } catch (e) {
      console.error('MongoDB не подключилась:', e.message);
    }
  } else {
    console.error('MONGODB_URI не задана — задайте переменную окружения на Render');
  }

  app.listen(PORT, () => console.log(`pulseapp-api слушает :${PORT}`));
})();
