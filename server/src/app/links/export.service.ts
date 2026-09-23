import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { asc } from 'drizzle-orm';
import crypto from 'node:crypto';
import { db } from '../../../database/connection.js';
import { links } from '../../../database/schema.js';
import { env } from '../../config/env.js';
import { logErrorToFile } from '../../utils/logger.js';

function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportLinksToCsv(): Promise<{ url: string; filename: string }> {
  try {
    const allLinks = await db
      .select()
      .from(links)
      .orderBy(asc(links.createdAt));

    let csvContent = 'URL Original,URL Encurtada,Data de Criacao,Acessos Totais\n';

    for (const link of allLinks) {
      const originalUrl = escapeCsvField(link.originalUrl);
      const shortUrl = escapeCsvField(link.shortUrl);
      const createdAt = escapeCsvField(link.createdAt.toISOString());
      const clicks = escapeCsvField(link.clicks);
      csvContent += `${originalUrl},${shortUrl},${createdAt},${clicks}\n`;
    }

    const uuid = crypto.randomUUID();
    const filename = `relatorio-links-${uuid}.csv`;

    const s3Client = new S3Client({
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
      region: 'auto',
    });

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET,
        Key: filename,
        Body: Buffer.from(csvContent, 'utf-8'),
        ContentType: 'text/csv',
      })
    );

    const publicUrl = env.CLOUDFLARE_PUBLIC_URL.endsWith('/')
      ? `${env.CLOUDFLARE_PUBLIC_URL}${filename}`
      : `${env.CLOUDFLARE_PUBLIC_URL}/${filename}`;

    return {
      url: publicUrl,
      filename,
    };
  } catch (error) {
    logErrorToFile('ExportCSVError', error);
    throw error;
  }
}
