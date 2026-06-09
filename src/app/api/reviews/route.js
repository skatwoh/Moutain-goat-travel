import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.reviews);
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}

// POST không hoạt động trong static export — chỉ dùng local/server
export async function POST(req) {
  try {
    const review = await req.json();
    const db = readDB();
    db.reviews.unshift(review);

    const target =
      db.stays.find((s) => s.id === review.targetId) ||
      db.tours.find((t) => t.id === review.targetId) ||
      (db.vehicles || []).find((v) => v.id === review.targetId) ||
      (db.services || []).find((s) => s.id === review.targetId);

    if (target) {
      const itemReviews = db.reviews.filter((r) => r.targetId === review.targetId);
      const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
      target.rating = Math.round((totalRating / itemReviews.length) * 100) / 100;
      target.reviewsCount = itemReviews.length;
    }

    writeDB(db);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
  }
}
