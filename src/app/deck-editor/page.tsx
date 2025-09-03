'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DECK } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CARDS_PER_PAGE = 12;

export default function DeckEditorPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(DECK.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentCards = DECK.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-headline text-primary">Deck Viewer</h1>
        <Link href="/">
          <Button variant="outline">
            <ChevronLeft className="mr-2" /> Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="mb-8 p-4 border rounded-lg bg-card/50">
        <p className="text-muted-foreground">
            This is a simple visual viewer for all the cards in your deck. To add, remove, or edit cards, please modify the `DECK` array in the{' '}
            <code className="font-mono bg-muted px-1 py-0.5 rounded">
              src/lib/mock-data.ts
            </code>{' '}
            file.
          </p>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {currentCards.map((card) => (
          <Card key={card.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
            <CardContent className="p-0">
               <div className="relative aspect-[2/3]">
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  className="object-cover"
                  data-ai-hint={card.hint}
                />
              </div>
            </CardContent>
            <CardFooter className="p-2 bg-card/80">
                <p className="text-xs font-semibold truncate w-full text-center">{card.name}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4 mt-8">
        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
          <ChevronLeft className="mr-2" />
          Previous
        </Button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    </main>
  );
}
