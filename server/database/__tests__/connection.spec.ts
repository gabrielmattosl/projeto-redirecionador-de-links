import { describe, it, expect, afterAll } from 'vitest';
import { db, client } from '../connection.js';
import { links } from '../schema.js';

describe('Conexão e Schema do Banco de Dados (PostgreSQL + Drizzle)', () => {
  afterAll(async () => {
    await client.end();
  });

  it('deve conseguir realizar uma consulta simples na tabela links', async () => {
    const result = await db.select().from(links).limit(1);
    expect(Array.isArray(result)).toBe(true);
  });
});
