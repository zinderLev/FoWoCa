import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { IPostErr, IApiStruct} from './common';
import { postAnswers, ensureUsersDirectoryExists } from './serverTools';

const fastify = Fastify({
  logger: true // Включаем логирование
});

// 1. Регистрация плагина для отдачи статических файлов из папки 'public'
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'), // public/ находится на один уровень выше dist/
  prefix: '/', // Файлы из public/ будут доступны по корневому URL
});

// Маршрут для отдачи главной HTML-страницы
fastify.get('/', async (request, reply) => {
  // Отдаем index.html из папки public
  return reply.sendFile('index.html');
});

fastify.post<{ Body: string }>('/api', async (request, reply) => {
  try {
    const oApiStruct = JSON.parse(request.body) as IApiStruct;
    fastify.log.info("/api:" + oApiStruct.command);
    const oPostReq = await postAnswers({command:oApiStruct.command, data:oApiStruct.data});
    reply.status(200).send(oPostReq);
  } catch (error) {
    const oErr = error as IPostErr;
    fastify.log.error(oErr.message, oErr.cod);
    reply.status(200).send({ error: oErr.message });
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
