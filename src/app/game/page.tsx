'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GameState, Player, Card as CardType } from '@/lib/types';
import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { HistSetVerifier } from '@/components/game/HistSetVerifier';
import { Users, BookOpenCheck, ChevronLeft, Trophy, Trash2, ArrowDownToLine, Sparkles, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AskForCard } from '@/components/game/AskForCard';
import { INITIAL_HAND_SIZE } from '@/lib/types';
import { askForCard, verifyHistSet } from './actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
      localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(gameState));
    }
  }, [gameState, isClient]);

  const updateGameState = useCallback((newState: GameState | null | ((prevState: GameState | null) => GameState | null)) => {
    setGameState(prevState => {
      const updated = typeof newState === 'function' ? newState(prevState) : newState;
      return updated;
    });
  }, []);

  const addToLog = useCallback((message: string) => {
    updateGameState(prev => {
      if (!prev) return null;
      return { ...prev, log: [message, ...prev.log].slice(0, 20) };
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

  const startNewGame = useCallback(() => {
    const numPlayers = parseInt(searchParams?.get('numPlayers') || '2', 10);
    const shuffledDeck = createShuffledDeck();
    const humanPlayers: Player[] = [];

    for (let i = 0; i < numPlayers; i++) {
      const playerName = searchParams?.get(`player${i + 1}`) || `Player ${i + 1}`;
      humanPlayers.push({ id: `player${i + 1}`, name: playerName, hand: [], histSets: [], isHuman: true });
    }

    for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
      for (const player of humanPlayers) {
        const card = shuffledDeck.pop();
        if (card) player.hand.push(card);
      }
    }

    const newGameState: GameState = {
      players: humanPlayers,
      deck: shuffledDeck,
      discardPile: [],
      currentPlayerId: humanPlayers[0].id,
      turnPhase: 'action',
      log: [`New game started. It is ${humanPlayers[0].name}'s turn.`],
    };

    setGameState(newGameState);
    setWinner(null);
    setSelectedCards([]);
    setHasTakenAction(false);
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
          const winningPlayer = savedGameState.players.find((p: Player) => p.histSets.length >= 5);
          if (winningPlayer) setWinner(winningPlayer);
        } else {
          startNewGame();
        }
      } catch (error) {
        startNewGame();
      }
    }
  }, [isClient, startNewGame, searchParams]);

  const endTurn = useCallback(() => {
    updateGameState(prev => {
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
  }, [updateGameState]);

  const handleSelectCard = useCallback((card: CardType) => {
    if (winner) return;
    setSelectedCards(prev => {
      const isSelected = prev.find(c => c.id === card.id);
      if (isSelected) return prev.filter(c => c.id !== card.id);
      if (turnPhase === 'action') return prev.length < 4 ? [...prev, card] : [...prev.slice(1), card];
      if (turnPhase === 'discard') return [card];
      return prev;
    });
  }, [winner, turnPhase]);

  const handleDrawFromDeck = () => {
    if (!gameState || !currentPlayer || turnPhase !== 'action' || hasTakenAction) return;
    updateGameState(prev => {
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
    if (!gameState || !currentPlayer || turnPhase !== 'action' || hasTakenAction || gameState.discardPile.length === 0) return;
    updateGameState(prev => {
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
        updateGameState(prev => {
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
    } catch (error) {
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
        updateGameState(prev => {
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
      } else {
        setHasTakenAction(true);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Verification failed." });
    }
  };

  const handleDiscardCard = () => {
    if (!currentPlayer || turnPhase !== 'discard' || selectedCards.length !== 1) return;
    const card = selectedCards[0];
    updateGameState(prev => {
      if (!prev) return null;
      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p);
      const newDiscard = [...prev.discardPile, card];
      const updatedPlayer = newPlayers.find(p => p.id === currentPlayer.id)!;
      if (updatedPlayer.hand.length <= INITIAL_HAND_SIZE) setTimeout(endTurn, 100);
      return { ...prev, players: newPlayers, discardPile: newDiscard, log: [`${currentPlayer.name} discarded ${card.name}.`, ...prev.log].slice(0, 20) };
    });
  };

  if (!gameState || !currentPlayer) return <div className="flex items-center justify-center min-h-screen font-headline">Loading history...</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-80 bg-card border-r hidden lg:flex flex-col p-4 space-y-4">
        <h2 className="font-headline text-2xl text-primary flex justify-between">Go Hist <Link href="/"><ChevronLeft /></Link></h2>
        <Card className="shrink-0"><CardHeader className="p-3"><CardTitle className="text-sm">Players</CardTitle></CardHeader><CardContent className="p-3 pt-0">
          <ul className="space-y-1">{players.map(p => (<li key={p.id} className={cn("text-xs flex justify-between", p.id === currentPlayerId && "font-bold text-primary")}><span>{p.name}</span><Badge variant="secondary">{p.histSets.length}</Badge></li>))}</ul>
        </CardContent></Card>
        <Card className="flex-1 min-h-0"><CardHeader className="p-3"><CardTitle className="text-sm">Log</CardTitle></CardHeader><CardContent className="p-3 pt-0 overflow-y-auto h-[300px]"><ul className="space-y-1">{log.map((m, i) => (<li key={i} className="text-[10px] text-muted-foreground">{m}</li>))}</ul></CardContent></Card>
      </aside>

      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-6">
          {otherPlayers.map(p => (
            <div key={p.id}>
              <h3 className="text-xs font-bold mb-2">{p.name}'s Hand ({p.hand.length})</h3>
              <div className="flex gap-1 overflow-x-auto pb-2">{p.hand.map((_, i) => (<GameCard key={i} card="back" />))}</div>
            </div>
          ))}
          <div className="flex justify-center gap-4">
            <div onClick={handleDrawFromDeck} className="cursor-pointer text-center"><p className="text-[10px] mb-1">Deck ({deck.length})</p><GameCard card="back" className="w-[80px] h-[120px]" /></div>
            <div onClick={handleDrawFromDiscard} className="cursor-pointer text-center"><p className="text-[10px] mb-1">Discard</p>{gameState.discardPile.length > 0 ? <GameCard card={gameState.discardPile[gameState.discardPile.length - 1]} className="w-[80px] h-[120px]" /> : <div className="w-[80px] h-[120px] border-2 border-dashed rounded-lg bg-muted/20" />}</div>
          </div>
        </div>

        <div className="bg-card/50 p-4 rounded-t-xl border-t shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-lg">{currentPlayer.name}'s Hand</h3>
            <div className="flex gap-2">
              {turnPhase === 'action' && selectedCards.length === 4 && <Button size="sm" onClick={() => setShowHistSetDialog(true)}><BookOpenCheck className="mr-1 w-4 h-4" /> Declare Set</Button>}
              {turnPhase === 'discard' && selectedCards.length === 1 && <Button size="sm" variant="destructive" onClick={handleDiscardCard}><Trash2 className="mr-1 w-4 h-4" /> Discard</Button>}
              {turnPhase === 'action' && hasTakenAction && currentPlayer.hand.length <= INITIAL_HAND_SIZE && <Button size="sm" variant="outline" onClick={endTurn}>End Turn</Button>}
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto p-2 min-h-[160px]">
            {currentPlayer.hand.map(c => (<GameCard key={c.id} card={c} isPlayerCard isSelected={!!selectedCards.find(sc => sc.id === c.id)} onSelect={handleSelectCard} />))}
          </div>
          {turnPhase === 'action' && !hasTakenAction && (
            <div className="border-t pt-4">
              <AskForCard otherPlayers={otherPlayers} onAsk={handleAskForCard} />
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={!!winner}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Trophy! {winner?.name} wins!</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogAction onClick={startNewGame}>New Game</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={showHistSetDialog} onOpenChange={setShowHistSetDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Declare Historical Set</AlertDialogTitle></AlertDialogHeader><HistSetVerifier selectedCards={selectedCards} onVerified={(exp) => handleDeclareSet(selectedCards, exp)} /><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={showGoHistDialog} onOpenChange={setShowGoHistDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>GO HIST!</AlertDialogTitle><AlertDialogDescription>They don't have it. Draw a card to continue.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogAction onClick={() => { setShowGoHistDialog(false); handleDrawFromDeck(); }}>Draw</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={!!verificationResult} onOpenChange={() => setVerificationResult(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{verificationResult?.isValid ? 'Set Accepted' : 'Set Rejected'}</AlertDialogTitle><AlertDialogDescription>{verificationResult?.reason}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogAction onClick={() => setVerificationResult(null)}>OK</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

export default function GamePage() { return <Suspense fallback={<div>Loading...</div>}><GamePageContent /></Suspense>; }
