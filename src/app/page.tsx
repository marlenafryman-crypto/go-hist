'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Feather } from 'lucide-react';
import Image from 'next/image';

function generateGameCode() {
  let code = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const MAX_PLAYERS = 5;

export default function JoinGamePage() {
  const router = useRouter();
  const [playerNames, setPlayerNames] = useState<string[]>(['']);
  const [numPlayers, setNumPlayers] = useState(1);
  const [numAiPlayers, setNumAiPlayers] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalPlayers = numPlayers + numAiPlayers;

  useEffect(() => {
    if (totalPlayers > MAX_PLAYERS) {
      setNumAiPlayers(MAX_PLAYERS - numPlayers);
    }
  }, [numPlayers, numAiPlayers, totalPlayers]);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handleNumPlayersChange = (value: string) => {
    const num = parseInt(value, 10);
    setNumPlayers(num);
    setPlayerNames(currentNames => {
        const newNames = new Array(num).fill('');
        for(let i=0; i < Math.min(num, currentNames.length); i++){
            newNames[i] = currentNames[i];
        }
        return newNames;
    });
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerNames.every(name => name.trim() !== '') && isClient) {
      const code = generateGameCode();
      const queryParams = new URLSearchParams();
      queryParams.set('code', code);
      queryParams.set('numPlayers', String(numPlayers));
      queryParams.set('numAi', String(numAiPlayers));
      playerNames.forEach((name, index) => {
        queryParams.set(`player${index + 1}`, name);
      });
      router.push(`/game?${queryParams.toString()}`);
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
          <form onSubmit={handleStartGame}>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Setup a Game</CardTitle>
              <CardDescription>Configure players for your new game.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Human Players</Label>
                        <Select value={String(numPlayers)} onValueChange={handleNumPlayersChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[...Array(MAX_PLAYERS)].map((_, i) => (
                                    <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>AI Players</Label>
                         <Select value={String(numAiPlayers)} onValueChange={(val) => setNumAiPlayers(parseInt(val))}>
                            <SelectTrigger>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {[...Array(MAX_PLAYERS - numPlayers + 1)].map((_, i) => (
                                    <SelectItem key={i} value={String(i)} disabled={numPlayers + i < 2}>{i}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

              {[...Array(numPlayers)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`player-name-${index}`}>Player {index + 1} Name</Label>
                  <Input 
                    id={`player-name-${index}`}
                    placeholder={`e.g., Ada Lovelace`}
                    value={playerNames[index] || ''}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={playerNames.some(name => name.trim() === '') || totalPlayers < 2 || totalPlayers > MAX_PLAYERS}>
                Start New Game
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="mt-8 text-center text-muted-foreground">
          A card game of historical connections. <br /> Form sets of four, but be ready to defend your links to the past!
        </p>
      </div>
    </main>
  );
}

    