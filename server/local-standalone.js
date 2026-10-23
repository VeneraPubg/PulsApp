// Локальный dev-сервер с in-memory MongoDB (без Atlas).
// Данные живут, пока процесс запущен. Запуск: node local-standalone.js
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri('pulseapp');
  console.log('in-memory Mongo:', process.env.MONGODB_URI);
  require('./index.js');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
