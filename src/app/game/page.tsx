
'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GameState, Player, Card as CardType } from '@/lib/types';
import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { HistSetVerifier } from '@/components/game/HistSetVerifier';
import { BookOpenCheck, ChevronLeft, Trash2, History as HistoryIcon, User, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AskForCard } from '@/components/game/AskForCard';
import { INITIAL_HAND_SIZE } from '@/lib/types';
import { askForCard, verifyHistSet } from './actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOCAL_GAME_KEY = 'go-hist-local-game';

function createShuffledDeck() {
  const a = [...DECK];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addToLog = useCallback((message: string) => {
    setGameState(prev => {
      if (!prev) return null;
      return { ...prev, log: [message, ...prev.log].slice(0, 20) };
    });
  }, []);

  const startNewGame = useCallback(() => {
    const numPlayersString = searchParams?.get('numPlayers');
    const numPlayers = numPlayersString ? parseInt(numPlayersString, 10) : 2;
    const shuffledDeck = createShuffledDeck();
    const players: Player[] = [];

    for (let i = 0; i < numPlayers; i++) {
      const playerName = searchParams?.get(`player${i + 1}`) || `Player ${i + 1}`;
      players.push({ id: `player${i + 1}`, name: playerName, hand: [], histSets: [], isHuman: true });
    }

    for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
      for (const player of players) {
        const card = shuffledDeck.pop();
        if (card) player.hand.push(card);
      }
    }

    const newGameState: GameState = {
      players,
      deck: shuffledDeck,
      discardPile: [],
      currentPlayerId: players[0].id,
      turnPhase: 'action',
      log: [`New game started. It is ${players[0].name}'s turn.`],
    };

    setGameState(newGameState);
    setWinner(null);
    setSelectedCards([]);
    setHasTakenAction(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(newGameState));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isClient) return;
    const savedGame = localStorage.getItem(LOCAL_GAME_KEY);
    const forceNew = searchParams?.get('new') === 'true';

    if (forceNew || !savedGame || savedGame === 'null') {
      startNewGame();
    } else {
      try {
        const savedGameState = JSON.parse(savedGame);
        if (savedGameState && savedGameState.players) {
          setGameState(savedGameState);
        } else {
          startNewGame();
        }
      } catch (error) {
        startNewGame();
      }
    }
  }, [isClient, startNewGame, searchParams]);

  useEffect(() => {
    if (gameState && isClient) {
      localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(gameState));
    }
  }, [gameState, isClient]);

  const currentPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players.find(p => p.id === gameState.currentPlayerId);
  }, [gameState]);

  const otherPlayers = useMemo(() => {
    if (!gameState || !currentPlayer) return [];
    return gameState.players.filter(p => p.id !== currentPlayer.id);
  }, [gameState, currentPlayer]);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      if (!prev) return null;
      const currentIndex = prev.players.findIndex(p => p.id === prev.currentPlayerId);
      const nextIndex = (currentIndex + 1) % prev.players.length;
      const nextPlayer = prev.players[nextIndex];
      setHasTakenAction(false);
      setSelectedCards([]);
      return {
        ...prev,
        currentPlayerId: nextPlayer.id,
        turnPhase: 'action',
        log: [`It is now ${nextPlayer.name}'s turn.`, ...prev.log].slice(0, 20),
      };
    });
  }, []);

  const handleSelectCard = useCallback((card: CardType) => {
    if (winner || !gameState) return;
    setSelectedCards(prev => {
      const isSelected = prev.find(c => c.id === card.id);
      if (isSelected) return prev.filter(c => c.id !== card.id);
      if (gameState.turnPhase === 'action') return prev.length < 4 ? [...prev, card] : [...prev.slice(1), card];
      if (gameState.turnPhase === 'discard') return [card];
      return prev;
    });
  }, [winner, gameState]);

  const handleDrawFromDeck = () => {
    if (!gameState || !currentPlayer || gameState.turnPhase !== 'action' || hasTakenAction) return;
    setGameState(prev => {
      if (!prev) return prev;
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop();
      if (!drawnCard) return prev;
      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);
      setHasTakenAction(true);
      const updatedPlayer = newPlayers.find(p => p.id === currentPlayer.id)!;
      return {
        ...prev,
        players: newPlayers,
        deck: newDeck,
        turnPhase: updatedPlayer.hand.length > INITIAL_HAND_SIZE ? 'discard' : 'action',
        log: [`${currentPlayer.name} drew a card.`, ...prev.log].slice(0, 20)
      };
    });
  };

  const handleDrawFromDiscard = () => {
    if (!gameState || !currentPlayer || gameState.turnPhase !== 'action' || hasTakenAction || gameState.discardPile.length === 0) return;
    setGameState(prev => {
      if (!prev) return prev;
      const newDiscard = [...prev.discardPile];
      const drawnCard = newDiscard.pop();
      if (!drawnCard) return prev;
      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);
      setHasTakenAction(true);
      const updatedPlayer = newPlayers.find(p => p.id === currentPlayer.id)!;
      return {
        ...prev,
        players: newPlayers,
        discardPile: newDiscard,
        turnPhase: updatedPlayer.hand.length > INITIAL_HAND_SIZE ? 'discard' : 'action',
        log: [`${currentPlayer.name} took ${drawnCard.name} from discard.`, ...prev.log].slice(0, 20)
      };
    });
  };

  const handleAskForCard = async (opponentId: string, request: string) => {
    if (!gameState || !currentPlayer || hasTakenAction) return;
    const opponent = gameState.players.find(p => p.id === opponentId);
    if (!opponent) return;
    addToLog(`${currentPlayer.name} asked ${opponent.name} for: "${request}"`);
    try {
      const result = await askForCard(opponent.hand, request);
      if (result.hasCard) {
        setGameState(prev => {
          if (!prev) return null;
          const card = opponent.hand.find(c => c.id === result.cardId);
          if (!card) return prev;
          const newPlayers = prev.players.map(p => {
            if (p.id === currentPlayer.id) return { ...p, hand: [...p.hand, card] };
            if (p.id === opponentId) return { ...p, hand: p.hand.filter(c => c.id !== result.cardId) };
            return p;
          });
          setHasTakenAction(true);
          const updatedPlayer = newPlayers.find(p => p.id === currentPlayer.id)!;
          return {
            ...prev,
            players: newPlayers,
            turnPhase: updatedPlayer.hand.length > INITIAL_HAND_SIZE ? 'discard' : 'action',
            log: [`${opponent.name} gave ${card.name} to ${currentPlayer.name}.`, ...prev.log].slice(0, 20)
          };
        });
      } else {
        addToLog(`GO HIST! ${opponent.name} has no matching card.`);
        setShowGoHistDialog(true);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "AI failed to process request." });
    }
  };

  const handleDeclareSet = async (cards: CardType[], explanation: string) => {
    if (!currentPlayer) return;
    setShowHistSetDialog(false);
    try {
      const result = await verifyHistSet(cards, explanation);
      setVerificationResult(result);
      if (result.isValid) {
        setGameState(prev => {
          if (!prev) return prev;
          const newDeck = [...prev.deck];
          let newHand = currentPlayer.hand.filter(c => !cards.find(sc => sc.id === c.id));
          for (let i = 0; i < 4; i++) {
            const drawn = newDeck.pop();
            if (drawn) newHand.push(drawn);
          }
          const newPlayers = prev.players.map(p => {
            if (p.id === currentPlayer.id) {
              const updated = { ...p, hand: newHand, histSets: [...p.histSets, cards] };
              if (updated.histSets.length >= 5) setWinner(updated);
              return updated;
            }
            return p;
          });
          return { ...prev, players: newPlayers, deck: newDeck, log: [`${currentPlayer.name} formed a Hist Set!`, ...prev.log].slice(0, 20) };
        });
        setSelectedCards([]);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: "Verification failed." });
    }
  };

  const handleDiscardCard = () => {
    if (!currentPlayer || gameState?.turnPhase !== 'discard' || selectedCards.length !== 1) return;
    const card = selectedCards[0];
    setGameState(prev => {
      if (!prev) return null;
      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p);
      const newDiscard = [...prev.discardPile, card];
      const updatedPlayer = newPlayers.find(p => p.id === currentPlayer.id)!;
      
      const nextPhase = updatedPlayer.hand.length <= INITIAL_HAND_SIZE ? 'action' : 'discard';
      
      return { 
        ...prev, 
        players: newPlayers, 
        discardPile: newDiscard, 
        turnPhase: nextPhase, 
        log: [`${currentPlayer.name} discarded ${card.name}.`, ...prev.log].slice(0, 20) 
      };
    });
    setSelectedCards([]);
  };

  if (!gameState || !currentPlayer) return <div className="flex items-center justify-center min-h-screen font-headline text-primary">Loading history...</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-80 bg-card border-r hidden lg:flex flex-col p-4 space-y-4 shadow-xl">
        <h2 className="font-headline text-2xl text-primary flex items-center justify-between">
          Go Hist
          <Link href="/"><ChevronLeft className="w-6 h-6 hover:text-primary/70 transition-colors" /></Link>
        </h2>
        <Card className="shrink-0 bg-background/50">
          <CardHeader className="p-3"><CardTitle className="text-sm font-headline">Players</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0">
            <ul className="space-y-2">
              {gameState.players.map(p => (
                <li key={p.id} className={cn("text-xs flex justify-between items-center p-2 rounded-lg transition-colors", p.id === gameState.currentPlayerId ? "bg-primary text-primary-foreground font-bold" : "bg-muted/50")}>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{p.name}</span>
                  </div>
                  <Badge variant={p.id === gameState.currentPlayerId ? "secondary" : "outline"} className="font-mono">{p.histSets.length}/5</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="flex-1 min-h-0 bg-background/50">
          <CardHeader className="p-3"><CardTitle className="text-sm font-headline">Historical Log</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0 h-full overflow-hidden">
            <div className="overflow-y-auto h-full pr-2">
              <ul className="space-y-1">
                {gameState.log.map((m, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground border-l-2 border-primary/20 pl-2 py-1 bg-muted/20 rounded-r-sm">{m}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Tabs defaultValue="game" className="flex-1 flex flex-col">
          <div className="px-6 py-2 border-b bg-card/50 flex justify-center">
            <TabsList>
              <TabsTrigger value="game" className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" /> Game Board
              </TabsTrigger>
              <TabsTrigger value="reference" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Card Reference
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="game" className="flex-1 flex flex-col overflow-hidden p-0 m-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-72">
              <div className="flex justify-center items-center gap-12 py-6 bg-muted/10 rounded-2xl border-2 border-dashed border-primary/10">
                <div onClick={handleDrawFromDeck} className="cursor-pointer text-center group transition-transform hover:scale-105 active:scale-95">
                  <p className="text-[10px] mb-2 font-bold uppercase tracking-tighter text-muted-foreground">Draw Deck ({gameState.deck.length})</p>
                  <GameCard card="back" className="w-[100px] h-[150px] ring-primary/20 group-hover:ring-4 transition-all shadow-xl" />
                </div>
                <div onClick={handleDrawFromDiscard} className="cursor-pointer text-center group transition-transform hover:scale-105 active:scale-95">
                  <p className="text-[10px] mb-2 font-bold uppercase tracking-tighter text-muted-foreground">Discard Pile</p>
                  {gameState.discardPile.length > 0 ? (
                    <GameCard card={gameState.discardPile[gameState.discardPile.length - 1]} className="w-[100px] h-[150px] ring-primary/20 group-hover:ring-4 transition-all shadow-xl" />
                  ) : (
                    <div className="w-[100px] h-[150px] border-2 border-dashed rounded-lg bg-muted/20 flex items-center justify-center">
                      <Trash2 className="text-muted-foreground/30 w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {otherPlayers.map(p => (
                  <div key={p.id} className="relative p-4 border rounded-xl bg-card/30 backdrop-blur-sm shadow-sm">
                    <h3 className="text-xs font-bold mb-3 flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                      <User className="w-3 h-3" />
                      {p.name}'s Hand ({p.hand.length} cards)
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {p.hand.map((_, i) => (<GameCard key={i} card="back" className="w-[60px] h-[90px]" />))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reference" className="flex-1 overflow-y-auto p-6 m-0 bg-background/50">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 pb-24">
              {DECK.map(card => (
                <div key={card.id} className="flex flex-col items-center">
                   <GameCard card={card} className="w-full" />
                   <p className="text-[10px] mt-2 text-muted-foreground font-mono uppercase">{card.id}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="absolute bottom-0 left-0 right-0 bg-card/95 p-6 rounded-t-3xl border-t-2 border-primary/20 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] z-20 backdrop-blur-md">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <HistoryIcon className="w-5 h-5 text-primary" />
                    <h3 className="font-headline text-2xl text-primary">{currentPlayer.name}'s Hand</h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    {gameState.turnPhase === 'discard' 
                      ? '⚠️ Select 1 card to discard' 
                      : (selectedCards.length === 4 
                          ? '✨ Ready to declare set!' 
                          : 'Action phase: Draw, Ask, or Declare')}
                  </p>
              </div>
              
              <div className="flex gap-3 items-center">
                <AskForCard otherPlayers={otherPlayers} onAsk={handleAskForCard} disabled={hasTakenAction || gameState.turnPhase !== 'action'} />
                
                <Button 
                  size="lg" 
                  onClick={() => setShowHistSetDialog(true)} 
                  disabled={selectedCards.length !== 4 || gameState.turnPhase !== 'action'}
                  className={cn(
                    "transition-all duration-300",
                    selectedCards.length === 4 && gameState.turnPhase === 'action' ? "bg-primary animate-pulse scale-105" : "bg-muted"
                  )}
                >
                  <BookOpenCheck className="mr-2 w-5 h-5" /> Declare Set
                </Button>
                
                {gameState.turnPhase === 'discard' && (
                  <Button size="lg" variant="destructive" onClick={handleDiscardCard} disabled={selectedCards.length !== 1} className="shadow-lg">
                    <Trash2 className="mr-2 w-5 h-5" /> Discard
                  </Button>
                )}

                {hasTakenAction && gameState.turnPhase === 'action' && currentPlayer.hand.length <= INITIAL_HAND_SIZE && (
                  <Button size="lg" variant="secondary" onClick={endTurn} className="border-2 border-primary/20">
                    End Turn <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scroll-smooth scrollbar-hide min-h-[220px]">
              {currentPlayer.hand.map(c => (
                <GameCard 
                  key={c.id} 
                  card={c} 
                  isPlayerCard 
                  isSelected={!!selectedCards.find(sc => sc.id === c.id)} 
                  onSelect={handleSelectCard} 
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <AlertDialog open={!!winner}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>🏆 History Hero! {winner?.name} wins!</AlertDialogTitle><AlertDialogDescription>You successfully formed 5 historical sets first!</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogAction onClick={startNewGame}>Play Again</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={showHistSetDialog} onOpenChange={setShowHistSetDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Declare Historical Set</AlertDialogTitle></AlertDialogHeader><HistSetVerifier selectedCards={selectedCards} onVerified={(exp) => handleDeclareSet(selectedCards, exp)} /><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={showGoHistDialog} onOpenChange={setShowGoHistDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>GO HIST!</AlertDialogTitle><AlertDialogDescription>Your opponent doesn't have a matching card. You must draw from the deck.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogAction onClick={() => { setShowGoHistDialog(false); handleDrawFromDeck(); }}>Draw Card</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={!!verificationResult} onOpenChange={() => setVerificationResult(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{verificationResult?.isValid ? '✅ Set Accepted' : '❌ Set Rejected'}</AlertDialogTitle><AlertDialogDescription className="text-base mt-2">{verificationResult?.reason}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogAction onClick={() => setVerificationResult(null)}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

export default function GamePage() { return <Suspense fallback={<div>Loading...</div>}><GamePageContent /></Suspense>; }
