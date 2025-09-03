'use client';

import { useState, useEffect } from 'react';
import type { Card } from '@/lib/types';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const CARDS_PER_PAGE = 10;

export default function DeckEditorPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCards() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/deck?page=${currentPage}&limit=${CARDS_PER_PAGE}`);
        if (!res.ok) {
          throw new Error('Failed to fetch cards from the server.');
        }
        const data = await res.json();
        setCards(data.cards);
        setTotalPages(data.totalPages);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCards();
  }, [currentPage]);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-4xl font-headline text-primary">Deck Editor</h1>
        <Link href="/">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-destructive">
          <p>Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {cards.map(card => (
              <div key={card.id} className="flex flex-col items-center gap-2">
                <GameCard card={card} />
                <p className="text-xs text-muted-foreground">ID: {card.id}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>
      )}

      <footer className="mt-8 text-center text-muted-foreground text-sm">
        <p>
          To edit a card, modify the `DECK` array in the{' '}
          <code className="font-mono bg-muted px-1 py-0.5 rounded">
            src/lib/mock-data.ts
          </code>{' '}
          file.
        </p>
        <p>
          You can change names, descriptions, and image URLs directly in the
          code.
        </p>
      </footer>
    </div>
  );
}
