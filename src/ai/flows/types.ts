import {z} from 'genkit';

const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Person', 'Event']),
  description: z.string(),
});

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

    