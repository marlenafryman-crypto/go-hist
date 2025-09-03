'use client';

import { useState, useEffect, useMemo } from 'react';
import type { GameState, Player, Card as CardType } from '@/lib/types';
import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ConnectionVerifier } from '@/components/game/ConnectionVerifier';
import { AskForCard } from '@/components/game/AskForCard';
import { Users, Swords, BookOpenCheck, ChevronLeft, Trophy, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { findMatchingCardAction } from './actions';

function shuffle(array: any[]) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const INITIAL_HAND_SIZE = 4;
const WINNING_SET_COUNT = 5;

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  const currentPlayer = useMemo(() => {
    return gameState?.players.find(p => p.id === gameState.currentPlayerId);
  }, [gameState]);

  const startNewGame = () => {
     const shuffledDeck = shuffle(DECK);
    const players: Player[] = [
      { id: 'player1', name: 'You', hand: [], histSets: [] },
      { id: 'player2', name: 'Ada Lovelace', hand: [], histSets: [] },
    ];

    for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
      for (const player of players) {
        const card = shuffledDeck.pop();
        if (card) player.hand.push(card);
      }
    }
    
    players[1].histSets.push([shuffledDeck.pop()!, shuffledDeck.pop()!, shuffledDeck.pop()!, shuffledDeck.pop()!]);

    setGameState({
      players,
      deck: shuffledDeck,
      discardPile: [shuffledDeck.pop()!],
      currentPlayerId: 'player1',
      turnPhase: 'draw',
    });
    setWinner(null);
    setSelectedCards([]);
  }

  useEffect(() => {
    startNewGame();
  }, []);

  const handleSelectCard = (card: CardType) => {
    setSelectedCards(prev => {
      if (prev.find(c => c.id === card.id)) {
        return prev.filter(c => c.id !== card.id);
      }
      return [...prev, card];
    });
  };

  const handleAskForCard = async (opponentId: string, request: string) => {
    if (!gameState || !currentPlayer) return;
    
    const opponent = gameState.players.find(p => p.id === opponentId);
    if (!opponent) return;

    const opponentHandForAI = opponent.hand.map(({ id, name, type, description }) => ({ id, name, type, description, imageUrl: '', hint: '' }));
    const result = await findMatchingCardAction({ request, opponentHand: opponentHandForAI });

    setGameState(prev => {
      if (!prev) return null;
      
      const askedCard = opponent.hand.find(c => c.id === result.cardId);
      let newPlayers = [...prev.players];

      if (askedCard) {
        alert(`${opponent.name} had the card! (${askedCard.name}). You get to go again. Reason: ${result.reason}`);
        const newOpponentHand = opponent.hand.filter(c => c.id !== askedCard.id);
        const newCurrentPlayerHand = [...currentPlayer.hand, askedCard];
        
        newPlayers = newPlayers.map(p => {
          if (p.id === opponentId) return { ...p, hand: newOpponentHand };
          if (p.id === currentPlayer.id) return { ...p, hand: newCurrentPlayerHand };
          return p;
        });

        return { ...prev, players: newPlayers, turnPhase: 'ask' };
      } else {
        alert(`Go Hist! ${opponent.name} did not have a matching card. You draw from the deck. Reason: ${result.reason}`);
        const drawnCard = prev.deck.length > 0 ? prev.deck[0] : null;
        const newDeck = prev.deck.length > 0 ? prev.deck.slice(1) : [];
        let newCurrentPlayerHand = [...currentPlayer.hand];
        if (drawnCard) {
          newCurrentPlayerHand.push(drawnCard);
        }

        newPlayers = newPlayers.map(p => {
          if (p.id === currentPlayer.id) return { ...p, hand: newCurrentPlayerHand };
          return p;
        });
        
        const nextPlayerIndex = (prev.players.findIndex(p => p.id === prev.currentPlayerId) + 1) % prev.players.length;
        const nextPlayerId = prev.players[nextPlayerIndex].id;

        return { ...prev, players: newPlayers, deck: newDeck, currentPlayerId: nextPlayerId, turnPhase: 'draw' };
      }
    });
  };

  const formHistSet = () => {
    if (selectedCards.length !== 4) {
        alert("You must select exactly 4 cards to form a Hist Set.");
        return;
    }
    if (!currentPlayer) return;

    if (!selectedCards.some(c => c.type === 'Person')) {
      alert("A Hist Set must contain at least one Person card.");
      return;
    }

    setGameState(prev => {
      if (!prev) return null;
      let winningPlayer: Player | null = null;
      const newPlayers = prev.players.map(p => {
        if (p.id === currentPlayer.id) {
            const updatedPlayer = {
                ...p,
                hand: p.hand.filter(c => !selectedCards.find(sc => sc.id === c.id)),
                histSets: [...p.histSets, selectedCards]
            };
            if (updatedPlayer.histSets.length >= WINNING_SET_COUNT) {
                winningPlayer = updatedPlayer;
            }
            return updatedPlayer;
        }
        return p;
      });
      if(winningPlayer) {
        setWinner(winningPlayer);
      }
      return { ...prev, players: newPlayers };
    });
    setSelectedCards([]);
  };

  if (!gameState || !currentPlayer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-headline text-2xl">Shuffling the annals of history...</p>
      </div>
    );
  }

  const otherPlayers = gameState.players.filter(p => p.id !== currentPlayer.id);

  return (
    <>
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-card p-4 flex flex-col border-r space-y-6">
        <h2 className="font-headline text-3xl text-primary flex items-center gap-2 border-b pb-4">Go Hist <Link href="/" className="ml-auto"><Button variant="ghost" size="icon"><ChevronLeft /></Button></Link></h2>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><Users /> Players</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {gameState.players.map(p => (
                <li key={p.id} className="flex justify-between items-center text-sm">
                  <span className={p.id === currentPlayer.id ? 'font-bold text-primary' : ''}>{p.name}</span>
                  <Badge variant="secondary">{p.histSets.length} Sets</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-headline text-xl">Game Tools</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <ConnectionVerifier selectedCards={selectedCards} />
               <AskForCard 
                otherPlayers={otherPlayers}
                onAsk={handleAskForCard} 
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
             <AccordionTrigger className="font-headline text-xl">Rules</AccordionTrigger>
             <AccordionContent className="space-y-2 text-sm text-muted-foreground pt-4">
                <p><strong className="text-foreground">Objective:</strong> Be the first to collect 5 "Hist Sets".</p>
                <p><strong className="text-foreground">Hist Set:</strong> A set of 4 cards that have a historical connection. Each set must contain at least one "Person" card.</p>
                <p><strong className="text-foreground">Asking:</strong> On your turn, you can ask an opponent for a card. Instead of asking for a specific card name, you ask a question (e.g., "Do you have a scientist?"). If they have a card that matches, you take it and go again. If not, you "Go Hist!" and draw a card from the deck, ending your turn.</p>
             </AccordionContent>
           </AccordionItem>
        </Accordion>
      </aside>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col p-6">
        {/* Opponents' Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
            {otherPlayers.map(player => (
                <div key={player.id} className="mb-8 w-full">
                    <p className="text-center font-headline mb-2">{player.name}'s Board</p>
                    <div className="flex justify-center items-start gap-4 flex-wrap">
                        <div className="flex gap-2">
                            {Array(player.hand.length).fill(0).map((_, i) => <GameCard key={i} card="back" className="w-[80px] h-[120px]" />)}
                        </div>
                        {player.histSets.map((set, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className="flex">
                              {set.map(card => <GameCard key={card.id} card={card} className="w-[80px] h-[120px] -ml-8 first:ml-0" />)}
                            </div>
                            <Button variant="outline" size="sm" className="mt-2"><Swords className="w-4 h-4 mr-2" /> Challenge</Button>
                          </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Center Area (Deck/Discard) */}
        <div className="flex justify-center items-center gap-8 my-8">
          <div>
            <p className="text-center font-headline mb-2">Deck ({gameState.deck.length})</p>
            <GameCard card="back" />
          </div>
          <div>
            <p className="text-center font-headline mb-2">Discard ({gameState.discardPile.length})</p>
            {gameState.discardPile.length > 0 && <GameCard card={gameState.discardPile[gameState.discardPile.length - 1]} />}
          </div>
        </div>

        {/* Player's Hand Area */}
        <div className="bg-card/50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline text-xl">{currentPlayer.name}'s Hand ({currentPlayer.hand.length})</h3>
              <Button onClick={formHistSet} disabled={selectedCards.length !== 4}>
                  <BookOpenCheck className="w-4 h-4 mr-2" />
                  Form Hist Set
              </Button>
          </div>
          <div className="flex justify-center items-end gap-4 h-full flex-wrap">
            {currentPlayer.hand.map(card => (
              <GameCard
                key={card.id}
                card={card}
                isSelected={!!selectedCards.find(c => c.id === card.id)}
                onSelect={handleSelectCard}
                isPlayerCard={true}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
    <AlertDialog open={!!winner}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 font-headline text-3xl">
            <Trophy className="text-primary w-8 h-8" />
            Game Over!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            {winner?.name} has won the game by collecting {WINNING_SET_COUNT} Hist Sets!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={startNewGame}>Play Again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
   </>
  );
}
