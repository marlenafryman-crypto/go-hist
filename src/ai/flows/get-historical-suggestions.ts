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
      'A list of suggestions for cards that have a close historical connection to the card in the player\'s hand.'
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
  prompt: `You are a historian providing suggestions for cards that have a close historical connection to a card in the player's hand.

  Given the following card description:
  {{cardDescription}}

  Suggest a list of cards that would form a valid Hist Set with the described card. Return the suggestions as a JSON array of strings.
  `,
});

const getHistoricalSuggestionsFlow = ai.defineFlow(
  {
    name: 'getHistoricalSuggestionsFlow',
    inputSchema: GetHistoricalSuggestionsInputSchema,
    outputSchema: GetHistoricalSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
