'use server';

/**
 * @fileOverview An AI agent for finding a matching card in a player's hand based on a request.
 *
 * - findMatchingCard - A function that checks if any card in a hand matches a given request.
 * - FindMatchingCardInput - The input type for the findMatchingCard function.
 * - FindMatchingCardOutput - The return type for the findMatchingCard function.
 */

import {ai} from '@/ai/genkit';
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

const FindMatchingCardOutputSchema = z.object({
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

export async function findMatchingCard(
  input: FindMatchingCardInput
): Promise<FindMatchingCardOutput> {
  return findMatchingCardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findMatchingCardPrompt',
  input: {schema: FindMatchingCardInputSchema},
  output: {schema: FindMatchingCardOutputSchema},
  prompt: `You are an arbiter in a historical card game. Your task is to determine if an opponent has a card that matches the current player's request.

  The player is requesting a card with this description:
  "{{{request}}}"

  Here are the cards in the opponent's hand:
  {{#each opponentHand}}
  - Card ID: {{{this.id}}}, Name: "{{{this.name}}}", Description: "{{{this.description}}}"
  {{/each}}

  Review the opponent's hand. If one of the cards is a reasonable match for the player's request, return the ID of that card and a brief justification. The match should be based on the card's name and description.

  If no card is a good match, return a reason explaining why none of the cards fit the request. Only return a card if it's a strong, direct match. Be strict.
  `,
});

const findMatchingCardFlow = ai.defineFlow(
  {
    name: 'findMatchingCardFlow',
    inputSchema: FindMatchingCardInputSchema,
    outputSchema: FindMatchingCardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
