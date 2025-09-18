import {z} from 'genkit';

const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Person', 'Event']),
  description: z.string(),
});
export type Card = z.infer<typeof CardSchema>;

export const FindMatchingCardInputSchema = z.object({
  request: z
    .string()
    .describe('The textual request for a card from the current player.'),
  opponentHand: z
    .array(CardSchema)
    .describe("An array of card objects in the opponent's hand."),
});
export type FindMatchingCardInput = z.infer<typeof FindMatchingCardInputSchema>;

export const FindMatchingCardOutputSchema = z.object({
  cardId: z
    .string()
    .optional()
    .describe(
      "The ID of the card in the opponent's hand that matches the request. If no card matches, this will be undefined."
    ),
  reason: z
    .string()
    .describe(
      'A brief explanation of why the card matches the request, or why no card matches.'
    ),
});
export type FindMatchingCardOutput = z.infer<
  typeof FindMatchingCardOutputSchema
>;

export const VerifyHistSetInputSchema = z.object({
    cards: z.array(CardSchema).length(4).describe('The four cards being checked for a valid Hist Set.'),
    explanation: z.string().describe('The player\'s explanation of the historical connection between the four cards.'),
});
export type VerifyHistSetInput = z.infer<typeof VerifyHistSetInputSchema>;

export const VerifyHistSetOutputSchema = z.object({
    isValid: z.boolean().describe('Whether the historical connection explanation is valid and follows the rules.'),
    reason: z.string().describe('The reasoning behind the validity determination. If the set is valid, confirm it. If invalid, explain why (e.g., connection too weak, no Person card).'),
});
export type VerifyHistSetOutput = z.infer<typeof VerifyHistSetOutputSchema>;

export const VerifyHistoricalConnectionInputSchema = z.object({
  card1Name: z.string().describe('The name of the first card.'),
  card2Name: z.string().describe('The name of the second card.'),
  explanation: z.string().describe('The explanation of the historical connection between the two cards.'),
});
export type VerifyHistoricalConnectionInput = z.infer<typeof VerifyHistoricalConnectionInputSchema>;

export const VerifyHistoricalConnectionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the historical connection explanation is valid.'),
  reason: z.string().describe('The reasoning behind the validity determination. If the connection is valid, this should be a brief confirmation. If it is invalid, this should explain why.'),
});
export type VerifyHistoricalConnectionOutput = z.infer<typeof VerifyHistoricalConnectionOutputSchema>;


const AiPlayerInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  handSize: z.number(),
  histSetCount: z.number(),
});

export const GetAiPlayerActionInputSchema = z.object({
  playerName: z.string().describe("The AI player's name."),
  hand: z.array(CardSchema).describe("The AI player's current hand."),
  histSetCount: z.number().describe('The number of Hist Sets the AI player has already formed.'),
  otherPlayers: z.array(AiPlayerInfoSchema).describe('Information about the other players in the game.'),
  discardTopCard: CardSchema.optional().describe('The card currently on top of the discard pile, if any.'),
  canWin: z.boolean().describe('Whether forming one more set will win the game.'),
});
export type GetAiPlayerActionInput = z.infer<typeof GetAiPlayerActionInputSchema>;


export const GetAiPlayerActionOutputSchema = z.object({
  action: z.enum(['formSet', 'ask', 'drawDeck', 'drawDiscard']).describe('The action the AI has decided to take.'),
  cardIds: z.array(z.string()).optional().describe("The IDs of the cards to form a set with. Only present if action is 'formSet'."),
  explanation: z.string().optional().describe("The explanation for the Hist Set. Only present if action is 'formSet'."),
  opponentId: z.string().optional().describe("The ID of the opponent to ask for a card. Only present if action is 'ask'."),
  request: z.string().optional().describe("The card being requested from the opponent. Only present if action is 'ask'."),
});
export type GetAiPlayerActionOutput = z.infer<typeof GetAiPlayerActionOutputSchema>;
