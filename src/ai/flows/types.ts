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
    reason: z.string().describe('The reasoning behind the validity determination.'),
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
  reason: z.string().describe('The reasoning behind the validity determination.'),
});
export type VerifyHistoricalConnectionOutput = z.infer<typeof VerifyHistoricalConnectionOutputSchema>;
