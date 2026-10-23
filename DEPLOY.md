# Подключение облачных аккаунтов (MongoDB Atlas + Render)

Бэкенд лежит в папке `server/` (Node.js + Express + Mongoose). Blueprint для
автоматического деплоя — `render.yaml` в корне. Приложение обращается к:
`https://pulseapp-api.onrender.com/api` (см. `src/api.js`).

## Шаг 1. MongoDB Atlas (база данных)

1. Зарегистрироваться: https://www.mongodb.com/cloud/atlas/register
2. Создать бесплатный кластер **M0** (Free tier, регион ближайший к вам).
3. **Database Access** → Add New Database User:
   - пользователь: `pulseapp`
   - пароль: сгенерировать и сохранить
   - роль: Read and write to any database
4. **Network Access** → Add IP Address → `0.0.0.0/0` (Разрешить отовсюду —
   нужно, чтобы Render мог подключаться).
5. **Database → Connect → Connect your application** → скопировать строку
   `mongodb+srv://pulseapp:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
   - заменить `<password>` на пароль пользователя
   - дописать имя базы: `...mongodb.net/pulseapp?...`

## Шаг 2. Render (сервер)

1. Зарегистрироваться на https://render.com (через GitHub-аккаунт).
2. **New + → Blueprint** → выбрать репозиторий `VeneraPubg/PulsApp`
   (Render прочитает `render.yaml` и создаст Web Service `pulseapp-api`).
3. Render спросит значение переменной **MONGODB_URI** — вставить строку
   из шага 1. **JWT_SECRET** сгенерируется сам.
4. Нажать **Apply**. Через 2–3 минуты сервис заработает на
   `https://pulseapp-api.onrender.com`.
5. Проверка: открыть `https://pulseapp-api.onrender.com/api/health` —
   должно быть `{"ok":true,"db":"up"}`.

> Если URL сервиса отличается (Render добавит суффикс), поменяйте `API_URL`
> в `src/api.js` на актуальный и перезапустите приложение.

Free-план Render засыпает после 15 минут простоя — первый запрос после
«спячки» может идти 20–30 секунд, аккаунты «проснутся» и ответят.

## Что уже работает в приложении

- Регистрация/вход идут через сервер (`src/userStore.js`), пароли хранятся
  захешированными (bcrypt), сессия — JWT на 30 дней.
- Прогресс (план, тренировки, вес) синхронизируется (`src/store.js`):
  - после входа состояние подтягивается из облака;
  - каждое изменение через 3 секунды после сохранения уходит на сервер;
  - без интернета приложение работает на локальном кеше и отправит данные,
    когда появится сеть.
- Один и тот же аккаунт на эмуляторе/телефоне показывает одинаковый прогресс.

## Локальная разработка (без Atlas)

```powershell
cd server
npm install
node smoke-test.js        # in-memory Mongo, прогон всех API-тестов
node local-standalone.js  # сервер на :8080 с in-memory Mongo
```

Секреты в git не попадают: `server/.env` в `.gitignore`.
