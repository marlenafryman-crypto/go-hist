
'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GameState, Player, Card as CardType } from '@/lib/types';
import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { HistSetVerifier } from '@/components/game/HistSetVerifier';
import { Users, BookOpenCheck, ChevronLeft, Trophy, Trash2, ArrowDownToLine, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AskForCard } from '@/components/game/AskForCard';
import { INITIAL_HAND_SIZE } from '@/lib/types';
import { askForCard, verifyHistSet } from './actions';
import { useToast } from '@/hooks/use-toast';

function createShuffledDeck() {
  const a = [...DECK];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const WINNING_SET_COUNT = 5;
const LOCAL_GAME_KEY = 'go-hist-local-game';

interface VerificationResult {
    isValid: boolean;
    reason: string;
    isDeclaringPlayer: boolean;
}

function GamePageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showHistSetDialog, setShowHistSetDialog] = useState(false);
  const [showGoHistDialog, setShowGoHistDialog] = useState(false);
  const [hasTakenAction, setHasTakenAction] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const players = useMemo(() => gameState?.players || [], [gameState?.players]);
  const currentPlayerId = useMemo(() => gameState?.currentPlayerId, [gameState?.currentPlayerId]);
  const turnPhase = useMemo(() => gameState?.turnPhase, [gameState?.turnPhase]);
  const log = useMemo(() => gameState?.log || [], [gameState?.log]);
  const deck = useMemo(() => gameState?.deck || [], [gameState?.deck]);

  const updateGameState = useCallback((newState: GameState | null | ((prevState: GameState | null) => GameState | null)) => {
    setGameState(prevState => {
      const updatedState = typeof newState === 'function' ? newState(prevState) : newState;
      if (typeof window !== 'undefined') {
        if (updatedState) {
          window.localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(updatedState));
        } else {
          window.localStorage.removeItem(LOCAL_GAME_KEY);
        }
      }
      return updatedState;
    });
  }, []);

  const addToLog = useCallback((message: string) => {
    updateGameState(prev => {
      if (!prev) return null;
      const newLog = [message, ...prev.log].slice(0, 20);
      const newState = { ...prev, log: newLog };
      return newState;
    });
  }, [updateGameState]);
  
  const currentPlayer = useMemo(() => {
    if (!players || !currentPlayerId) return null;
    return players.find(p => p.id === currentPlayerId);
  }, [players, currentPlayerId]);

  const otherPlayers = useMemo(() => {
    if (!players || !currentPlayer) return [];
    return players.filter(p => p.id !== currentPlayer.id);
  }, [players, currentPlayer]);
  
  const endTurn = useCallback(() => {
    updateGameState(prev => {
      if (!prev) return null;
      const currentPlayerIndex = prev.players.findIndex(p => p.id === prev.currentPlayerId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % prev.players.length;
      const nextPlayer = prev.players[nextPlayerIndex];
      const newLog = [`It is now ${nextPlayer.name}'s turn.`, ...prev.log].slice(0, 20);
      
      setHasTakenAction(false);
      setSelectedCards([]);

      return {
        ...prev,
        log: newLog,
        currentPlayerId: nextPlayer.id,
        turnPhase: 'action',
      };
    });
  }, [updateGameState]);

  const startNewGame = useCallback(() => {
    if (!searchParams || typeof window === 'undefined') return;
    
    const numPlayers = parseInt(searchParams.get('numPlayers') || '2', 10);
    
    const humanPlayers: Player[] = [];
    for (let i = 0; i < numPlayers; i++) {
        const playerName = searchParams.get(`player${i+1}`) || `Player ${i+1}`;
        humanPlayers.push({ id: `player${i+1}`, name: playerName, hand: [], histSets: [], isHuman: true });
    }

    const players = humanPlayers;

    const shuffledDeck = createShuffledDeck();
    
    for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
      for (const player of players) {
        const card = shuffledDeck.pop();
        if (card) player.hand.push(card);
      }
    }

    const firstPlayer = players[Math.floor(Math.random() * players.length)];

    const newGameState = {
      players,
      deck: shuffledDeck,
      discardPile: shuffledDeck.length > 0 ? [shuffledDeck.pop()!] : [],
      currentPlayerId: firstPlayer.id,
      turnPhase: 'action' as 'action' | 'discard',
      log: [`New game started with ${numPlayers} players. It is ${firstPlayer.name}'s turn.`],
    };
    
    updateGameState(newGameState);
    setWinner(null);
    setSelectedCards([]);
    setHasTakenAction(false);
  }, [searchParams, updateGameState]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const savedGame = window.localStorage.getItem(LOCAL_GAME_KEY);
    if (savedGame && savedGame !== 'undefined' && savedGame !== 'null') {
      try {
        const savedGameState = JSON.parse(savedGame);
        if (savedGameState && savedGameState.players) {
            setGameState(savedGameState);
            const winningPlayer = savedGameState.players.find((p: Player) => p.histSets.length >= WINNING_SET_COUNT);
            if (winningPlayer) {
              setWinner(winningPlayer);
            }
        } else {
            startNewGame();
        }
      } catch (e) {
        console.error("Failed to parse saved game state:", e);
        startNewGame();
      }
    } else if (searchParams && searchParams.get('numPlayers')) {
      startNewGame();
    }
  }, [isClient, searchParams, startNewGame]);

  const handleSelectCard = (card: CardType) => {
    if (winner) return;
    
    setSelectedCards(prev => {
      const isSelected = prev.find(c => c.id === card.id);
      if (isSelected) {
        return prev.filter(c => c.id !== card.id);
      }
      
      if (turnPhase === 'action') {
        if (prev.length < 4) {
            return [...prev, card];
        } else {
            return [...prev.slice(1), card];
        }
      }
      if (turnPhase === 'discard') {
        return [card];
      }
      return prev;
    });
  };
  

   const handleDrawFromDeck = () => {
    if (!gameState || !currentPlayer || turnPhase !== 'action' || winner || hasTakenAction) return;

    updateGameState(prev => {
      if (!prev || !currentPlayer) return prev;

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop();
      if (!drawnCard) {
        addToLog('Deck is empty!');
        setHasTakenAction(true);
        return { ...prev };
      }
      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);
      
      addToLog(`${currentPlayer.name} drew "${drawnCard.name}" from the deck.`);
      setHasTakenAction(true);

      const updatedCurrentPlayer = newPlayers.find(p => p.id === currentPlayer.id);
      if (updatedCurrentPlayer && updatedCurrentPlayer.hand.length > INITIAL_HAND_SIZE) {
        return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
      }

      return { ...prev, players: newPlayers, deck: newDeck };
    });
  };

  const handleDrawFromDiscard = () => {
    if (!gameState || !currentPlayer || turnPhase !== 'action' || winner || hasTakenAction) return;
    
    updateGameState(prev => {
      if (!prev || !currentPlayer || prev.turnPhase !== 'action') return prev;
      const newDiscardPile = [...prev.discardPile];
      const drawnCard = newDiscardPile.pop();

      if (!drawnCard) {
        setHasTakenAction(true);
        return prev;
      }

      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);

      addToLog(`${currentPlayer.name} took "${drawnCard.name}" from the discard pile.`);
      setHasTakenAction(true);
      
      const updatedCurrentPlayer = newPlayers.find(p => p.id === currentPlayer.id);
      if (updatedCurrentPlayer && updatedCurrentPlayer.hand.length > INITIAL_HAND_SIZE) {
        return { ...prev, players: newPlayers, discardPile: newDiscardPile, turnPhase: 'discard' };
      }
      
      return { ...prev, players: newPlayers, discardPile: newDiscardPile };
    });
  };

  const handleAskForCard = async (opponentId: string, request: string) => {
    if (!gameState || !currentPlayer || winner || hasTakenAction) return;

    const opponent = gameState.players.find(p => p.id === opponentId);
    if (!opponent) return;

    addToLog(`${currentPlayer.name} asks ${opponent.name}: "${request}"`);
    
    const result = await askForCard(opponent.hand, request);
    
    if(result.hasCard) {
        updateGameState(prev => {
            if (!prev) return null;
            const cardToGive = opponent.hand.find(c => c.id === result.cardId);
            if (!cardToGive) return prev;

            const newPlayers = prev.players.map(p => {
                if (p.id === currentPlayer.id) {
                    return {...p, hand: [...p.hand, cardToGive]};
                }
                if (p.id === opponentId) {
                    return {...p, hand: p.hand.filter(c => c.id !== result.cardId)};
                }
                return p;
            });

            addToLog(`${opponent.name} had "${cardToGive.name}" and gave it to ${currentPlayer.name}.`);
            setHasTakenAction(true);
            return { ...prev, players: newPlayers };
        });
    } else {
        addToLog(`Go Hist! ${opponent.name} did not have a matching card.`);
        setShowGoHistDialog(true);
    }
  };

  const handleGoHistDraw = () => {
     updateGameState(prev => {
        if (!prev || !currentPlayer) return null;
        
        const newDeck = [...prev.deck];
        const drawnCard = newDeck.pop();
        let newPlayers = [...prev.players];
        
        if (drawnCard) {
          addToLog(`${currentPlayer.name} drew "${drawnCard.name}".`);
          newPlayers = prev.players.map(p => {
            if (p.id === currentPlayer.id) {
              return { ...p, hand: [...p.hand, drawnCard] };
            }
            return p;
          });
        } else {
          addToLog(`Deck is empty!`);
        }
        
        setHasTakenAction(true);

        const updatedCurrentPlayer = newPlayers.find(p => p.id === currentPlayer.id);
        if (updatedCurrentPlayer && updatedCurrentPlayer.hand.length > INITIAL_HAND_SIZE) {
            return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
        }

        return { ...prev, players: newPlayers, deck: newDeck };
      });
  }
  
  const handleDeclareSet = async (cards: CardType[], explanation: string) => {
    if(!currentPlayer) return;
    
    const hasPersonCard = cards.some(card => card.type === 'Person');
    if (!hasPersonCard) {
        toast({
            variant: "destructive",
            title: "Invalid Set",
            description: "The proposed set must contain at least one 'Person' card.",
        });
        return;
    }
    
    addToLog(`${currentPlayer.name} is proposing a Hist Set...`);
    setShowHistSetDialog(false);
    
    try {
        const result = await verifyHistSet(cards, explanation);
        addToLog(`AI says: ${result.reason}`);
        if(result.isValid) {
            handleFormHistSet(currentPlayer, cards);
        } else {
            setHasTakenAction(true);
        }
        setVerificationResult({
            ...result,
            isDeclaringPlayer: true
        });

    } catch (error) {
        console.error("AI verification failed:", error);
        addToLog("AI verification failed. The turn continues.");
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not verify the set with the AI.",
        });
        setHasTakenAction(true);
    }
  }

  const handleFormHistSet = (player: Player, cardsToSet: CardType[]) => {
    if (!gameState || winner) return;

    updateGameState(prev => {
      if(!prev) return prev;

      let winningPlayer: Player | null = null;
      const newDeck = [...prev.deck];
      let newHand = [...(player.hand || [])];
      newHand = newHand.filter(c => !cardsToSet.find(sc => sc.id === c.id));
      
      for(let i=0; i<4; i++) {
        const drawnCard = newDeck.pop();
        if (drawnCard) {
          newHand.push(drawnCard);
        }
      }
      
      const newPlayers = prev.players.map(p => {
        if (p.id === player.id) {
            const updatedPlayer = {
                ...p,
                hand: newHand,
                histSets: [...p.histSets, cardsToSet]
            };
            if (updatedPlayer.histSets.length >= WINNING_SET_COUNT) {
                winningPlayer = updatedPlayer;
                setWinner(updatedPlayer);
            }
            return updatedPlayer;
        }
        return p;
      });

      addToLog(`${player.name} successfully formed a Hist Set! They draw 4 cards.`);
      
      const updatedCurrentPlayer = newPlayers.find(p => p.id === player.id);
      
      if (winningPlayer) {
        return { ...prev, players: newPlayers, deck: newDeck };
      }

      if (updatedCurrentPlayer && updatedCurrentPlayer.hand.length > INITIAL_HAND_SIZE) {
        return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
      }

      endTurn();
      return { ...prev, players: newPlayers, deck: newDeck };
    });
  };

  const handleDiscardCard = () => {
    if (!currentPlayer || !gameState || turnPhase !== 'discard' || winner) return;
    
    const card = selectedCards[0];
    
    if (!card) {
      if (currentPlayer.hand.length <= INITIAL_HAND_SIZE) {
           endTurn();
           return;
      }
      toast({
            variant: "destructive",
            title: "No card selected",
            description: "You must select a card to discard.",
      });
      return;
    }

    updateGameState(prev => {
        if (!prev || !currentPlayer) return null;

        let newPlayers = prev.players;
        let newDiscardPile = prev.discardPile;
        
        newPlayers = prev.players.map(p => {
            if (p.id === currentPlayer.id) {
                return { ...p, hand: p.hand.filter(c => c.id !== card.id) };
            }
            return p;
        });
        newDiscardPile = [...prev.discardPile, card];
        addToLog(`${currentPlayer.name} discarded "${card.name}".`);

        const updatedCurrentPlayer = newPlayers.find(p => p.id === currentPlayer.id);
        if (updatedCurrentPlayer && updatedCurrentPlayer.hand.length > INITIAL_HAND_SIZE) {
            setSelectedCards([]);
            return { ...prev, players: newPlayers, discardPile: newDiscardPile, turnPhase: 'discard' };
        }
        
        endTurn();
        return { ...prev, players: newPlayers, discardPile: newDiscardPile };
    });
  };

  if (!gameState || !currentPlayer) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="font-headline text-2xl mb-4">Loading the Past...</p>
          <p className="text-muted-foreground mb-4">Go back to the main menu to start a new game.</p>
          <Link href="/">
              <Button>Main Menu</Button>
          </Link>
        </div>
      );
  }

  const topOfDiscard = gameState.discardPile.length > 0 ? gameState.discardPile[gameState.discardPile.length - 1] : null;

  return (
    <>
      <div className="flex h-screen bg-background text-foreground">
        <aside className="w-96 bg-card p-4 flex-col border-r space-y-6 hidden md:flex">
          <h2 className="font-headline text-3xl text-primary flex items-center gap-2 border-b pb-4">Go Hist <Link href="/" className="ml-auto"><Button variant="ghost" size="icon"><ChevronLeft /></Button></Link></h2>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users /> Players</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {players.map(p => (
                  <li key={p.id} className="flex justify-between items-center text-sm">
                    <span className={p.id === currentPlayer.id ? 'font-bold text-primary' : ''}>
                      {p.name}
                    </span>
                    <Badge variant="secondary">{p.histSets.length} Sets</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Game Log</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-48 w-full rounded-md border p-2">
                  <ul className="space-y-1">
                    {log.map((entry, i) => (
                      <li key={i} className="text-xs text-muted-foreground">{entry}</li>
                    ))}
                  </ul>
                </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 flex flex-col p-6">
          <div className="flex-1 overflow-y-auto space-y-8">
            {otherPlayers.map(player => (
              <div key={player.id}>
                <h3 className="font-headline text-lg mb-2">{player.name}'s Hand ({player.hand.length})</h3>
                <div className="flex items-end gap-2 p-2 bg-muted/20 rounded-lg min-h-[120px]">
                  {player.hand.map((card, index) => (
                    <GameCard
                      key={`${card.id}-${index}`}
                      card="back"
                      isPlayerCard={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end justify-center space-x-8 my-8">
              <div>
                  <p className="text-center font-headline mb-2">Deck ({deck.length})</p>
                  <div className={(turnPhase === 'action' && !hasTakenAction) ? 'cursor-pointer' : 'cursor-not-allowed'} onClick={(turnPhase === 'action' && !hasTakenAction) ? handleDrawFromDeck : undefined}>
                    <GameCard card="back" className="w-[120px] h-[180px]" />
                  </div>
              </div>
              <div>
                  <p className="text-center font-headline mb-2">Discard</p>
                  <div className={(turnPhase === 'action' && !hasTakenAction) ? 'cursor-pointer' : 'cursor-not-allowed'} onClick={(turnPhase === 'action' && !hasTakenAction) ? handleDrawFromDiscard : undefined}>
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

          <div className="bg-card/50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline text-xl">{currentPlayer.name}'s Hand ({currentPlayer.hand.length})</h3>
                 <p className="text-sm text-muted-foreground font-headline">Turn: <span className="text-primary font-bold">{turnPhase.toUpperCase()}</span></p>
            </div>
            
            <Tabs defaultValue="hand">
                <TabsList className="mb-4">
                    <TabsTrigger value="hand">Hand</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                <TabsContent value="hand">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max items-end gap-4 p-4">
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
                </TabsContent>
                <TabsContent value="actions">
                    <div className="p-4">
                        {winner && <p className="text-lg text-primary font-headline animate-pulse">Game Over!</p>}

                        {turnPhase === 'action' && !winner && (
                             <div className="flex items-start gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-headline text-xl">Basic Actions</h3>
                                    <Button variant="outline" size="sm" onClick={handleDrawFromDeck} disabled={deck.length === 0 || hasTakenAction}>
                                        <ArrowDownToLine className="mr-2"/> Draw From Deck
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleDrawFromDiscard} disabled={!topOfDiscard || hasTakenAction}>
                                        <Trash2 className="mr-2"/> Take From Discard
                                    </Button>
                                    { (hasTakenAction && currentPlayer.hand.length <= INITIAL_HAND_SIZE) &&
                                        <Button variant="secondary" size="sm" onClick={endTurn}>
                                            End Turn
                                        </Button>
                                    }
                                </div>
                                <div className="space-y-4">
                                     <h3 className="font-headline text-xl">Set Actions</h3>
                                     <Button variant="outline" size="sm" onClick={() => setShowHistSetDialog(true)} disabled={hasTakenAction || selectedCards.length !== 4}>
                                        <BookOpenCheck className="w-4 h-4 mr-2" />
                                        Declare a Set
                                    </Button>
                                </div>
                                <AskForCard 
                                    otherPlayers={otherPlayers}
                                    onAsk={handleAskForCard}
                                    disabled={hasTakenAction}
                                />
                             </div>
                        )}
                         {turnPhase === 'discard' && (
                            <div className="space-y-4">
                                <h3 className="font-headline text-xl">Discard a Card</h3>
                                <p className="text-muted-foreground">Your hand is over the limit. Select one card from your hand to discard.</p>
                                <Button onClick={() => handleDiscardCard()} disabled={selectedCards.length !== 1}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Discard Selected Card
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
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
              You have selected four cards. Explain the historical connection to the AI for verification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <HistSetVerifier 
            selectedCards={selectedCards} 
            onVerified={(explanation) => handleDeclareSet(selectedCards, explanation)}
          />
           <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showGoHistDialog} onOpenChange={setShowGoHistDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline text-3xl text-primary">Go Hist!</AlertDialogTitle>
              <AlertDialogDescription>
                Your opponent did not have the card you asked for. You will now draw a card from the deck.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => {
                setShowGoHistDialog(false);
                handleGoHistDraw();
              }}>OK</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!verificationResult} onOpenChange={(open) => !open && setVerificationResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-headline text-2xl">
                <Sparkles className={`w-6 h-6 ${verificationResult?.isValid ? 'text-green-500' : 'text-red-500'}`} />
                Set Verification Result
            </AlertDialogTitle>
            <AlertDialogDescription>
              {verificationResult?.isDeclaringPlayer ? "The AI has reviewed your set." : `The AI has reviewed ${currentPlayer?.name}'s set.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
              <div className={`p-4 border rounded-lg ${verificationResult?.isValid ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                <p className="font-semibold">{verificationResult?.isValid ? "Set Accepted!" : "Set Rejected"}</p>
                <p className="text-muted-foreground">"{verificationResult?.reason}"</p>
              </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setVerificationResult(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading the Past...</div>}>
      <GamePageContent />
    </Suspense>
  );
}

    