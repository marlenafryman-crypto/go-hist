'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GameState, Player, Card as CardType } from '@/lib/types';
import { DECK } from '@/lib/mock-data';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SuggestionProvider } from '@/components/game/SuggestionProvider';
import { AskForCard } from '@/components/game/AskForCard';
import { HistSetVerifier } from '@/components/game/HistSetVerifier';
import { Users, BookOpenCheck, ChevronLeft, Trophy, Trash2, ArrowDownToLine, HelpCircle, Lightbulb } from 'lucide-react';
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
const LOCAL_GAME_KEY = 'go-hist-local-game';

function GamePageContent() {
  const searchParams = useSearchParams();
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showHistSetDialog, setShowHistSetDialog] = useState(false);
  const [showAskDialog, setShowAskDialog] = useState(false);
  const [showGoHistDialog, setShowGoHistDialog] = useState(false);
  const [hasTakenAction, setHasTakenAction] = useState(false);


  const players = useMemo(() => gameState?.players || [], [gameState?.players]);
  const currentPlayerId = useMemo(() => gameState?.currentPlayerId, [gameState?.currentPlayerId]);
  const turnPhase = useMemo(() => gameState?.turnPhase, [gameState?.turnPhase]);
  const log = useMemo(() => gameState?.log || [], [gameState?.log]);
  const deck = useMemo(() => gameState?.deck || [], [gameState?.deck]);

  const updateGameState = useCallback((newState: GameState | null) => {
    setGameState(newState);
    if (typeof window !== 'undefined') {
      if (newState) {
        window.localStorage.setItem(LOCAL_GAME_KEY, JSON.stringify(newState));
      } else {
        window.localStorage.removeItem(LOCAL_GAME_KEY);
      }
    }
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
  
  const humanPlayerIds = useMemo(() => {
    if (!players) return [];
    return players.filter(p => p.isHuman).map(p => p.id);
  }, [players]);


  const startNewGame = useCallback(() => {
    if (!searchParams) return;
    
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
    setHasTakenAction(false);
  }, [searchParams, updateGameState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
  }, [startNewGame, searchParams]);

  const handleSelectCard = (card: CardType) => {
    if (winner) return;
    setSelectedCards(prev => {
      const isSelected = prev.find(c => c.id === card.id);
      if (isSelected) {
        // If the card is already selected, unselect it and any others
        return [];
      }
      
      if (turnPhase === 'action') {
        // In action phase, allow up to 4 cards to be selected for forming a set,
        // but the suggestion provider will only use the first one.
        if (prev.length < 4) {
            return [...prev, card];
        } else {
            // If 4 are already selected, replace the selection with the new card
            return [card];
        }
      }
      if (turnPhase === 'discard') {
        // In discard phase, only one card can be selected
        return [card];
      }
      return prev;
    });
  };
  
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
      return { ...prev, players: newPlayers, discardPile: newDiscardPile };
    });
  };

  const handleAskForCard = async (opponentId: string, request: string) => {
    if (!gameState || !currentPlayer || winner || hasTakenAction) return;

    setShowAskDialog(false);
    const opponent = gameState.players.find(p => p.id === opponentId);
    if (!opponent) return;

    addToLog(`${currentPlayer.name} asks ${opponent.name}: "${request}"`);

    const opponentHandForAI = opponent.hand.map(({ id, name, type, description }) => ({ id, name, type, description, imageUrl: '', hint: '' }));
    const result = await findMatchingCardAction({ request, opponentHand: opponentHandForAI });
    const askedCard = opponent.hand.find(c => c.id === result.cardId);

    if (askedCard) {
      addToLog(`${opponent.name} had "${askedCard.name}"! ${currentPlayer.name} takes it and gets to take another action.`);
      
      const cardToTransfer = askedCard;

      updateGameState(prev => {
        if (!prev) return null;
        let newPlayers = [...prev.players];

        const opponentIndex = newPlayers.findIndex(p => p.id === opponentId);
        const playerIndex = newPlayers.findIndex(p => p.id === currentPlayer!.id);

        if(opponentIndex === -1 || playerIndex === -1) return prev;

        const newOpponentHand = newPlayers[opponentIndex].hand.filter(c => c.id !== cardToTransfer.id);
        const newPlayerHand = [...newPlayers[playerIndex].hand, cardToTransfer];
        
        newPlayers[opponentIndex] = {...newPlayers[opponentIndex], hand: newOpponentHand };
        newPlayers[playerIndex] = {...newPlayers[playerIndex], hand: newPlayerHand };
        
        // Player gets another action, so hasTakenAction is NOT set to true
        return { ...prev, players: newPlayers, turnPhase: 'action' };
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
        return { ...prev, players: newPlayers, deck: newDeck };
      });
  }
  
  const handleFormHistSet = (cardsToSet: CardType[], explanation?: string) => {
    if (!currentPlayer || !gameState || winner) return;

    if (explanation) {
      addToLog(`${currentPlayer.name} declares a Hist Set with the explanation: "${explanation}"`);
    }

    setShowHistSetDialog(false);
    
    updateGameState(prev => {
      if(!prev || !currentPlayer) return prev;

      let winningPlayer: Player | null = null;
      const newDeck = [...prev.deck];
      let newHand = [...(currentPlayer.hand || [])];
      newHand = newHand.filter(c => !cardsToSet.find(sc => sc.id === c.id));
      
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
      
      const updatedCurrentPlayer = newPlayers.find(p => p.id === currentPlayer.id);
      
      if (updatedCurrentPlayer && updatedCurrentPlayer.hand.length > INITIAL_HAND_SIZE) {
        return { ...prev, players: newPlayers, deck: newDeck, turnPhase: 'discard' };
      }

      endTurn();
      return { ...prev, players: newPlayers, deck: newDeck };
    });
  };

  const handleDiscardCard = (cardToDiscard?: CardType) => {
    if (!currentPlayer || !gameState || turnPhase !== 'discard' || winner) return;
    
    let card = cardToDiscard;

    if (currentPlayer.isHuman) {
      card = selectedCards[0];
    } 
    else if (!card) {
      if (currentPlayer.hand.length > INITIAL_HAND_SIZE) {
          card = currentPlayer.hand[currentPlayer.hand.length - 1];
      }
    }
    
    if (!card) {
      if (currentPlayer.hand.length <= INITIAL_HAND_SIZE) {
           endTurn();
           return;
      }
      if (currentPlayer.isHuman) {
        addToLog("You must select a card to discard.");
        return;
      }
    }

    updateGameState(prev => {
        if (!prev || !currentPlayer) return null;

        let newPlayers = prev.players;
        let newDiscardPile = prev.discardPile;
        let logMessage = '';

        const finalCardToDiscard = card;
        if(finalCardToDiscard) {
          newPlayers = prev.players.map(p => {
              if (p.id === currentPlayer.id) {
                  return { ...p, hand: p.hand.filter(c => c.id !== finalCardToDiscard.id) };
              }
              return p;
          });
          newDiscardPile = [...prev.discardPile, finalCardToDiscard];
          logMessage = `${currentPlayer.name} discarded "${finalCardToDiscard.name}".`;
          addToLog(logMessage);
        }

        const updatedCurrentPlayer = newPlayers.find(p => p.id === currentPlayer.id);
        if (updatedCurrentPlayer && updatedCurrentPlayer.hand.length > INITIAL_HAND_SIZE) {
            setSelectedCards([]);
            // Still needs to discard, stay in discard phase
            return {
                ...prev,
                players: newPlayers,
                discardPile: newDiscardPile,
                turnPhase: 'discard',
            };
        }
        
        endTurn();
        return { ...prev, players: newPlayers, discardPile: newDiscardPile };
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
  
    await new Promise(resolve => setTimeout(resolve, 1000));
  
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
        } else {
           handleDrawFromDeck();
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

  }, [gameState, currentPlayer, winner, addToLog, handleAskForCard, handleDrawFromDeck, handleDrawFromDiscard, handleFormHistSet]);

  useEffect(() => {
    if (currentPlayer && !currentPlayer.isHuman && turnPhase === 'action' && !hasTakenAction && !winner) {
        const timer = setTimeout(() => handleAiTurn(), 2000);
        return () => clearTimeout(timer);
    }
  }, [currentPlayer?.id, turnPhase, winner, handleAiTurn, hasTakenAction]);
  
  useEffect(() => {
     if (currentPlayer && !currentPlayer.isHuman && turnPhase === 'discard' && !winner) {
       setTimeout(() => {
        handleDiscardCard();
      }, 2000);
    }
  }, [currentPlayer?.id, turnPhase, winner, handleDiscardCard]);

  useEffect(() => {
    if (currentPlayer && hasTakenAction && turnPhase === 'action' && !winner) {
      if (currentPlayer.hand.length > INITIAL_HAND_SIZE) {
        if (!currentPlayer.isHuman) {
          handleDiscardCard();
        } else {
          updateGameState(prev => prev ? {...prev, turnPhase: 'discard'} : null);
        }
      } else {
        if (!currentPlayer.isHuman) {
          endTurn();
        }
      }
    }
  }, [currentPlayer, hasTakenAction, turnPhase, updateGameState, endTurn, winner, handleDiscardCard]);


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

  const renderTurnSpecificControls = () => {
    const isPlayerTurn = currentPlayer.isHuman;
    if (!isPlayerTurn || winner) return <p className="text-sm text-primary font-headline animate-pulse">Waiting for {currentPlayer.name}...</p>;

    switch (turnPhase) {
      case 'action':
         return (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAskDialog(true)} disabled={hasTakenAction}>
                  <HelpCircle className="mr-2"/> Ask Player
              </Button>
              <Button variant="outline" size="sm" onClick={handleDrawFromDeck} disabled={deck.length === 0 || hasTakenAction}>
                <ArrowDownToLine className="mr-2"/> Draw Deck
              </Button>
              <Button variant="outline" size="sm" onClick={handleDrawFromDiscard} disabled={!topOfDiscard || hasTakenAction}>
                <Trash2 className="mr-2"/> Take Discard
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowHistSetDialog(true)} disabled={selectedCards.length !== 4}>
                  <BookOpenCheck className="w-4 h-4 mr-2" />
                  Declare Set
              </Button>
              { (hasTakenAction && currentPlayer.hand.length <= INITIAL_HAND_SIZE) &&
                <Button variant="secondary" size="sm" onClick={endTurn}>
                    End Turn
                </Button>
              }
              { (hasTakenAction && currentPlayer.hand.length > INITIAL_HAND_SIZE) &&
                <Button variant="destructive" size="sm" onClick={() => updateGameState(prev => prev ? {...prev, turnPhase: 'discard'} : null)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Go to Discard
                </Button>
              }
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
                      {p.name} {p.isHuman ? `(You)` : '(AI)'}
                    </span>
                    <Badge variant="secondary">{p.histSets.length} Sets</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
           <Accordion type="single" collapsible className="w-full" defaultValue="item-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline text-xl">Game Log</AccordionTrigger>
              <AccordionContent className="pt-4">
                <ScrollArea className="h-48 w-full rounded-md border p-2">
                  <ul className="space-y-1">
                    {log.map((entry, i) => (
                      <li key={i} className="text-xs text-muted-foreground">{entry}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline text-xl flex items-center gap-2"><Lightbulb /> Consult the Historian</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <SuggestionProvider selectedCards={selectedCards} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        <main className="flex-1 flex flex-col p-6">
          <div className="flex-1 overflow-y-auto space-y-8">
            {otherPlayers.map(player => (
              <div key={player.id}>
                <h3 className="font-headline text-lg mb-2">{player.name}'s Hand ({player.hand.length})</h3>
                <div className="flex items-end gap-2 p-2 bg-muted/20 rounded-lg min-h-[120px]">
                  {!player.isHuman ? (
                      player.hand.map((_, index) => (
                        <GameCard
                          key={`${player.id}-${index}`}
                          card="back"
                          isPlayerCard={false}
                        />
                      ))
                  ) : (
                      player.hand.map(card => (
                        <GameCard
                          key={card.id}
                          card={card}
                          isPlayerCard={false}
                        />
                      ))
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end justify-center space-x-8 my-8">
              <div>
                  <p className="text-center font-headline mb-2">Deck</p>
                  <GameCard card="back" className="w-[120px] h-[180px]" />
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
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground font-headline">Turn: <span className="text-primary font-bold">{turnPhase.toUpperCase()}</span></p>
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
      <AlertDialog open={showAskDialog} onOpenChange={setShowAskDialog}>
          <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-headline text-2xl">Ask for a Card</AlertDialogTitle>
                <AlertDialogDescription>
                    Ask another player for a card you need to complete a set.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AskForCard
                  otherPlayers={otherPlayers}
                  onAsk={handleAskForCard}
                  disabled={!currentPlayer.isHuman || !!winner || hasTakenAction}
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
