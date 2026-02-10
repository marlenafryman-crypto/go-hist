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

const LOCAL_GAME_KEY = 'go-hist-local-game';

interface VerificationResult {
    isValid: boolean;
    reason: string;
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (gameState && isClient) {
      window.localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(gameState));
    }
  }, [gameState, isClient]);

  const updateGameState = useCallback((newState: GameState | null | ((prevState: GameState | null) => GameState | null)) => {
    setGameState(prevState => {
      return typeof newState === 'function' ? newState(prevState) : newState;
    });
  }, []);

  const addToLog = useCallback((message: string) => {
    updateGameState(prev => {
      if (!prev) return null;
      const newLog = [message, ...prev.log].slice(0, 20);
      return { ...prev, log: newLog };
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
    const numPlayers = parseInt(searchParams?.get('numPlayers') || '2', 10);
    const shuffledDeck = createShuffledDeck();
    const humanPlayers: Player[] = [];
    
    for (let i = 0; i < numPlayers; i++) {
        const playerName = searchParams?.get(`player${i+1}`) || `Player ${i+1}`;
        humanPlayers.push({ id: `player${i+1}`, name: playerName, hand: [], histSets: [], isHuman: true });
    }

    const playersList = humanPlayers;
    
    for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
      for (const player of playersList) {
        const card = shuffledDeck.pop();
        if (card) player.hand.push(card);
      }
    }

    const firstPlayer = playersList[0];

    const newGameState: GameState = {
      players: playersList,
      deck: shuffledDeck,
      discardPile: [],
      currentPlayerId: firstPlayer.id,
      turnPhase: 'action',
      log: [`New game started. It is ${firstPlayer.name}'s turn.`],
    };
    
    setGameState(newGameState);
    setWinner(null);
    setSelectedCards([]);
    setHasTakenAction(false);
  }, [searchParams]);

  useEffect(() => {
    if (!isClient) return;
    const savedGame = window.localStorage.getItem(LOCAL_GAME_KEY);
    const forceNew = searchParams?.get('new') === 'true';

    if (forceNew || !savedGame || savedGame === 'undefined' || savedGame === 'null') {
      startNewGame();
    } else {
      try {
        const savedGameState = JSON.parse(savedGame);
        if (savedGameState && savedGameState.players) {
            setGameState(savedGameState);
            const winningPlayer = savedGameState.players.find((p: Player) => p.histSets.length >= 5);
            if (winningPlayer) setWinner(winningPlayer);
        } else {
          startNewGame();
        }
      } catch (e) {
        console.error("Failed to parse saved game state:", e);
        startNewGame();
      }
    }
  }, [isClient, startNewGame, searchParams]);

  const handleSelectCard = useCallback((card: CardType) => {
    if (winner) return;
    
    setSelectedCards(prev => {
      const isSelected = prev.find(c => c.id === card.id);
      if (isSelected) return prev.filter(c => c.id !== card.id);
      
      if (turnPhase === 'action') {
        if (prev.length < 4) return [...prev, card];
        return [...prev.slice(1), card];
      }
      if (turnPhase === 'discard') {
        return [card];
      }
      return prev;
    });
  }, [winner, turnPhase]);

   const handleDrawFromDeck = () => {
    if (!gameState || !currentPlayer || turnPhase !== 'action' || winner || hasTakenAction) return;

    updateGameState(prev => {
      if (!prev) return prev;
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop();
      if (!drawnCard) return prev;

      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);
      const playerHand = newPlayers.find(p => p.id === currentPlayer.id)!.hand;
      
      addToLog(`${currentPlayer.name} drew a card.`);
      setHasTakenAction(true);
      
      return { 
        ...prev, 
        players: newPlayers, 
        deck: newDeck, 
        turnPhase: playerHand.length > INITIAL_HAND_SIZE ? 'discard' : 'action' 
      };
    });
  };

  const handleDrawFromDiscard = () => {
    if (!gameState || !currentPlayer || turnPhase !== 'action' || winner || hasTakenAction) return;
    
    updateGameState(prev => {
      if (!prev || prev.discardPile.length === 0) return prev;
      const newDiscardPile = [...prev.discardPile];
      const drawnCard = newDiscardPile.pop();
      if (!drawnCard) return prev;

      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);
      const playerHand = newPlayers.find(p => p.id === currentPlayer.id)!.hand;

      addToLog(`${currentPlayer.name} took "${drawnCard.name}" from discard.`);
      setHasTakenAction(true);
      
      return { 
        ...prev, 
        players: newPlayers, 
        discardPile: newDiscardPile, 
        turnPhase: playerHand.length > INITIAL_HAND_SIZE ? 'discard' : 'action' 
      };
    });
  };

  const handleAskForCard = async (opponentId: string, request: string) => {
    if (!gameState || !currentPlayer || winner || hasTakenAction) return;

    const opponent = gameState.players.find(p => p.id === opponentId);
    if (!opponent) return;

    addToLog(`${currentPlayer.name} asks ${opponent.name}: "${request}"`);
    
    try {
        const result = await askForCard(opponent.hand, request);
        
        if(result.hasCard) {
            updateGameState(prev => {
                if (!prev) return null;
                const cardToGive = opponent.hand.find(c => c.id === result.cardId);
                if (!cardToGive) return prev;

                const newPlayers = prev.players.map(p => {
                    if (p.id === currentPlayer.id) return {...p, hand: [...p.hand, cardToGive]};
                    if (p.id === opponentId) return {...p, hand: p.hand.filter(c => c.id !== result.cardId)};
                    return p;
                });

                addToLog(`${opponent.name} gave "${cardToGive.name}" to ${currentPlayer.name}.`);
                setHasTakenAction(true);
                return { ...prev, players: newPlayers };
            });
        } else {
            addToLog(`Go Hist! ${opponent.name} did not have a matching card.`);
            setShowGoHistDialog(true);
        }
    } catch (e) {
        console.error("AI request failed:", e);
        toast({ variant: "destructive", title: "Error", description: "AI failed to process request." });
    }
  };

  const handleGoHistDraw = () => {
     updateGameState(prev => {
        if (!prev || !currentPlayer) return null;
        const newDeck = [...prev.deck];
        const drawnCard = newDeck.pop();
        if (!drawnCard) return prev;

        const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);
        const playerHand = newPlayers.find(p => p.id === currentPlayer.id)!.hand;
        
        addToLog(`${currentPlayer.name} drew from deck.`);
        setHasTakenAction(true);

        return { 
            ...prev, 
            players: newPlayers, 
            deck: newDeck, 
            turnPhase: playerHand.length > INITIAL_HAND_SIZE ? 'discard' : 'action' 
        };
      });
  }
  
  const handleDeclareSet = async (cards: CardType[], explanation: string) => {
    if(!currentPlayer) return;
    
    const hasPersonCard = cards.some(card => card.type === 'Person');
    if (!hasPersonCard) {
        toast({ variant: "destructive", title: "Invalid Set", description: "Must include at least one 'Person'." });
        return;
    }
    
    addToLog(`${currentPlayer.name} is proposing a Hist Set...`);
    setShowHistSetDialog(false);
    
    try {
        const result = await verifyHistSet(cards, explanation);
        addToLog(`AI Result: ${result.reason}`);
        if(result.isValid) {
            handleFormHistSet(currentPlayer, cards);
        } else {
            setHasTakenAction(true);
        }
        setVerificationResult(result);
    } catch (error) {
        console.error("AI verification failed:", error);
        toast({ variant: "destructive", title: "AI Error", description: "Verification failed." });
        setHasTakenAction(true);
    }
  }

  const handleFormHistSet = (player: Player, cardsToSet: CardType[]) => {
    updateGameState(prev => {
      if(!prev) return prev;
      const newDeck = [...prev.deck];
      let newHand = player.hand.filter(c => !cardsToSet.find(sc => sc.id === c.id));
      
      for(let i=0; i<4; i++) {
        const drawnCard = newDeck.pop();
        if (drawnCard) newHand.push(drawnCard);
      }
      
      const newPlayers = prev.players.map(p => {
        if (p.id === player.id) {
            const updatedPlayer = { ...p, hand: newHand, histSets: [...p.histSets, cardsToSet] };
            if (updatedPlayer.histSets.length >= 5) setWinner(updatedPlayer);
            return updatedPlayer;
        }
        return p;
      });

      addToLog(`${player.name} formed a Hist Set!`);
      return { ...prev, players: newPlayers, deck: newDeck };
    });
    endTurn();
  };

  const handleDiscardCard = () => {
    if (!currentPlayer || !gameState || turnPhase !== 'discard' || winner) return;
    
    const card = selectedCards[0];
    if (!card) return;

    updateGameState(prev => {
        if (!prev) return null;
        const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p);
        const newDiscardPile = [...prev.discardPile, card];
        const playerHand = newPlayers.find(p => p.id === currentPlayer.id)!.hand;

        addToLog(`${currentPlayer.name} discarded "${card.name}".`);
        setSelectedCards([]);

        if (playerHand.length > INITIAL_HAND_SIZE) {
            return { ...prev, players: newPlayers, discardPile: newDiscardPile, turnPhase: 'discard' };
        }
        
        return { ...prev, players: newPlayers, discardPile: newDiscardPile, turnPhase: 'action' };
    });
    
    const currentHandSize = currentPlayer.hand.length - 1;
    if (currentHandSize <= INITIAL_HAND_SIZE) {
        endTurn();
    }
  };

  if (!gameState || !currentPlayer) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="font-headline text-2xl mb-4">Loading the Past...</p>
        </div>
      );
  }

  const topOfDiscard = gameState.discardPile.length > 0 ? gameState.discardPile[gameState.discardPile.length - 1] : null;

  return (
    <>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <aside className="w-80 bg-card p-4 flex-col border-r space-y-6 hidden lg:flex overflow-y-auto">
          <h2 className="font-headline text-3xl text-primary flex items-center gap-2 border-b pb-4 shrink-0">
            Go Hist <Link href="/" className="ml-auto"><Button variant="ghost" size="icon"><ChevronLeft /></Button></Link>
          </h2>
          <Card className="shrink-0">
            <CardHeader className="p-4">
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="w-5 h-5" /> Players</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-2">
                {players.map(p => (
                  <li key={p.id} className="flex justify-between items-center text-sm">
                    <span className={p.id === currentPlayer.id ? 'font-bold text-primary' : ''}>{p.name}</span>
                    <Badge variant="secondary">{p.histSets.length} Sets</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="p-4 shrink-0"><CardTitle className="font-headline text-xl">Game Log</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0 flex-1 min-h-0 overflow-y-auto">
                <ul className="space-y-1">
                  {log.map((entry, i) => (<li key={i} className="text-xs text-muted-foreground">{entry}</li>))}
                </ul>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-8">
            {otherPlayers.map(player => (
              <div key={player.id}>
                <h3 className="font-headline text-lg mb-2">{player.name}'s Hand ({player.hand.length})</h3>
                <div className="flex items-end gap-2 p-2 bg-muted/20 rounded-lg min-h-[120px] overflow-x-auto">
                  {player.hand.map((_, index) => (<GameCard key={index} card="back" isPlayerCard={false} />))}
                </div>
              </div>
            ))}

            <div className="flex items-end justify-center space-x-8">
                <div className="text-center">
                    <p className="font-headline mb-2 text-sm">Deck ({deck.length})</p>
                    <div className={(turnPhase === 'action' && !hasTakenAction) ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-not-allowed opacity-80'} onClick={handleDrawFromDeck}>
                      <GameCard card="back" className="w-[100px] h-[150px]" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-headline mb-2 text-sm">Discard</p>
                    <div className={(turnPhase === 'action' && !hasTakenAction) ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-not-allowed opacity-80'} onClick={handleDrawFromDiscard}>
                    {topOfDiscard ? (<GameCard card={topOfDiscard} className="w-[100px] h-[150px]" />) : (
                        <div className="w-[100px] h-[150px] rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center">
                            <p className="text-[10px] text-muted-foreground">Empty</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-card/50 p-4 rounded-lg border mt-4 shrink-0">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline text-xl">{currentPlayer.name}'s Hand ({currentPlayer.hand.length})</h3>
                <Badge variant="outline" className="font-headline px-3 py-1">PHASE: {turnPhase.toUpperCase()}</Badge>
            </div>
            
            <Tabs defaultValue="hand">
                <TabsList className="mb-4">
                    <TabsTrigger value="hand">Hand</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                <TabsContent value="hand">
                  <div className="w-full overflow-x-auto pb-4">
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
                  </div>
                </TabsContent>
                <TabsContent value="actions">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {turnPhase === 'action' && !winner && (
                             <>
                                <div className="space-y-4">
                                    <h3 className="font-headline text-lg border-b pb-1">Resources</h3>
                                    <Button variant="outline" className="w-full" onClick={handleDrawFromDeck} disabled={deck.length === 0 || hasTakenAction}>
                                        <ArrowDownToLine className="mr-2 h-4 w-4"/> Draw Card
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={handleDrawFromDiscard} disabled={!topOfDiscard || hasTakenAction}>
                                        <Trash2 className="mr-2 h-4 w-4"/> Take Discard
                                    </Button>
                                    { (hasTakenAction && currentPlayer.hand.length <= INITIAL_HAND_SIZE) &&
                                        <Button variant="secondary" className="w-full" onClick={endTurn}>End Turn</Button>
                                    }
                                </div>
                                <div className="space-y-4">
                                     <h3 className="font-headline text-lg border-b pb-1">Sets</h3>
                                     <Button variant="default" className="w-full" onClick={() => setShowHistSetDialog(true)} disabled={hasTakenAction || selectedCards.length !== 4}>
                                        <BookOpenCheck className="w-4 h-4 mr-2" /> Declare a Set (4 cards)
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                  <h3 className="font-headline text-lg border-b pb-1">Interactions</h3>
                                  <AskForCard otherPlayers={otherPlayers} onAsk={handleAskForCard} disabled={hasTakenAction} />
                                </div>
                             </>
                        )}
                         {turnPhase === 'discard' && (
                            <div className="space-y-4 max-w-sm">
                                <h3 className="font-headline text-lg text-primary">Discard Needed</h3>
                                <p className="text-sm text-muted-foreground">Select one card from your hand to discard and click below.</p>
                                <Button className="w-full" onClick={handleDiscardCard} disabled={selectedCards.length !== 1}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Discard Selected Card
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
            <AlertDialogTitle className="flex items-center gap-2 font-headline text-3xl text-primary"><Trophy className="w-8 h-8" /> Game Over!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-headline text-center mt-4">{winner?.name} has triumphed through history!</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-4">
             <Link href="/"><AlertDialogAction variant="outline">Main Menu</AlertDialogAction></Link>
            <AlertDialogAction onClick={startNewGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showHistSetDialog} onOpenChange={setShowHistSetDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl">Propose a Historical Set</AlertDialogTitle>
             <AlertDialogDescription>Explain why these four cards are connected. One must be a Person.</AlertDialogDescription>
          </AlertDialogHeader>
          <HistSetVerifier selectedCards={selectedCards} onVerified={(explanation) => handleDeclareSet(selectedCards, explanation)} />
           <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showGoHistDialog} onOpenChange={setShowGoHistDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline text-4xl text-primary text-center">GO HIST!</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-lg">Your opponent doesn't have that card. Draw from the deck to find your way.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogAction className="w-32" onClick={() => { setShowGoHistDialog(false); handleGoHistDraw(); }}>Draw Card</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!verificationResult} onOpenChange={(open) => !open && setVerificationResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-headline text-2xl">
                <Sparkles className={`w-6 h-6 ${verificationResult?.isValid ? 'text-green-500' : 'text-red-500'}`} />
                AI Chronologist Result
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
              <div className={`p-4 border rounded-lg ${verificationResult?.isValid ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                <p className="font-bold text-lg">{verificationResult?.isValid ? "Set Accepted!" : "Set Rejected"}</p>
                <p className="text-sm mt-2">"{verificationResult?.reason}"</p>
              </div>
          </div>
          <AlertDialogFooter><AlertDialogAction onClick={() => setVerificationResult(null)}>Understood</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Rewinding the Clock...</div>}>
      <GamePageContent />
    </Suspense>
  );
}
