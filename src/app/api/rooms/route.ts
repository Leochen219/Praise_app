import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { createUniqueRoomCode } from '@/lib/room-code';
import { createRoom, getRoomById, getUserRooms } from '@/lib/queries';

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { name, description } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '房间名称不能为空' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { success: false, error: '房间名称不能超过100个字符' },
        { status: 400 }
      );
    }

    const desc = (description || '').trim();
    if (desc.length > 500) {
      return NextResponse.json(
        { success: false, error: '房间描述不能超过500个字符' },
        { status: 400 }
      );
    }

    const code = await createUniqueRoomCode();
    const roomId = await createRoom(user.userId, name.trim(), desc, code);
    const room = await getRoomById(roomId);

    return NextResponse.json({ success: true, data: room }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === '未登录') {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: '创建房间失败' },
      { status: 500 }
    );
  }
}

// GET /api/rooms - List current user's rooms
export async function GET() {
  try {
    const user = await requireAuth();
    const rooms = await getUserRooms(user.userId);
    return NextResponse.json({ success: true, data: rooms });
  } catch (e) {
    if (e instanceof Error && e.message === '未登录') {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: '获取房间列表失败' },
      { status: 500 }
    );
  }
}
