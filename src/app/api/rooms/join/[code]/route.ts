import { NextRequest, NextResponse } from 'next/server';
import { getRoomByCode } from '@/lib/queries';

// GET /api/rooms/join/[code] - Get room info by code (public)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const normalizedCode = code.toUpperCase();

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

  return NextResponse.json({
    success: true,
    data: {
      name: (room as { name: string }).name,
      description: (room as { description: string }).description,
      code: (room as { code: string }).code,
      is_active: true,
    },
  });
}
