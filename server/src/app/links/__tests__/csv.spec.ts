import { describe, it, expect, vi } from 'vitest';

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: class {},
  PutObjectCommand: class {},
}));

import { escapeCsvField } from '../export.service.js';

describe('Exportação CSV - proteção contra Formula Injection', () => {
  it('prefixa com apóstrofo textos iniciados por =, +, - ou @', () => {
    expect(escapeCsvField('=1+1')).toBe("'=1+1");
    expect(escapeCsvField('+cmd')).toBe("'+cmd");
    expect(escapeCsvField('-cmd')).toBe("'-cmd");
    expect(escapeCsvField('@SUM(A1)')).toBe("'@SUM(A1)");
  });

  it('mantém textos normais e números intactos', () => {
    expect(escapeCsvField('meu-link')).toBe('meu-link');
    expect(escapeCsvField(5)).toBe('5');
    expect(escapeCsvField('https://exemplo.com')).toBe('https://exemplo.com');
  });

  it('continua escapando vírgulas, aspas e quebras de linha', () => {
    expect(escapeCsvField('a,b')).toBe('"a,b"');
    expect(escapeCsvField('a"b')).toBe('"a""b"');
    expect(escapeCsvField('a\nb')).toBe('"a\nb"');
  });
});
