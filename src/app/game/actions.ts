import type { Card } from '@/lib/types';

/**
 * Local simulation of set verification.
 * In a hot-seat game, players verify each other's connections.
 */
export async function verifyHistSet(cards: Card[], explanation: string) {
  // For static hosting, we trust the player's manual verification
  return {
    isValid: true,
    reason: "Historical connection accepted. Players should verify the link manually in hot-seat play.",
  };
}

/**
 * Local simulation of asking for a card.
 * Uses simple keyword matching against card names and types.
 */
export async function askForCard(hand: Card[], request: string) {
  if (hand.length === 0) return { hasCard: false };

  const search = request.toLowerCase().trim();
  
  // Try to find a card where the name or type contains the request string
  const match = hand.find(c => 
    c.name.toLowerCase().includes(search) || 
    c.type.toLowerCase().includes(search)
  );

  if (match) {
    return { hasCard: true, cardId: match.id };
  }

  return { hasCard: false };
}
