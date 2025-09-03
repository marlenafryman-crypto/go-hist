import { NextResponse } from 'next/server';
import { DECK } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedCards = DECK.slice(startIndex, endIndex);
  const totalPages = Math.ceil(DECK.length / limit);

  return NextResponse.json({
    cards: paginatedCards,
    totalPages,
    currentPage: page,
    totalCards: DECK.length,
  });
}
