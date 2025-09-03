'use client';

import { useState, useMemo } from 'react';
import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CARDS_PER_PAGE = 10;

export default function DeckEditorPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const { currentCards, totalPages } = useMemo(() => {
    if (!isAuthenticated) {
      return { currentCards: [], totalPages: 0 };
    }
    const totalPages = Math.ceil(DECK.length / CARDS_PER_PAGE);
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const currentCards = DECK.slice(startIndex, endIndex);
    return { currentCards, totalPages };
  }, [isAuthenticated, currentPage]);


  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };


  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                  <KeyRound className="w-8 h-8 text-primary" />
                  Deck Editor Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Unlock
                </Button>
              </CardContent>
            </form>
          </Card>
           <div className="w-full mt-4">
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        {currentCards.map(card => (
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
      <footer className="mt-8 text-center text-muted-foreground text-sm">
        <p>To edit a card, modify the `DECK` array in the <code className="font-mono bg-muted px-1 py-0.5 rounded">src/lib/mock-data.ts</code> file.</p>
        <p>You can change names, descriptions, and image URLs directly in the code.</p>
      </footer>
    </div>
  );
}
