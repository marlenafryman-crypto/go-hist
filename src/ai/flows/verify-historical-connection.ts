'use server';

/**
 * @fileOverview An AI agent for verifying historical connections between cards.
 *
 * - verifyHistoricalConnection - A function that verifies the historical connection explanation.
 */

import {ai} from '@/ai/genkit';
import {
  VerifyHistoricalConnectionInputSchema,
  VerifyHistoricalConnectionOutputSchema,
  type VerifyHistoricalConnectionInput,
  type VerifyHistoricalConnectionOutput,
} from './types';


export async function verifyHistoricalConnection(input: VerifyHistoricalConnectionInput): Promise<VerifyHistoricalConnectionOutput> {
  return verifyHistoricalConnectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyHistoricalConnectionPrompt',
  input: {schema: VerifyHistoricalConnectionInputSchema},
  output: {schema: VerifyHistoricalConnectionOutputSchema},
  prompt: `You are an expert historian. You will be given two cards, and an explanation of how they are historically connected.
Your job is to determine whether the explanation is valid and respond with a JSON object.

Card 1: {{{card1Name}}}
Card 2: {{{card2Name}}}
Explanation: {{{explanation}}}

Is the explanation valid? Critically evaluate the connection. Vague or tangential connections are not allowed.
For example, simply stating that two people were alive at the same time is not a valid connection. There must be a direct link, such as collaboration, conflict, or influence.
Your response must be ONLY the JSON object, with no other text or formatting.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const verifyHistoricalConnectionFlow = ai.defineFlow(
  {
    name: 'verifyHistoricalConnectionFlow',
    inputSchema: VerifyHistoricalConnectionInputSchema,
    outputSchema: VerifyHistoricalConnectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
