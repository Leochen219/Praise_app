import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

// Use local SQLite file in dev, Turso in production
const db = createClient(
  tursoUrl && tursoToken
    ? { url: tursoUrl, authToken: tursoToken }
    : { url: 'file:data/local.db' }
);

export { db, randomUUID };

export async function initDatabase(): Promise<void> {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      username    TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id          TEXT PRIMARY KEY,
      creator_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name        TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      code        TEXT UNIQUE NOT NULL,
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_rooms_creator_id ON rooms(creator_id);
    CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);

    CREATE TABLE IF NOT EXISTS messages (
      id          TEXT PRIMARY KEY,
      room_id     TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
      content     TEXT NOT NULL,
      is_read     INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
  `);
}

// Initialize on import
initDatabase().catch(console.error);
