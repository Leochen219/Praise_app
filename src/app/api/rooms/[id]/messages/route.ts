import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getRoomByIdAndOwner, getRoomMessages, markAllMessagesRead } from '@/lib/queries';

// GET /api/rooms/[id]/messages - Get messages (owner only)
export async function GET(
  request: NextRequest,
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

    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const result = await getRoomMessages(id, limit, offset);
    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    if (e instanceof Error && e.message === '未登录') {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: '获取留言失败' },
      { status: 500 }
    );
  }
}

// PUT /api/rooms/[id]/messages - Mark all messages as read
export async function PUT(
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

    await markAllMessagesRead(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && e.message === '未登录') {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}
