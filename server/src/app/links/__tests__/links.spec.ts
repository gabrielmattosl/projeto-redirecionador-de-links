import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { buildApp } from '../../../index.js';
import { createLinkSchema } from '../links.schemas.js';
import { db, client } from '../../../../database/connection.js';
import { links } from '../../../../database/schema.js';
import { eq } from 'drizzle-orm';

vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: class {
      send() {
        return Promise.resolve({ $metadata: { httpStatusCode: 200 } });
      }
    },
    PutObjectCommand: class {
      input: any;
      constructor(input: any) {
        this.input = input;
      }
    },
  };
});

describe('Módulo Links - Regras de Negócio e Endpoints RESTful', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
    await db.delete(links).where(eq(links.shortUrl, 'test-unit-1'));
    await db.delete(links).where(eq(links.shortUrl, 'test-unit-2'));
    await db.delete(links).where(eq(links.shortUrl, 'test-dup'));
  });

  afterAll(async () => {
    await db.delete(links).where(eq(links.shortUrl, 'test-unit-1'));
    await db.delete(links).where(eq(links.shortUrl, 'test-unit-2'));
    await db.delete(links).where(eq(links.shortUrl, 'test-dup'));
    await client.end();
  });

  describe('Validação Zod (createLinkSchema)', () => {
    it('deve anexar silenciosamente https:// se a URL não possuir esquema', () => {
      const result = createLinkSchema.safeParse({
        original_url: 'meudominio.com/pagina',
        short_url: 'meu-link',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.original_url).toBe('https://meudominio.com/pagina');
      }
    });

    it('deve preservar https:// ou http:// se já existirem na URL original', () => {
      const resHttps = createLinkSchema.safeParse({
        original_url: 'https://exemplo.com',
        short_url: 'link-1',
      });
      expect(resHttps.success).toBe(true);
      if (resHttps.success) {
        expect(resHttps.data.original_url).toBe('https://exemplo.com');
      }

      const resHttp = createLinkSchema.safeParse({
        original_url: 'http://exemplo.com',
        short_url: 'link-2',
      });
      expect(resHttp.success).toBe(true);
      if (resHttp.success) {
        expect(resHttp.data.original_url).toBe('http://exemplo.com');
      }
    });

    it('deve rejeitar apelidos com menos de 3 ou mais de 50 caracteres ou caracteres inválidos', () => {
      const resShort = createLinkSchema.safeParse({
        original_url: 'https://exemplo.com',
        short_url: 'ab',
      });
      expect(resShort.success).toBe(false);

      const resInvalidChar = createLinkSchema.safeParse({
        original_url: 'https://exemplo.com',
        short_url: 'link com espaco',
      });
      expect(resInvalidChar.success).toBe(false);
    });
  });

  describe('Endpoints RESTful (HTTP Integration)', () => {
    it('POST /links - deve criar um novo link encurtado', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/links',
        payload: {
          original_url: 'exemplo.com/teste',
          short_url: 'test-unit-1',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.original_url).toBe('https://exemplo.com/teste');
      expect(body.short_url).toBe('test-unit-1');
      expect(body.clicks).toBe(0);
      expect(body.created_at).toBeDefined();
    });

    it('POST /links - deve retornar 409 Conflict se o apelido já estiver em uso', async () => {
      await app.inject({
        method: 'POST',
        url: '/links',
        payload: {
          original_url: 'https://exemplo.com',
          short_url: 'test-dup',
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/links',
        payload: {
          original_url: 'https://outro.com',
          short_url: 'test-dup',
        },
      });

      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Este apelido já está em uso.');
    });

    it('GET /links - deve listar links com paginação baseada em cursor', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/links?limit=10',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.links)).toBe(true);
      expect(body).toHaveProperty('next_cursor');
    });

    it('PATCH /links/:short_url/increment - deve incrementar o contador de cliques e retornar original_url', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/links/test-unit-1/increment',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.original_url).toBe('https://exemplo.com/teste');
    });

    it('PATCH /links/:short_url/increment - deve retornar 404 para link inexistente', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/links/inexistente-12345/increment',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Link não encontrado.');
    });

    it('DELETE /links/:short_url - deve realizar exclusão definitiva (hard delete)', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/links/test-unit-1',
      });

      expect(response.statusCode).toBe(204);

      const response404 = await app.inject({
        method: 'DELETE',
        url: '/links/test-unit-1',
      });
      expect(response404.statusCode).toBe(404);
    });

    it('POST /links/export - deve exportar relatório CSV para a CDN', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/links/export',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('url');
      expect(body).toHaveProperty('filename');
      expect(body.filename).toMatch(/^relatorio-links-.*\.csv$/);
    });
  });
});
