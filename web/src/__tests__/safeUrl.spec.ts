import { describe, it, expect } from 'vitest';
import { isSafeHttpUrl, toSafeHttpUrl } from '@/utils/safeUrl';

describe('safeUrl - proteção contra esquemas perigosos', () => {
  it('aceita apenas http e https', () => {
    expect(isSafeHttpUrl('https://exemplo.com')).toBe(true);
    expect(isSafeHttpUrl('http://exemplo.com/pagina?x=1')).toBe(true);
  });

  it('rejeita javascript:, data:, vbscript: e valores inválidos', () => {
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeHttpUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeHttpUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeHttpUrl('ftp://exemplo.com')).toBe(false);
    expect(isSafeHttpUrl('nao-e-url')).toBe(false);
    expect(isSafeHttpUrl(undefined)).toBe(false);
    expect(isSafeHttpUrl(123)).toBe(false);
  });

  it('toSafeHttpUrl devolve undefined para URLs inseguras', () => {
    expect(toSafeHttpUrl('https://exemplo.com')).toBe('https://exemplo.com');
    expect(toSafeHttpUrl('javascript:alert(1)')).toBeUndefined();
  });
});
