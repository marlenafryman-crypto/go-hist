'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GameState, Player, Card as CardType } from '@/lib/types';
import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ConnectionVerifier } from '@/components/game/ConnectionVerifier';
import { AskForCard } from '@/components/game/AskForCard';
import { HistSetVerifier } from '@/components/game/HistSetVerifier';
import { Users, Swords, BookOpenCheck, ChevronLeft, Trophy, Scale, Share2, Trash2, ArrowDownToLine, GitCommitHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { findMatchingCardAction } from './actions';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

function shuffle(array: any[]) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const INITIAL_HAND_SIZE = 7;
const WINNING_SET_COUNT = 2;


function GamePageContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams.get('code');
  const playerName = searchParams.get('player') || 'You';

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showHistSetDialog, setShowHistSetDialog] = useState(false);

  const currentPlayer = useMemo(() => {
    return gameState?.players.find(p => p.id === gameState.currentPlayerId);
  }, [gameState]);

  const startNewGame = () => {
     const shuffledDeck = shuffle(DECK);
    const players: Player[] = [
      { id: 'player1', name: playerName, hand: [], histSets: [] },
      { id: 'player2', name: 'Ada Lovelace', hand: [], histSets: [] },
    ];

    for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
      for (const player of players) {
        const card = shuffledDeck.pop();
        if (card) player.hand.push(card);
      }
    }

    setGameState({
      players,
      deck: shuffledDeck,
      discardPile: [shuffledDeck.pop()!],
      currentPlayerId: 'player1',
      turnPhase: 'action',
      log: ['New game started.'],
    });
    setWinner(null);
    setSelectedCards([]);
  }

  const addToLog = (message: string) => {
    setGameState(prev => prev ? { ...prev, log: [message, ...prev.log].slice(0, 20) } : null);
  };
  
  const endTurn = () => {
    setGameState(prev => {
      if (!prev) return null;
      const nextPlayerIndex = (prev.players.findIndex(p => p.id === prev.currentPlayerId) + 1) % prev.players.length;
      const nextPlayerId = prev.players[nextPlayerIndex].id;
      addToLog(`It is now ${prev.players[nextPlayerIndex].name}'s turn.`);
      return { ...prev, currentPlayerId: nextPlayerId, turnPhase: 'action' };
    });
    setSelectedCards([]);
  }

  const handleSelectCard = (card: CardType) => {
    setSelectedCards(prev => {
      const isSelected = prev.find(c => c.id === card.id);
      if (isSelected) {
        return prev.filter(c => c.id !== card.id);
      }
      if(gameState?.turnPhase === 'discard') {
        return [card];
      }
      if(prev.length >= 4) {
        return prev;
      }
      return [...prev, card];
    });
  };

   const handleDrawFromDeck = () => {
    if (!gameState || !currentPlayer || gameState.turnPhase !== 'action') return;

    setGameState(prev => {
      if (!prev) return null;
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop();
      if (!drawnCard) {
        addToLog('Deck is empty!');
        return prev;
      }
      const newHand = [...currentPlayer.hand, drawnCard];
      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: newHand } : p);
      
      addToLog(`${currentPlayer.name} drew "${drawnCard.name}" from the deck.`);
      return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
    });
  };

  const handleAskForCard = async (opponentId: string, request: string) => {
    if (!gameState || !currentPlayer) return;
    
    const opponent = gameState.players.find(p => p.id === opponentId);
    if (!opponent) return;

    addToLog(`${currentPlayer.name} asks ${opponent.name}: "${request}"`);

    const opponentHandForAI = opponent.hand.map(({ id, name, type, description }) => ({ id, name, type, description, imageUrl: '', hint: '' }));
    const result = await findMatchingCardAction({ request, opponentHand: opponentHandForAI });

    setGameState(prev => {
      if (!prev) return null;
      
      const thisPlayer = prev.players.find(p => p.id === prev.currentPlayerId);
      if (!thisPlayer) return prev;
      
      const askedCard = opponent.hand.find(c => c.id === result.cardId);

      if (askedCard) {
        addToLog(`${opponent.name} had "${askedCard.name}"! ${thisPlayer.name} takes it and goes again. Reason: ${result.reason}`);
        
        const newOpponentHand = opponent.hand.filter(c => c.id !== askedCard.id);
        const newPlayerHand = [...thisPlayer.hand, askedCard];
        
        const newPlayers = prev.players.map(p => {
          if (p.id === opponentId) return { ...p, hand: newOpponentHand };
          if (p.id === thisPlayer.id) return { ...p, hand: newPlayerHand };
          return p;
        });

        // Player gets to take another action
        return { ...prev, players: newPlayers, turnPhase: 'action' };
      } else {
        addToLog(`Go Hist! ${opponent.name} did not have a matching card. ${thisPlayer.name} must draw.`);
        
        const newDeck = [...prev.deck];
        const drawnCard = newDeck.pop();
        
        let newPlayerHand = [...thisPlayer.hand];
        if(drawnCard) {
            newPlayerHand.push(drawnCard);
            addToLog(`${thisPlayer.name} drew "${drawnCard.name}".`);
        } else {
            addToLog(`Deck is empty!`);
        }

        const newPlayers = prev.players.map(p => p.id === thisPlayer.id ? { ...p, hand: newPlayerHand } : p);
        
        return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
      }
    });
  };

  const handleFormHistSet = () => {
    if (!currentPlayer || !gameState) return;

    setShowHistSetDialog(false);
    
    setGameState(prev => {
      if (!prev) return null;
      let winningPlayer: Player | null = null;
      const newDeck = [...prev.deck];
      let newHand = [...(currentPlayer.hand || [])];
      newHand = newHand.filter(c => !selectedCards.find(sc => sc.id === c.id));
      
      // Draw 4 new cards
      for(let i=0; i<4; i++) {
        const drawnCard = newDeck.pop();
        if (drawnCard) {
          newHand.push(drawnCard);
        }
      }
      
      const newPlayers = prev.players.map(p => {
        if (p.id === currentPlayer.id) {
            const updatedPlayer = {
                ...p,
                hand: newHand,
                histSets: [...p.histSets, selectedCards]
            };
            if (updatedPlayer.histSets.length >= WINNING_SET_COUNT) {
                winningPlayer = updatedPlayer;
            }
            return updatedPlayer;
        }
        return p;
      });

      addToLog(`${currentPlayer.name} successfully formed a Hist Set! They draw 4 cards.`);

      if(winningPlayer) {
        setWinner(winningPlayer);
      }

      return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
    });
    setSelectedCards([]);
  };

  const handleDiscardCard = () => {
    if (!currentPlayer || !gameState || selectedCards.length !== 1 || gameState.turnPhase !== 'discard') return;

    const cardToDiscard = selectedCards[0];
    
    setGameState(prev => {
        if (!prev) return null;
        
        const newPlayers = prev.players.map(p => {
            if (p.id === currentPlayer.id) {
                return {
                    ...p,
                    hand: p.hand.filter(c => c.id !== cardToDiscard.id)
                };
            }
            return p;
        });

        const newDiscardPile = [...prev.discardPile, cardToDiscard];
        
        return {
            ...prev,
            players: newPlayers,
            discardPile: newDiscardPile
        };
    });
    
    addToLog(`${currentPlayer.name} discarded "${cardToDiscard.name}".`);
    endTurn();
  };

  if (!gameState || !currentPlayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="font-headline text-2xl mb-4">Welcome to Go Hist!</p>
        <Button onClick={startNewGame}>Start New Game</Button>
      </div>
    );
  }

  const otherPlayers = gameState.players.filter(p => p.id !== currentPlayer.id);
  const topOfDiscard = gameState.discardPile.length > 0 ? gameState.discardPile[gameState.discardPile.length - 1] : null;


  const renderTurnSpecificControls = () => {
    switch (gameState.turnPhase) {
      case 'action':
         return (
            <div className="flex justify-center items-center gap-4">
                 <Button onClick={() => setShowHistSetDialog(true)} disabled={selectedCards.length !== 4}>
                    <BookOpenCheck className="w-4 h-4 mr-2" />
                    Declare a Hist Set
                </Button>
                <Button onClick={handleDrawFromDeck} disabled={gameState.deck.length === 0} variant="outline">
                    <ArrowDownToLine className="w-4 h-4 mr-2" />
                    Draw from Deck ({gameState.deck.length})
                </Button>
            </div>
         );
      case 'discard':
        return (
            <Button onClick={handleDiscardCard} disabled={selectedCards.length !== 1}>
                <Trash2 className="w-4 h-4 mr-2" />
                Discard Selected Card
            </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-96 bg-card p-4 flex-col border-r space-y-6 hidden md:flex">
          <h2 className="font-headline text-3xl text-primary flex items-center gap-2 border-b pb-4">Go Hist <Link href="/" className="ml-auto"><Button variant="ghost" size="icon"><ChevronLeft /></Button></Link></h2>
          
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Share2 /> Share Game</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Share this code with a friend to have them join:</p>
              <div className="flex items-center space-x-2">
                <Input value={gameCode || ''} readOnly />
                <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users /> Players</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {gameState.players.map(p => (
                  <li key={p.id} className="flex justify-between items-center text-sm">
                    <span className={p.id === currentPlayer.id ? 'font-bold text-primary' : ''}>{p.name} {p.id === currentPlayer.id ? '(You)' : ''}</span>
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
                 <AskForCard 
                  otherPlayers={otherPlayers}
                  onAsk={handleAskForCard}
                  disabled={gameState.turnPhase !== 'action'}
                />
                <ConnectionVerifier selectedCards={selectedCards} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
               <AccordionTrigger className="font-headline text-xl">Game Log</AccordionTrigger>
               <AccordionContent className="pt-4">
                  <ScrollArea className="h-48 w-full rounded-md border p-2">
                    <ul className="space-y-1">
                      {gameState.log.map((entry, i) => (
                        <li key={i} className="text-xs text-muted-foreground">{entry}</li>
                      ))}
                    </ul>
                  </ScrollArea>
               </AccordionContent>
             </AccordionItem>
          </Accordion>
        </aside>

        {/* Main Game Area */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Opponents' Area */}
          <div className="flex-1 flex flex-col items-center justify-start py-8">
              {otherPlayers.map(player => (
                  <div key={player.id} className="mb-8 w-full">
                      <p className="text-center font-headline mb-2">{player.name}'s Board</p>
                      <div className="flex justify-center items-start gap-4 flex-wrap">
                          <div className="flex gap-2">
                              {Array(player.hand.length).fill(0).map((_, i) => <GameCard key={i} card="back" className="w-[80px] h-[120px]" />)}
                          </div>
                          {player.histSets.map((set, i) => (
                            <div key={i} className="flex flex-col items-center p-2 rounded-lg border-2 border-green-500 bg-green-500/10">
                              <div className="flex">
                                {set.map(card => <GameCard key={card.id} card={card} className="w-[80px] h-[120px] -ml-8 first:ml-0" inSet />)}
                              </div>
                            </div>
                          ))}
                      </div>
                  </div>
              ))}
              
              {/* Deck and Discard Pile */}
              <div className="flex items-end space-x-8 my-8">
                <div>
                  <p className="text-center font-headline mb-2">Deck</p>
                  <GameCard card="back" className="w-[120px] h-[180px]" />
                </div>
                <div>
                  <p className="text-center font-headline mb-2">Discard</p>
                  {topOfDiscard ? (
                    <GameCard card={topOfDiscard} className="w-[120px] h-[180px]" />
                  ) : (
                    <div className="w-[120px] h-[180px] rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Empty</p>
                    </div>
                  )}
                </div>
              </div>

          </div>

          {/* Player's Hand Area */}
          <div className="bg-card/50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline text-xl">{currentPlayer.name}'s Hand ({currentPlayer.hand.length})</h3>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground font-headline">Turn: <span className="text-primary font-bold">{gameState.turnPhase.toUpperCase()}</span></p>
                  {renderTurnSpecificControls()}
                </div>
            </div>
            <ScrollArea className="h-[250px] w-full">
              <div className="flex flex-wrap justify-center items-end gap-4 p-4">
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
            </ScrollArea>
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
             <Link href="/"><AlertDialogAction>Main Menu</AlertDialogAction></Link>
            <AlertDialogAction onClick={startNewGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showHistSetDialog} onOpenChange={setShowHistSetDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl">Declare a Hist Set</AlertDialogTitle>
             <AlertDialogDescription>
              You have selected four cards. Explain the historical connection between them to the Historian AI.
              If the connection is valid, the cards will form a new set.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <HistSetVerifier 
            selectedCards={selectedCards} 
            onVerified={handleFormHistSet}
          />
           <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <GamePageContent />
    </Suspense>
  );
}
