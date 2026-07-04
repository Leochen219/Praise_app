import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getRoomByIdAndOwner, deleteRoom } from '@/lib/queries';

// GET /api/rooms/[id] - Get room detail (owner only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const room = await getRoomByIdAndOwner(id, user.userId);
    if (!room) {
      return NextResponse.json(
        { success: false, error: '房间不存在或无权访问' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: room });
  } catch (e) {
    if (e instanceof Error && e.message === '未登录') {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: '获取房间信息失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms/[id] - Delete room (owner only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const room = await getRoomByIdAndOwner(id, user.userId);
    if (!room) {
      return NextResponse.json(
        { success: false, error: '房间不存在或无权操作' },
        { status: 404 }
      );
    }

    await deleteRoom(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && e.message === '未登录') {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: '删除房间失败' },
      { status: 500 }
    );
  }
}
