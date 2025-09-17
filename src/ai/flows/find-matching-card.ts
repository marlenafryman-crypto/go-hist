'use server';

/**
 * @fileOverview An AI agent for finding a matching card in a player's hand based on a request.
 *
 * - findMatchingCard - A function that checks if any card in a hand matches a given request.
 */

import {ai} from '@/ai/genkit';
import {
  FindMatchingCardInputSchema,
  FindMatchingCardOutputSchema,
  type FindMatchingCardInput,
  type FindMatchingCardOutput,
} from './types';

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
