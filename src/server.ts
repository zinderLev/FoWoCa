import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { ensureUsersDirectoryExists, userFileExists, createUserFile, UserData } from './tools'; // Импортируем функции и интерфейс

const fastify = Fastify({
  logger: true // Включаем логирование
});

// 1. Регистрация плагина для отдачи статических файлов из папки 'public'
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'), // public/ находится на один уровень выше dist/
  prefix: '/', // Файлы из public/ будут доступны по корневому URL
});

// 2. Регистрация плагина для отдачи скомпилированных клиентских скриптов из 'dist'
// clientTools.ts компилируется в dist/clientTools.js
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'dist'), // dist/ находится на один уровень выше dist/server.js
  prefix: '/', // clientTools.js будет доступен по /clientTools.js
  decorateReply: false // Только один fastifyStatic должен декорировать reply
});

// Интерфейс для тела POST-запроса регистрации
interface RegisterRequestBody {
  username: string;
  password: string;
}

// Маршрут для отдачи главной HTML-страницы
fastify.get('/', async (request, reply) => {
  // Отдаем index.html из папки public
  return reply.sendFile('index.html');
});

// Маршрут для обработки POST-запроса регистрации пользователя
fastify.post<{ Body: RegisterRequestBody }>('/register', async (request, reply) => {
  const { username, password } = request.body;

  if (!username || !password) {
    reply.status(400).send({ message: 'Username and password are required.' });
    return;
  }

  // Санитизация имени пользователя для имени файла (удаляем недопустимые символы)
  const safeUsername = username.replace(/[^a-zA-Z0-9-_.]/g, '_');

  try {
    // Проверяем, существует ли пользователь с таким именем
    const exists = await userFileExists(safeUsername);

    if (exists) {
      reply.status(409).send({ message: `User '${username}' already exists.` }); // 409 Conflict
    } else {
      // Создаем нового пользователя
      const userData: UserData = { username: safeUsername, password: password };
      await createUserFile(userData);
      reply.status(201).send({ message: `User '${username}' registered successfully!` }); // 201 Created
    }
  } catch (error) {
    fastify.log.error('Error during user registration:', error);
    reply.status(500).send({ message: 'Internal server error during registration.' });
  }
});

// Запуск сервера
const start = async () => {
  try {
    await ensureUsersDirectoryExists(); // Убеждаемся, что каталог users существует
    const PORT: number = parseInt(process.env.PORT || '3000', 10);
    await fastify.listen({ port: PORT, host: '0.0.0.0' }); // 0.0.0.0 для совместимости с Render.com
    fastify.log.info(`FoWoCa server listening on ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
