import { randomBytes } from 'crypto';
import { db } from './db';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

export function generateRoomCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

export async function createUniqueRoomCode(): Promise<string> {
  let attempts = 0;
  while (attempts < 10) {
    const code = generateRoomCode();
    const result = await db.execute({
      sql: 'SELECT 1 FROM rooms WHERE code = ?',
      args: [code],
    });
    if (result.rows.length === 0) return code;
    attempts++;
  }
  throw new Error('无法生成唯一房间码，请重试');
}
