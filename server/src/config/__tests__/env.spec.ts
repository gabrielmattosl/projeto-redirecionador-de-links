import { describe, it, expect } from 'vitest';
import { env } from '../env.js';

describe('Módulo de Configuração de Ambiente (env.ts)', () => {
  it('deve carregar e validar as variáveis de ambiente obrigatórias', () => {
    expect(env).toBeDefined();
    expect(env.PORT).toBeTypeOf('number');
    expect(env.DATABASE_URL).toBeDefined();
    expect(env.CLOUDFLARE_ACCOUNT_ID).toBeDefined();
    expect(env.CLOUDFLARE_ACCESS_KEY_ID).toBeDefined();
    expect(env.CLOUDFLARE_SECRET_ACCESS_KEY).toBeDefined();
    expect(env.CLOUDFLARE_BUCKET).toBeDefined();
    expect(env.CLOUDFLARE_PUBLIC_URL).toBeDefined();
  });
});
