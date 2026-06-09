import { NextResponse } from 'next/server';
import { readDB, writeDB, sessions } from '@/lib/db';

export const dynamic = 'force-static';

function getKey(type) {
  if (type === 'stay') return 'stays';
  if (type === 'tour') return 'tours';
  if (type === 'vehicle') return 'vehicles';
  if (type === 'service') return 'services';
  return null;
}

// POST: Tạo listing mới
export async function POST(req) {
  try {
    const token = req.headers.get('authorization');
    if (!sessions.has(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const item = await req.json();
    const key = getKey(item.type);
    if (!key) {
      return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
    }

    const db = readDB();
    if (!db[key]) db[key] = [];
    db[key].unshift(item);
    writeDB(db);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// PUT: Cập nhật listing theo id
export async function PUT(req) {
  try {
    const token = req.headers.get('authorization');
    if (!sessions.has(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, type, updates } = await req.json();
    if (!id || !type || !updates) {
      return NextResponse.json({ message: 'Missing id, type or updates' }, { status: 400 });
    }

    const key = getKey(type);
    if (!key) {
      return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
    }

    const db = readDB();
    if (!db[key]) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    const index = db[key].findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    db[key][index] = { ...db[key][index], ...updates };
    writeDB(db);
    return NextResponse.json(db[key][index]);
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// DELETE: Xóa listing theo id và type
export async function DELETE(req) {
  try {
    const token = req.headers.get('authorization');
    if (!sessions.has(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    const key = getKey(type);
    if (!key) {
      return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
    }

    const db = readDB();
    if (!db[key]) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    const before = db[key].length;
    db[key] = db[key].filter((item) => item.id !== id);
    if (db[key].length === before) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    writeDB(db);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}
