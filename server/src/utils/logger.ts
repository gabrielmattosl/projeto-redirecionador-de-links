import fs from 'node:fs';
import path from 'node:path';

export function logErrorToFile(errorType: string, error: unknown): void {
  try {
    const logDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFilePath = path.join(logDir, 'erros.log');

    const timestamp = new Date().toISOString();
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack || '' : '';

    const logLine = `[${timestamp}] [${errorType}] ${message}\nStack: ${stack}\n---\n`;
    fs.appendFileSync(logFilePath, logLine, 'utf-8');
  } catch (err) {
    console.error('Falha ao gravar erro no log físico server/logs/erros.log:', err);
  }
}
