import { NextRequest, NextResponse } from 'next/server';
import { getRoomByCode, addMessage } from '@/lib/queries';

const MAX_MESSAGE_LENGTH = 1000;

const BLOCKED_WORDS = ['fuck', 'shit', '傻逼', '操你妈', '草泥马', '他妈'];

// POST /api/rooms/join/[code]/messages - Submit anonymous message (public)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const normalizedCode = code.toUpperCase();
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '留言内容不能为空' },
        { status: 400 }
      );
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: `留言内容不能超过${MAX_MESSAGE_LENGTH}个字符` },
        { status: 400 }
      );
    }

    const lowerContent = content.toLowerCase();
    if (BLOCKED_WORDS.some((w) => lowerContent.includes(w))) {
      return NextResponse.json(
        { success: false, error: '留言包含不当内容，请修改后重试' },
        { status: 400 }
      );
    }

    const room = await getRoomByCode(normalizedCode);

    if (!room) {
      return NextResponse.json(
        { success: false, error: '房间不存在' },
        { status: 404 }
      );
    }

    if (!(room as { is_active: number }).is_active) {
      return NextResponse.json(
        { success: false, error: '该房间已关闭，不再接受新留言' },
        { status: 410 }
      );
    }

    const messageId = await addMessage(
      (room as { id: string }).id,
      content.trim()
    );

    return NextResponse.json(
      { success: true, data: { id: messageId } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: '发送失败，请重试' },
      { status: 500 }
    );
  }
}
