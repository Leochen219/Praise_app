import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { createUser, findUserByUsername } from '@/lib/queries';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    if (username.length < 2 || username.length > 20) {
      return NextResponse.json(
        { success: false, error: '用户名长度需在2-20个字符之间' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码长度至少6个字符' },
        { status: 400 }
      );
    }

    const existing = await findUserByUsername(username);
    if (existing) {
      return NextResponse.json(
        { success: false, error: '用户名已被占用' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const user = await createUser(username, passwordHash);
    const token = await generateToken({ userId: user.id, username: user.username });
    await setAuthCookie(token);

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json(
      { success: false, error: '注册失败，请重试' },
      { status: 500 }
    );
  }
}
