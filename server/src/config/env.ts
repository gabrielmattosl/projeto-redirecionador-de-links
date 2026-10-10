import { z } from 'zod';

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Se o arquivo .env não existir em disco (ex: em container de prod), utiliza variáveis de ambiente do SO
  }
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  // Única origem autorizada a consumir a API via navegador (CORS). Conforme FSD seção 17.
  VITE_FRONTEND_URL: z
    .string()
    .url('VITE_FRONTEND_URL deve ser uma URL válida.')
    .default('http://localhost:5173')
    .transform((val) => new URL(val).origin),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória.'),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1, 'CLOUDFLARE_ACCOUNT_ID é obrigatória.'),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1, 'CLOUDFLARE_ACCESS_KEY_ID é obrigatória.'),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1, 'CLOUDFLARE_SECRET_ACCESS_KEY é obrigatória.'),
  CLOUDFLARE_BUCKET: z.string().min(1, 'CLOUDFLARE_BUCKET é obrigatória.'),
  CLOUDFLARE_PUBLIC_URL: z.string().min(1, 'CLOUDFLARE_PUBLIC_URL é obrigatória.'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Erro na validação das variáveis de ambiente:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
