export interface Card {
  id: string;
  name: string;
  type: 'Person' | 'Event';
  description: string;
  imageUrl: string;
  hint: string;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  histSets: Card[][];
}

export interface GameState {
  players: Player[];
  deck: Card[];
  discardPile: Card[];
  currentPlayerId: string;
  turnPhase: 'action' | 'discard';
  log: string[];
}

    