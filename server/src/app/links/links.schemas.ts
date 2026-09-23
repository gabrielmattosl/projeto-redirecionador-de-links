import { z } from 'zod';

export const createLinkSchema = z.object({
  original_url: z
    .string()
    .transform((val) => {
      let trimmed = val.trim();
      if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = `https://${trimmed}`;
      }
      return trimmed;
    })
    .pipe(z.string().url('Informe uma URL válida.')),
  short_url: z
    .string()
    .min(3, 'O apelido deve ter no mínimo 3 caracteres.')
    .max(50, 'O apelido deve ter no máximo 50 caracteres.')
    .regex(
      /^[a-zA-Z0-9-]+$/,
      'O apelido deve conter apenas letras, números e hífens.'
    ),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export const getLinksQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().default(20).optional(),
});

export type GetLinksQuery = z.infer<typeof getLinksQuerySchema>;

export const shortUrlParamSchema = z.object({
  short_url: z
    .string()
    .min(3, 'O apelido deve ter no mínimo 3 caracteres.')
    .max(50, 'O apelido deve ter no máximo 50 caracteres.')
    .regex(
      /^[a-zA-Z0-9-]+$/,
      'O apelido deve conter apenas letras, números e hífens.'
    ),
});

export type ShortUrlParam = z.infer<typeof shortUrlParamSchema>;
