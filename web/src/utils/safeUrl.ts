/**
 * Defesa em profundidade: só considera segura uma URL com protocolo http ou https.
 * Bloqueia esquemas perigosos como `javascript:`, `data:` ou `vbscript:`.
 */
export function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Retorna a própria URL se ela for segura; caso contrário, devolve `undefined`.
 */
export function toSafeHttpUrl(value: unknown): string | undefined {
  return isSafeHttpUrl(value) ? value : undefined;
}
