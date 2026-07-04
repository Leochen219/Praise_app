import { randomUUID } from 'crypto';
import { db } from '@/lib/db';

export async function createUser(username: string, passwordHash: string) {
  const id = randomUUID();
  await db.execute({
    sql: 'INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)',
    args: [id, username, passwordHash],
  });
  return { id, username };
}

export async function findUserByUsername(username: string) {
  const result = await db.execute({
    sql: 'SELECT id, username, password_hash FROM users WHERE LOWER(username) = LOWER(?)',
    args: [username],
  });
  return result.rows[0] as
    | { id: string; username: string; password_hash: string }
    | undefined;
}

export async function createRoom(
  creatorId: string,
  name: string,
  description: string,
  code: string
) {
  const id = randomUUID();
  await db.execute({
    sql: 'INSERT INTO rooms (id, creator_id, name, description, code) VALUES (?, ?, ?, ?, ?)',
    args: [id, creatorId, name, description, code],
  });
  return id;
}

export async function getRoomById(id: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM rooms WHERE id = ?',
    args: [id],
  });
  return result.rows[0] as Record<string, unknown> | undefined;
}

export async function getUserRooms(userId: string) {
  const result = await db.execute({
    sql: `SELECT r.*,
      (SELECT COUNT(*) FROM messages m WHERE m.room_id = r.id) as message_count,
      (SELECT COUNT(*) FROM messages m WHERE m.room_id = r.id AND m.is_read = 0) as unread_count
    FROM rooms r
    WHERE r.creator_id = ?
    ORDER BY r.updated_at DESC`,
    args: [userId],
  });
  return result.rows;
}

export async function getRoomByCode(code: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM rooms WHERE code = ?',
    args: [code],
  });
  return result.rows[0] as Record<string, unknown> | undefined;
}

export async function getRoomByIdAndOwner(roomId: string, userId: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM rooms WHERE id = ? AND creator_id = ?',
    args: [roomId, userId],
  });
  return result.rows[0] as Record<string, unknown> | undefined;
}

export async function deleteRoom(roomId: string) {
  await db.execute({ sql: 'DELETE FROM rooms WHERE id = ?', args: [roomId] });
}

export async function addMessage(roomId: string, content: string) {
  const id = randomUUID();
  await db.execute({
    sql: 'INSERT INTO messages (id, room_id, content) VALUES (?, ?, ?)',
    args: [id, roomId, content],
  });
  await db.execute({
    sql: "UPDATE rooms SET updated_at = datetime('now') WHERE id = ?",
    args: [roomId],
  });
  return id;
}

export async function getRoomMessages(
  roomId: string,
  limit: number,
  offset: number
) {
  const result = await db.execute({
    sql: 'SELECT * FROM messages WHERE room_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    args: [roomId, limit, offset],
  });

  const countResult = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM messages WHERE room_id = ?',
    args: [roomId],
  });
  const total = (countResult.rows[0] as { count: number }).count;

  return { messages: result.rows, total };
}

export async function markAllMessagesRead(roomId: string) {
  await db.execute({
    sql: 'UPDATE messages SET is_read = 1 WHERE room_id = ? AND is_read = 0',
    args: [roomId],
  });
}
