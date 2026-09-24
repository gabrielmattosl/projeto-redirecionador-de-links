/**
 * Formatador com concordância gramatical para o contador de cliques/acessos.
 * Regra do FSD: ("0 acesso", "1 acesso", "2 acessos")
 */
export function formatClickCount(clicks: number): string {
  const count = Math.max(0, clicks);
  const noun = count <= 1 ? 'acesso' : 'acessos';
  return `${count} ${noun}`;
}

/**
 * Normaliza uma URL garantindo o protocolo https:// caso http:// ou https:// esteja ausente.
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Concatena a URL base do frontend com o apelido do link encurtado.
 */
export function getFullShortUrl(shortUrl: string): string {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanShort = shortUrl.replace(/^\/+/, '');
  return `${cleanBase}/${cleanShort}`;
}
