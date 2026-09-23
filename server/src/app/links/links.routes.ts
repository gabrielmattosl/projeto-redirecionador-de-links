import { FastifyInstance } from 'fastify';
import {
  createLinkHandler,
  getLinksHandler,
  deleteLinkHandler,
  incrementLinkHandler,
  exportLinksHandler,
} from './links.controller.js';

export async function linksRoutes(fastify: FastifyInstance) {
  fastify.post('/links', {
    schema: {
      tags: ['Links'],
      summary: 'Criar um novo link encurtado',
      body: {
        type: 'object',
        required: ['original_url', 'short_url'],
        properties: {
          original_url: { type: 'string' },
          short_url: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            original_url: { type: 'string' },
            short_url: { type: 'string' },
            clicks: { type: 'number' },
            created_at: { type: 'string' },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array' },
          },
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: createLinkHandler,
  });

  fastify.get('/links', {
    schema: {
      tags: ['Links'],
      summary: 'Listar links com paginação baseada em cursor',
      querystring: {
        type: 'object',
        properties: {
          cursor: { type: 'string' },
          limit: { type: 'number', default: 20 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  original_url: { type: 'string' },
                  short_url: { type: 'string' },
                  clicks: { type: 'number' },
                  created_at: { type: 'string' },
                },
              },
            },
            next_cursor: { type: ['string', 'null'] },
          },
        },
      },
    },
    handler: getLinksHandler,
  });

  fastify.delete('/links/:short_url', {
    schema: {
      tags: ['Links'],
      summary: 'Excluir definitivamente um link pelo apelido',
      params: {
        type: 'object',
        required: ['short_url'],
        properties: {
          short_url: { type: 'string' },
        },
      },
      response: {
        204: { type: 'null' },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: deleteLinkHandler,
  });

  fastify.patch('/links/:short_url/increment', {
    schema: {
      tags: ['Links'],
      summary: 'Incrementar +1 clique atomicamente e obter URL original',
      params: {
        type: 'object',
        required: ['short_url'],
        properties: {
          short_url: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            original_url: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: incrementLinkHandler,
  });

  fastify.post('/links/export', {
    schema: {
      tags: ['Links'],
      summary: 'Exportar relatório CSV para a Cloudflare R2',
      response: {
        200: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            filename: { type: 'string' },
          },
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: exportLinksHandler,
  });
}
