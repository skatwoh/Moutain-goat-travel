import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readDB, sessions } from '@/lib/db';

export const dynamic = 'force-static';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = 'tok-' + Math.random().toString(36).substring(2, 11);
      sessions.set(token, user.email);

      const { password: _, ...sessionUser } = user;
      return NextResponse.json({ ...sessionUser, token });
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}
