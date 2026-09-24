import { describe, it, expect } from 'vitest';
import { formatClickCount, normalizeUrl, getFullShortUrl } from '@/utils/formatters';

describe('Formatters Utils - Regras de Negócio de Interface', () => {
  it('deve formatar o contador de acessos com concordância gramatical estrita', () => {
    expect(formatClickCount(0)).toBe('0 acesso');
    expect(formatClickCount(1)).toBe('1 acesso');
    expect(formatClickCount(2)).toBe('2 acessos');
    expect(formatClickCount(100)).toBe('100 acessos');
  });

  it('deve auto-corrigir e anexar https:// a URLs sem protocolo', () => {
    expect(normalizeUrl('exemplo.com')).toBe('https://exemplo.com');
    expect(normalizeUrl('  meusite.com/rota ')).toBe('https://meusite.com/rota');
    expect(normalizeUrl('http://ja-tem-http.com')).toBe('http://ja-tem-http.com');
    expect(normalizeUrl('https://ja-tem-https.com')).toBe('https://ja-tem-https.com');
  });

  it('deve concatenar a URL base com o apelido do link encurtado', () => {
    const fullUrl = getFullShortUrl('meu-link');
    expect(fullUrl).toContain('/meu-link');
  });
});
