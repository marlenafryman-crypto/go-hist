
'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GameState, Player, Card as CardType } from '@/lib/types';
import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ConnectionVerifier } from '@/components/game/ConnectionVerifier';
import { AskForCard } from '@/components/game/AskForCard';
import { HistSetVerifier } from '@/components/game/HistSetVerifier';
import { Users, Swords, BookOpenCheck, ChevronLeft, Trophy, Scale, Trash2, ArrowDownToLine, GitCommitHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { findMatchingCardAction, getAiPlayerActionAction, verifyHistSetAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { INITIAL_HAND_SIZE } from '@/lib/types';

function shuffle(array: any[]) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const WINNING_SET_COUNT = 2;
const AI_NAMES = ['Ada Lovelace', 'Nikola Tesla', 'Marie Curie', 'Isaac Newton', 'Galileo Galilei'];

function GamePageContent() {
  const searchParams = useSearchParams();
  const [gameCode, setGameCode] = useState<string | null>(null);
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showHistSetDialog, setShowHistSetDialog] = useState(false);

  useEffect(() => {
    if (searchParams) {
      const code = searchParams.get('code');
      if (code) {
        setGameCode(code);
      } else {
        // If no code, generate one for local storage key
        setGameCode(`local-${Math.random().toString(36).substring(2, 8)}`);
      }
    }
  }, [searchParams]);

  const updateGameState = useCallback((newState: GameState | null) => {
    setGameState(newState);
    if (gameCode && typeof window !== 'undefined') {
      if (newState) {
        window.localStorage.setItem(`game-${gameCode}`, JSON.stringify(newState));
      } else {
        window.localStorage.removeItem(`game-${gameCode}`);
      }
    }
  }, [gameCode]);

   const addToLog = useCallback((message: string) => {
    setGameState(prev => {
      if (!prev) return null;
      const newLog = [message, ...prev.log].slice(0, 20);
      const newState = { ...prev, log: newLog };
      return newState;
    });
  }, []);

  const currentPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players.find(p => p.id === gameState.currentPlayerId);
  }, [gameState]);

  const otherPlayers = useMemo(() => {
    if (!gameState || !currentPlayer) return [];
    return gameState.players.filter(p => p.id !== currentPlayer.id);
  }, [gameState, currentPlayer]);
  
  const humanPlayerIds = useMemo(() => {
    if (!gameState) return [];
    return gameState.players.filter(p => p.isHuman).map(p => p.id);
  }, [gameState]);


  const startNewGame = useCallback(() => {
    if (!searchParams || !gameCode) return;
    
    const numPlayers = parseInt(searchParams.get('numPlayers') || '1', 10);
    const numAi = parseInt(searchParams.get('numAi') || '1', 10);
    
    const humanPlayers: Player[] = [];
    for (let i = 0; i < numPlayers; i++) {
        const playerName = searchParams.get(`player${i+1}`) || `Player ${i+1}`;
        humanPlayers.push({ id: `player${i+1}`, name: playerName, hand: [], histSets: [], isHuman: true });
    }

    const aiPlayers: Player[] = [];
    const shuffledAiNames = shuffle(AI_NAMES);
    for (let i = 0; i < numAi; i++) {
        aiPlayers.push({ id: `ai${i+1}`, name: shuffledAiNames[i], hand: [], histSets: [], isHuman: false });
    }

    const players = shuffle([...humanPlayers, ...aiPlayers]);

    const shuffledDeck = shuffle(DECK);
    
    for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
      for (const player of players) {
        const card = shuffledDeck.pop();
        if (card) player.hand.push(card);
      }
    }

    const firstPlayer = players[0];

    const newGameState = {
      players,
      deck: shuffledDeck,
      discardPile: [shuffledDeck.pop()!],
      currentPlayerId: firstPlayer.id,
      turnPhase: 'action' as 'action' | 'discard',
      log: [`New game started with ${numPlayers} human(s) and ${numAi} AI(s).`],
    };
    
    updateGameState(newGameState);
    setWinner(null);
    setSelectedCards([]);
  }, [searchParams, updateGameState, gameCode]);

  useEffect(() => {
    if (!gameCode || typeof window === 'undefined') return;

    const savedGame = window.localStorage.getItem(`game-${gameCode}`);
    if (savedGame && savedGame !== 'undefined' && savedGame !== 'null') {
      try {
        const savedGameState = JSON.parse(savedGame);
        if (savedGameState) {
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
    } else if (searchParams.get('numPlayers')) {
      startNewGame();
    }
  }, [gameCode, startNewGame, searchParams]);

  const handleSelectCard = (card: CardType) => {
    if (winner) return;
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
    if (!gameState || !currentPlayer || gameState.turnPhase !== 'action' || winner) return;

    setGameState(prev => {
      if (!prev || !currentPlayer) return prev;

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop();
      if (!drawnCard) {
        addToLog('Deck is empty!');
        return prev;
      }
      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);
      
      addToLog(`${currentPlayer.name} drew "${drawnCard.name}" from the deck.`);
      return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
    });
  };

  const handleDrawFromDiscard = () => {
    if (!gameState || !currentPlayer || gameState.turnPhase !== 'action' || winner) return;
    
    setGameState(prev => {
      if (!prev || !currentPlayer) return prev;
      const newDiscardPile = [...prev.discardPile];
      const drawnCard = newDiscardPile.pop();

      if (!drawnCard) {
        return prev;
      }

      const newPlayers = prev.players.map(p => p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p);

      addToLog(`${currentPlayer.name} took "${drawnCard.name}" from the discard pile.`);
      return { ...prev, players: newPlayers, discardPile: newDiscardPile, turnPhase: 'discard' };
    });
  };

  const handleAskForCard = async (opponentId: string, request: string) => {
    if (!gameState || !currentPlayer || winner) return;
    
    const opponent = gameState.players.find(p => p.id === opponentId);
    if (!opponent) return;

    addToLog(`${currentPlayer.name} asks ${opponent.name}: "${request}"`);

    const opponentHandForAI = opponent.hand.map(({ id, name, type, description }) => ({ id, name, type, description, imageUrl: '', hint: '' }));
    const result = await findMatchingCardAction({ request, opponentHand: opponentHandForAI });

    const askedCard = opponent.hand.find(c => c.id === result.cardId);

    if (askedCard) {
      addToLog(`${opponent.name} had "${askedCard.name}"! ${currentPlayer.name} takes it and goes again. Reason: ${result.reason}`);
      
      setGameState(prev => {
        if (!prev) return null;
        const newOpponentHand = opponent.hand.filter(c => c.id !== askedCard.id);
        const newPlayerHand = [...currentPlayer.hand, askedCard];
        
        const newPlayers = prev.players.map(p => {
          if (p.id === opponentId) return { ...p, hand: newOpponentHand };
          if (p.id === currentPlayer.id) return { ...p, hand: newPlayerHand };
          return p;
        });
        
        return { ...prev, players: newPlayers, turnPhase: 'action' };
      });
      // After a successful ask, player has another action. Does not go to discard.
      // And we don't need to re-trigger AI turn here as it's the same player's turn
    } else {
      addToLog(`Go Hist! ${opponent.name} did not have a matching card. ${currentPlayer.name} must draw.`);
      
      setGameState(prev => {
        if (!prev || !currentPlayer) return null;
        
        const newDeck = [...prev.deck];
        const drawnCard = newDeck.pop();
        let newPlayers = [...prev.players];
        const newLog = [...prev.log];
        
        if (drawnCard) {
          newLog.unshift(`${currentPlayer.name} drew "${drawnCard.name}".`);
          newPlayers = prev.players.map(p => {
            if (p.id === currentPlayer.id) {
              return { ...p, hand: [...p.hand, drawnCard] };
            }
            return p;
          });
        } else {
          newLog.unshift(`Deck is empty!`);
        }
        
        const currentPlayerIndex = newPlayers.findIndex(p => p.id === prev.currentPlayerId);
        const nextPlayerIndex = (currentPlayerIndex + 1) % newPlayers.length;
        const nextPlayer = newPlayers[nextPlayerIndex];
        
        newLog.unshift(`It is now ${nextPlayer.name}'s turn.`);
        
        setSelectedCards([]);

        return { ...prev, players: newPlayers, deck: newDeck, log: newLog.slice(0, 20), currentPlayerId: nextPlayer.id, turnPhase: 'action' };
      });
    }
  };
  
  const handleFormHistSet = (cardsToSet: CardType[], explanation?: string) => {
    if (!currentPlayer || !gameState || winner) return;

    if (explanation) {
      addToLog(`${currentPlayer.name} declares a Hist Set with the explanation: "${explanation}"`);
    }

    setShowHistSetDialog(false);
    
    setGameState(prev => {
      if(!prev || !currentPlayer) return prev;

      let winningPlayer: Player | null = null;
      const newDeck = [...prev.deck];
      let newHand = [...(currentPlayer.hand || [])];
      newHand = newHand.filter(c => !cardsToSet.find(sc => sc.id === c.id));
      
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

      addToLog(`${currentPlayer.name} successfully formed a Hist Set! They draw 4 cards.`);
      setSelectedCards([]);
      return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
    });
  };

  const handleDiscardCard = (cardToDiscard?: CardType) => {
    if (!currentPlayer || !gameState || gameState.turnPhase !== 'discard' || winner) return;
    
    const card = cardToDiscard || selectedCards[0];
    if (!card && (!cardToDiscard && selectedCards.length === 0)) return;

    setGameState(prev => {
        if (!prev || !currentPlayer) return null;

        let newPlayers = prev.players;
        let newDiscardPile = prev.discardPile;
        let logMessage = '';

        if(card) {
          newPlayers = prev.players.map(p => {
              if (p.id === currentPlayer.id) {
                  return { ...p, hand: p.hand.filter(c => c.id !== card.id) };
              }
              return p;
          });
          newDiscardPile = [...prev.discardPile, card];
          logMessage = `${currentPlayer.name} discarded "${card.name}".`;
        }

        const currentPlayerIndex = newPlayers.findIndex(p => p.id === prev.currentPlayerId);
        const nextPlayerIndex = (currentPlayerIndex + 1) % newPlayers.length;
        const nextPlayer = newPlayers[nextPlayerIndex];
        
        const newLog = [`It is now ${nextPlayer.name}'s turn.`, logMessage, ...prev.log].filter(Boolean).slice(0, 20);
        
        setSelectedCards([]);

        return {
            ...prev,
            players: newPlayers,
            discardPile: newDiscardPile,
            log: newLog,
            currentPlayerId: nextPlayer.id,
            turnPhase: 'action',
        };
    });
  };

  const handleAiTurn = useCallback(async () => {
    if (!gameState || !currentPlayer || currentPlayer.isHuman || winner) {
      return;
    }
  
    addToLog(`${currentPlayer.name} is thinking...`);
  
    const otherPlayersInfo = gameState.players
      .filter(p => p.id !== currentPlayer.id)
      .map(p => ({
        id: p.id,
        name: p.name,
        handSize: p.hand.length,
        histSetCount: p.histSets.length,
      }));
  
    const discardTopCard = gameState.discardPile.length > 0 ? gameState.discardPile[gameState.discardPile.length - 1] : undefined;
    const canWin = currentPlayer.histSets.length + 1 >= WINNING_SET_COUNT;
  
    const aiAction = await getAiPlayerActionAction({
      playerName: currentPlayer.name,
      hand: currentPlayer.hand,
      histSetCount: currentPlayer.histSets.length,
      otherPlayers: otherPlayersInfo,
      discardTopCard,
      canWin,
    });
  
    await new Promise(resolve => setTimeout(resolve, 1000)); // Dramatic pause
  
    switch (aiAction.action) {
      case 'formSet':
        if (aiAction.cardIds && aiAction.explanation) {
          const cardsToSet = currentPlayer.hand.filter(c => aiAction.cardIds!.includes(c.id));
          if (cardsToSet.length === 4) {
            const verification = await verifyHistSetAction({ cards: cardsToSet, explanation: aiAction.explanation });
            if (verification.isValid) {
              handleFormHistSet(cardsToSet, aiAction.explanation);
            } else {
              addToLog(`${currentPlayer.name} tried to form a set, but the historian deemed it invalid: ${verification.reason}. Drawing instead.`);
              handleDrawFromDeck(); 
            }
          } else {
             handleDrawFromDeck();
          }
        }
        break;
      case 'ask':
        if (aiAction.opponentId && aiAction.request) {
          await handleAskForCard(aiAction.opponentId, aiAction.request);
        } else {
           handleDrawFromDeck();
        }
        break;
      case 'drawDeck':
        addToLog(`${currentPlayer.name} decides to draw from the deck.`);
        handleDrawFromDeck();
        break;
      case 'drawDiscard':
         if (discardTopCard) {
            addToLog(`${currentPlayer.name} decides to take "${discardTopCard.name}" from the discard pile.`);
            handleDrawFromDiscard();
        } else {
            handleDrawFromDeck();
        }
        break;
    }

  }, [gameState, currentPlayer, winner, addToLog]);


  useEffect(() => {
    if (gameState && currentPlayer && !currentPlayer.isHuman && gameState.turnPhase === 'action' && !winner) {
        handleAiTurn();
    }
  }, [gameState, currentPlayer, winner, handleAiTurn]);

  // AI Discard Logic
  useEffect(() => {
    if(gameState && currentPlayer && !currentPlayer.isHuman && gameState.turnPhase === 'discard' && !winner) {
       setTimeout(() => {
        setGameState(currentState => {
            if (!currentState) return null;
            const currentAiPlayer = currentState.players.find(p => p.id === currentState.currentPlayerId);
            if (currentAiPlayer && !currentAiPlayer.isHuman && currentState.turnPhase === 'discard') {
                if (currentAiPlayer.hand.length > 0) {
                   // A slightly smarter discard: discard the last card drawn if it doesn't help form a set
                   const cardToDiscard = currentAiPlayer.hand[currentAiPlayer.hand.length - 1];
                   handleDiscardCard(cardToDiscard);
                } else {
                    // If hand is empty, just end turn by discarding nothing
                    handleDiscardCard(undefined);
                }
            }
            return currentState;
        });
    }, 2000); // Wait a bit before discarding
    }
  }, [gameState, currentPlayer, winner]);


  if (!gameState || !currentPlayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="font-headline text-2xl mb-4">Welcome to Go Hist!</p>
        <p className="text-muted-foreground mb-4">No active game found for this code.</p>
        <Link href="/">
            <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  const topOfDiscard = gameState.discardPile.length > 0 ? gameState.discardPile[gameState.discardPile.length - 1] : null;


  const renderTurnSpecificControls = () => {
    const isPlayerTurn = currentPlayer.isHuman;
    if (!isPlayerTurn) return <p className="text-sm text-primary font-headline animate-pulse">Waiting for other players...</p>;

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
            <Button onClick={() => handleDiscardCard()} disabled={selectedCards.length !== 1}>
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
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users /> Players</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {gameState.players.map(p => (
                  <li key={p.id} className="flex justify-between items-center text-sm">
                    <span className={p.id === currentPlayer.id ? 'font-bold text-primary' : ''}>
                      {p.name} {humanPlayerIds.includes(p.id) ? `(P${humanPlayerIds.indexOf(p.id) + 1})` : '(AI)'}
                    </span>
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
                  disabled={gameState.turnPhase !== 'action' || !currentPlayer.isHuman || !!winner}
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
        <main className="flex-1 flex flex-col p-6">
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
                        <div onClick={handleDrawFromDiscard} className={gameState.turnPhase === 'action' && currentPlayer.isHuman && !winner ? "cursor-pointer" : "cursor-not-allowed"}>
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
            onVerified={(explanation: string) => handleFormHistSet(selectedCards, explanation)}
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
