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
    .pipe(
      z.string()
        .max(2048, 'A URL deve ter no máximo 2048 caracteres.')
        .url('Informe uma URL válida.')
        .refine((val) => {
          try {
            const urlObj = new URL(val);
            return urlObj.hostname === 'localhost' || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(urlObj.hostname);
          } catch {
            return false;
          }
        }, { message: 'Informe uma URL válida com um domínio correto.' })
    ),
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

export const MAX_LINKS_PAGE_SIZE = 100;

export const getLinksQuerySchema = z.object({
  cursor: z.string().datetime({ offset: true, message: 'Cursor inválido.' }).optional(),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_LINKS_PAGE_SIZE, `O limite máximo por página é ${MAX_LINKS_PAGE_SIZE}.`)
    .default(20)
    .optional(),
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
