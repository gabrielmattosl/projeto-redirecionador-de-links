import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../../index.js';
import { client } from '../../../../database/connection.js';
import { createLinkSchema, getLinksQuerySchema } from '../links.schemas.js';

describe('Segurança - CORS, validações e tratamento de erros', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
    await client.end();
  });

  describe('CORS restrito ao frontend', () => {
    it('autoriza a origem do frontend configurada', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/links?limit=1',
        headers: { origin: 'http://localhost:5173' },
      });
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('NÃO autoriza origens desconhecidas', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/links?limit=1',
        headers: { origin: 'https://site-malicioso.example' },
      });
      expect(response.headers['access-control-allow-origin']).not.toBe('https://site-malicioso.example');
      expect(response.headers['access-control-allow-origin']).not.toBe('*');
    });

    it('envia cabeçalhos básicos de segurança', async () => {
      const response = await app.inject({ method: 'GET', url: '/links?limit=1' });
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['referrer-policy']).toBe('no-referrer');
    });
  });

  describe('Validação de entradas', () => {
    it('rejeita limit acima do máximo (100)', async () => {
      const response = await app.inject({ method: 'GET', url: '/links?limit=100000' });
      expect(response.statusCode).toBe(400);
    });

    it('rejeita cursor que não seja data ISO 8601 (sem erro 500)', async () => {
      const response = await app.inject({ method: 'GET', url: '/links?cursor=banana' });
      expect(response.statusCode).toBe(400);
    });

    it('aceita cursor ISO válido', () => {
      const result = getLinksQuerySchema.safeParse({ cursor: '2026-09-23T01:00:00.000Z' });
      expect(result.success).toBe(true);
    });

    it('rejeita URL original acima de 2048 caracteres', () => {
      const result = createLinkSchema.safeParse({
        original_url: `https://exemplo.com/${'a'.repeat(2100)}`,
        short_url: 'link-grande',
      });
      expect(result.success).toBe(false);
    });

    it('rejeita esquemas perigosos como javascript: na URL original', () => {
      for (const url of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>']) {
        const result = createLinkSchema.safeParse({ original_url: url, short_url: 'meu-link' });
        expect(result.success).toBe(false);
      }
    });

    it('rejeita apelidos com caracteres de injeção ou barras', async () => {
      for (const short_url of ["a'; DROP TABLE links;--", '../etc/passwd', '<script>x</script>']) {
        const response = await app.inject({
          method: 'POST',
          url: '/links',
          payload: { original_url: 'https://exemplo.com', short_url },
        });
        expect(response.statusCode).toBe(400);
      }
    });

    it('rejeita apelido inválido na rota de exclusão e incremento', async () => {
      const del = await app.inject({ method: 'DELETE', url: '/links/a%27%20OR%201=1' });
      expect(del.statusCode).toBe(400);
      const inc = await app.inject({ method: 'PATCH', url: '/links/a%27%20OR%201=1/increment' });
      expect(inc.statusCode).toBe(400);
    });
  });
});
