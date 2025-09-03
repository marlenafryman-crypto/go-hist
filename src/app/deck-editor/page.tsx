'use client';

import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeckEditorPage() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {DECK.map(card => (
          <div key={card.id} className="flex flex-col items-center gap-2">
            <GameCard card={card} />
            <p className="text-xs text-muted-foreground">ID: {card.id}</p>
          </div>
        ))}
      </div>
      <footer className="mt-8 text-center text-muted-foreground text-sm">
        <p>To edit a card, modify the `DECK` array in the <code className="font-mono bg-muted px-1 py-0.5 rounded">src/lib/mock-data.ts</code> file.</p>
        <p>You can change names, descriptions, and image URLs directly in the code.</p>
      </footer>
    </div>
  );
}
