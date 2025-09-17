export const INITIAL_HAND_SIZE = 7;

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
  isHuman: boolean;
}

export interface GameState {
  players: Player[];
  deck: Card[];
  discardPile: Card[];
  currentPlayerId: string;
  turnPhase: 'action' | 'discard';
  log: string[];
}
