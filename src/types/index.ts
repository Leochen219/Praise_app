export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface Room {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  code: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  message_count?: number;
}

export interface Message {
  id: string;
  room_id: string;
  content: string;
  is_read: number;
  created_at: string;
}

export interface PublicRoomInfo {
  name: string;
  description: string;
  code: string;
  is_active: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface JwtPayload {
  userId: string;
  username: string;
}
