import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readDB, writeDB, sessions } from '@/lib/db';

export const dynamic = 'force-static';

// GET: Lấy danh sách users (chỉ superadmin)
export async function GET(req) {
  try {
    const token = req.headers.get('authorization');
    const userEmail = sessions.get(token);

    const db = readDB();
    const currentUser = db.users.find((u) => u.email === userEmail);

    if (!currentUser || currentUser.role !== 'superadmin') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const safeUsers = db.users.map(({ password, ...rest }) => rest);
    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// POST: Tạo user mới (chỉ superadmin)
export async function POST(req) {
  try {
    const token = req.headers.get('authorization');
    const userEmail = sessions.get(token);

    const db = readDB();
    const currentUser = db.users.find((u) => u.email === userEmail);

    if (!currentUser || currentUser.role !== 'superadmin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { userData } = await req.json();

    if (db.users.find((u) => u.email === userData.email)) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: 'u-' + Date.now().toString().slice(-4),
      ...userData,
      password: hashedPassword,
      role: 'admin',
    };

    db.users.push(newUser);
    writeDB(db);

    const { password, ...responseUser } = newUser;
    return NextResponse.json(responseUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// DELETE: Xóa user theo id (chỉ superadmin)
export async function DELETE(req) {
  try {
    const token = req.headers.get('authorization');
    const userEmail = sessions.get(token);

    const db = readDB();
    const currentUser = db.users.find((u) => u.email === userEmail);

    if (!currentUser || currentUser.role !== 'superadmin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });
    }

    if (currentUser.id === id) {
      return NextResponse.json({ message: 'Cannot delete yourself' }, { status: 400 });
    }

    const before = db.users.length;
    db.users = db.users.filter((u) => u.id !== id);
    if (db.users.length === before) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    writeDB(db);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}
