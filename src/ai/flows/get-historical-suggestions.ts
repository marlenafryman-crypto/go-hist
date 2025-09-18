'use server';

/**
 * @fileOverview An AI agent that suggests historically connected cards.
 *
 * - getHistoricalSuggestions - A function that returns suggestions of historically connected cards.
 * - GetHistoricalSuggestionsInput - The input type for the getHistoricalSuggestions function.
 * - GetHistoricalSuggestionsOutput - The return type for the getHistoricalSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetHistoricalSuggestionsInputSchema = z.object({
  cardDescription: z.string().describe('The description of the card in the player\'s hand.'),
});
export type GetHistoricalSuggestionsInput = z.infer<
  typeof GetHistoricalSuggestionsInputSchema
>;

const GetHistoricalSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of 3-5 brief ideas for cards (people, events, or concepts) that have a close historical connection to the card in the player\'s hand. These are just ideas to help the player.'
    ),
});
export type GetHistoricalSuggestionsOutput = z.infer<
  typeof GetHistoricalSuggestionsOutputSchema
>;

export async function getHistoricalSuggestions(
  input: GetHistoricalSuggestionsInput
): Promise<GetHistoricalSuggestionsOutput> {
  return getHistoricalSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getHistoricalSuggestionsPrompt',
  input: {schema: GetHistoricalSuggestionsInputSchema},
  output: {schema: GetHistoricalSuggestionsOutputSchema},
  prompt: `You are a historian providing suggestions for the card game "Go Hist!".
A player has selected a card and needs ideas for other cards that could form a historically connected set of 4.

The player's card has this description:
"{{cardDescription}}"

Based on this card, suggest a list of 3-5 distinct people, events, or concepts that have a strong historical connection to it. Keep the suggestions brief and to the point.
`,
});

const getHistoricalSuggestionsFlow = ai.defineFlow(
  {
    name: 'getHistoricalSuggestionsFlow',
    inputSchema: GetHistoricalSuggestionsInputSchema,
    outputSchema: GetHistoricalSuggestionsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output || { suggestions: [] };
    } catch (error) {
      console.error('Error in getHistoricalSuggestionsFlow:', error);
      // Return an empty list on error to prevent crashes.
      return { suggestions: [] };
    }
  }
);
