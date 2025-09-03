'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Feather, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function JoinGamePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we just navigate to the game page.
    // In a real app, you'd handle game joining logic here.
    if (playerName) {
      router.push('/game');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex items-center justify-center space-x-4 mb-8">
        <Feather className="w-16 h-16 text-primary" />
        <h1 className="text-6xl font-headline text-primary">Go Hist Digital</h1>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl">
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
            <a href="/deck-editor" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="outline" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Deck Editor
              </Button>
            </a>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-center text-muted-foreground">
        A digital card game of historical connections. <br /> Form sets of four, but be ready to defend your links to the past!
      </p>
    </main>
  );
}
