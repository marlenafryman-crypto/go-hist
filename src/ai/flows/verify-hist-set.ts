'use server';

/**
 * @fileOverview An AI agent for verifying if a set of 4 cards constitutes a valid "Hist Set".
 *
 * - verifyHistSet - A function that verifies the historical connection of a 4-card set.
 */

import {ai} from '@/ai/genkit';
import {
  VerifyHistSetInputSchema,
  VerifyHistSetOutputSchema,
  type VerifyHistSetInput,
  type VerifyHistSetOutput,
} from './types';

export async function verifyHistSet(
  input: VerifyHistSetInput
): Promise<VerifyHistSetOutput> {
  return verifyHistSetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyHistSetPrompt',
  input: {schema: VerifyHistSetInputSchema},
  output: {schema: VerifyHistSetOutputSchema},
  prompt: `You are an expert historian and the arbiter of the card game "Go Hist!". Your task is to determine if a player's proposed set of 4 cards is a valid "Hist Set".

  A valid "Hist Set" must follow two rules:
  1.  The set must contain at least one "Person" card.
  2.  The four cards must have a clear, direct, and verifiable historical connection. The connection must be explained by the player. It is acceptable for a set to contain multiple "Person" cards, as long as their connection is justified by common events or relationships.

  Here are the 4 cards the player has proposed:
  {{#each cards}}
  - Card Name: "{{this.name}}", Type: "{{this.type}}", Description: "{{this.description}}"
  {{/each}}

  Here is the player's explanation for the connection:
  "{{{explanation}}}"

  First, check if there is at least one "Person" card in the set. If not, the set is invalid.
  
  Next, critically evaluate the player's explanation. Is the historical connection strong, logical, and accurate? Be strict. Vague or tangential connections are not allowed. For example, simply stating that two people were alive at the same time is not a valid connection. There must be a direct link, such as collaboration, conflict, or influence.

  Based on your evaluation, decide if the set is valid. Provide a clear reason for your decision, either confirming the valid connection or explaining why it is invalid.
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

const verifyHistSetFlow = ai.defineFlow(
  {
    name: 'verifyHistSetFlow',
    inputSchema: VerifyHistSetInputSchema,
    outputSchema: VerifyHistSetOutputSchema,
  },
  async input => {
    const hasPersonCard = input.cards.some(card => card.type === 'Person');
    if (!hasPersonCard) {
      return {
        isValid: false,
        reason: 'The proposed set is invalid because it does not contain at least one "Person" card.',
      };
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);
