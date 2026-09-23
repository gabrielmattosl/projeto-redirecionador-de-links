import { defineConfig } from 'drizzle-kit';

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Se o arquivo .env não existir em disco, utiliza variáveis do ambiente
  }
}

export default defineConfig({
  schema: './database/schema.ts',
  out: './database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
