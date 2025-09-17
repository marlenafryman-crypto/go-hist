'use server';

/**
 * @fileOverview An AI agent for verifying historical connections between cards.
 *
 * - verifyHistoricalConnection - A function that verifies the historical-connection-explanation.
 */

import {ai} from '@/ai/genkit';
import {
  VerifyHistoricalConnectionInputSchema,
  VerifyHistoricalConnectionOutputSchema,
  type VerifyHistoricalConnectionInput,
  type VerifyHistoricalConnectionOutput,
} from './types';

export async function verifyHistoricalConnection(
  input: VerifyHistoricalConnectionInput
): Promise<VerifyHistoricalConnectionOutput> {
  return verifyHistoricalConnectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyHistoricalConnectionPrompt',
  input: {schema: VerifyHistoricalConnectionInputSchema},
  prompt: `You are an expert historian and the arbiter of the card game "Go Hist!". Your task is to determine if a player's explanation of a historical connection between two cards is valid.

Card 1: {{{card1Name}}}
Card 2: {{{card2Name}}}
Explanation: {{{explanation}}}

Critically evaluate the player's explanation. Is the historical connection strong, logical, and accurate? Be strict. Vague or tangential connections are not allowed. For example, simply stating that two people were alive at the same time is not a valid connection. There must be a direct link, such as collaboration, conflict, or influence.

Based on your evaluation, decide if the connection is valid. Respond with either "VALID:" or "INVALID:", followed by a brief reason for your decision.
Example VALID response: VALID: Both were key figures in the American Revolution and signed the Declaration of Independence.
Example INVALID response: INVALID: While both were rulers, they lived in different centuries and had no direct connection.
`,
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
    try {
      const response = await prompt(input);
      const responseText = response.text;

      if (!responseText) {
        throw new Error('AI returned an empty response.');
      }

      if (responseText.startsWith('VALID:')) {
        return {
          isValid: true,
          reason: responseText.substring('VALID:'.length).trim(),
        };
      } else if (responseText.startsWith('INVALID:')) {
        return {
          isValid: false,
          reason: responseText.substring('INVALID:'.length).trim(),
        };
      } else {
        // If the format is not as expected, treat it as invalid but return the text.
        return {
          isValid: false,
          reason: `The historian's response was unclear: "${responseText}"`,
        };
      }
    } catch (error) {
      console.error('Error in verifyHistoricalConnectionFlow:', error);
      return {
        isValid: false,
        reason:
          'A critical error occurred while communicating with the historian AI. Please try again later.',
      };
    }
  }
);
