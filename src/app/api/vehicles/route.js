import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.vehicles || []);
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}
