'use server';

/**
 * @fileOverview An AI agent for verifying historical connections between cards.
 *
 * - verifyHistoricalConnection - A function that verifies the historical connection explanation.
 * - VerifyHistoricalConnectionInput - The input type for the verifyHistoricalConnection function.
 * - VerifyHistoricalConnectionOutput - The return type for the verifyHistoricalConnection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyHistoricalConnectionInputSchema = z.object({
  card1Name: z.string().describe('The name of the first card.'),
  card2Name: z.string().describe('The name of the second card.'),
  explanation: z.string().describe('The explanation of the historical connection between the two cards.'),
});
export type VerifyHistoricalConnectionInput = z.infer<typeof VerifyHistoricalConnectionInputSchema>;

const VerifyHistoricalConnectionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the historical connection explanation is valid.'),
  reason: z.string().describe('The reasoning behind the validity determination.'),
});
export type VerifyHistoricalConnectionOutput = z.infer<typeof VerifyHistoricalConnectionOutputSchema>;

export async function verifyHistoricalConnection(input: VerifyHistoricalConnectionInput): Promise<VerifyHistoricalConnectionOutput> {
  return verifyHistoricalConnectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyHistoricalConnectionPrompt',
  input: {schema: VerifyHistoricalConnectionInputSchema},
  output: {schema: VerifyHistoricalConnectionOutputSchema},
  prompt: `You are an expert historian. You will be given two cards, and an explanation of how they are historically connected.
Your job is to determine whether the explanation is valid, and provide a reason for your determination.

Card 1: {{{card1Name}}}
Card 2: {{{card2Name}}}
Explanation: {{{explanation}}}

Is the explanation valid? Answer in the following JSON format:
{
  "isValid": boolean,
  "reason": string
}`,
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
