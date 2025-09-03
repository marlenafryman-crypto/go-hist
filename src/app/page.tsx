'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Feather } from 'lucide-react';
import Image from 'next/image';
import { DECK } from '@/lib/mock-data';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function JoinGamePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName) {
      router.push('/game');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-background">
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 justify-center items-center">
        <Image src="https://i.ibb.co/pjbkcjgk/bbeb7da5-c733-44da-856a-35ecda42df02.png" alt="Go Hist Logo" width={400} height={600} data-ai-hint="logo" />
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center space-x-4 mb-8 md:hidden">
          <Feather className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-headline text-primary">Go Hist</h1>
        </div>
        
        <Card className="shadow-2xl">
          <form onSubmit={handleJoinGame}>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Join a Game</CardTitle>
              <CardDescription>Enter your name and a game code to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="player-name">Your Name</Label>
                <Input 
                  id="player-name" 
                  placeholder="e.g., Ada Lovelace" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="game-code">Game Code</Label>
                <Input 
                  id="game-code" 
                  placeholder="Enter code or leave blank to start new" 
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={!playerName}>
                Enter the Past
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card className="mt-4">
          <CardHeader>
             <CardTitle className="font-headline text-xl text-center">Current Deck</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 w-full rounded-md border p-4">
              <ul className="space-y-2">
                {DECK.map(card => (
                  <li key={card.id} className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{card.name}</span> ({card.type})
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-muted-foreground">
          A card game of historical connections. <br /> Form sets of four, but be ready to defend your links to the past!
        </p>
      </div>
    </main>
  );
}
