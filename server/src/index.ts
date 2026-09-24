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

  await app.register(cors, {
    origin: true,
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

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    logErrorToFile('UnhandledException', error);
    
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.message,
      });
    }

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
