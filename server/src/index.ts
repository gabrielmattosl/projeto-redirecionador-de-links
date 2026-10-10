import Fastify, { FastifyError } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './config/env.js';
import { linksRoutes } from './app/links/links.routes.js';
import { logErrorToFile } from './utils/logger.js';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // CORS restrito exclusivamente à origem do frontend (FSD seções 5, 17 e 25)
  await app.register(cors, {
    origin: env.VITE_FRONTEND_URL,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'],
  });

  // Cabeçalhos básicos de segurança em todas as respostas da API
  app.addHook('onSend', async (_request, reply) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('Referrer-Policy', 'no-referrer');
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Redirecionador de Links API',
        description: 'API RESTful para encurtamento, gestão e redirecionamento de links',
        version: '1.0.0',
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  await app.register(linksRoutes);

  app.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error.statusCode ?? 500;

    // Erros do cliente (4xx) são esperados: mensagem simples, sem gravar no log físico
    // (evita que requisições inválidas em massa encham o disco).
    if (statusCode >= 400 && statusCode < 500) {
      return reply.status(statusCode).send({
        error: error.message,
      });
    }

    // Erros de servidor (5xx): detalhes técnicos apenas no log protegido, nunca para o usuário.
    request.log.error(error);
    logErrorToFile('UnhandledException', error);

    return reply.status(500).send({
      error: 'Erro interno do servidor.',
    });
  });

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  buildApp()
    .then((app) => app.listen({ port: env.PORT, host: '0.0.0.0' }))
    .then((address) => {
      console.log(`🚀 Servidor HTTP rodando em ${address}`);
    })
    .catch((err) => {
      console.error('❌ Erro ao iniciar o servidor HTTP:', err);
      logErrorToFile('ServerBootError', err);
      process.exit(1);
    });
}
