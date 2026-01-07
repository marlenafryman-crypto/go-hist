'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Card } from '@/lib/types';

const HistSetVerificationInputSchema = z.object({
  cards: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      description: z.string(),
    })
  ),
  explanation: z.string(),
});

const HistSetVerificationOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the historical connection is valid.'),
  reason: z
    .string()
    .describe('A brief explanation for why the set is or is not valid.'),
});

const verifyHistSetPrompt = ai.definePrompt({
    name: 'verifyHistSetPrompt',
    input: { schema: HistSetVerificationInputSchema },
    output: { schema: HistSetVerificationOutputSchema },
    prompt: `You are an AI expert in history for the card game "Go Hist". Your role is to determine if a player's proposed set of 4 cards has a valid historical connection based on their explanation.

The player has proposed the following set:
{{#each cards}}
- {{name}} ({{type}}): {{description}}
{{/each}}

Their explanation for the connection is: "{{explanation}}"

Rules for a valid set:
1. The connection must be historically accurate and plausible.
2. The connection cannot be trivial (e.g., "they are all people" or "they all existed before 1900"). It must be a specific, meaningful link.
3. At least one card in the set must be a 'Person' card. (This is pre-validated, but keep it in mind).
4. All four cards must be connected. It's not enough for three to be connected and one to be an outlier.

Analyze the explanation and the cards. Is the connection valid based on these rules? Provide a clear "yes" or "no" and a brief, one-sentence justification for your decision.`,
});


export async function verifyHistSet(cards: Card[], explanation: string) {
  const {output} = await verifyHistSetPrompt({
    cards: cards.map(({ name, type, description }) => ({ name, type, description })),
    explanation,
  });

  return output!;
}


const AskForCardOutputSchema = z.object({
  hasCard: z.boolean().describe("Whether the opponent's hand contains a card matching the request."),
  cardId: z.string().optional().describe("The ID of the card that matches the request, if any."),
});

const askForCardPrompt = ai.definePrompt({
    name: 'askForCardPrompt',
    input: { schema: z.object({
        hand: z.array(z.object({ id: z.string(), name: z.string(), type: z.string(), description: z.string() })),
        request: z.string(),
    })},
    output: { schema: AskForCardOutputSchema },
    prompt: `You are an AI for the card game "Go Hist". A player is asking an opponent for a card.
Player's request: "{{request}}"

Opponent's hand:
{{#each hand}}
- (ID: {{id}}) {{name}} ({{type}}): {{description}}
{{/each}}

Analyze the opponent's hand. Does any card in the hand match the player's request? A match can be about the card's name, type, description, or historical context.
For example, if the request is for "a scientist", Marie Curie would be a match. If the request is for "something from the Renaissance", Leonardo da Vinci would be a match.

If there is a match, identify the single best matching card. Return hasCard: true and the ID of that card.
If there are no matching cards, return hasCard: false.`,
});

export async function askForCard(hand: Card[], request: string) {
    if (hand.length === 0) {
        return { hasCard: false };
    }
    const {output} = await askForCardPrompt({ hand, request });
    return output!;
}
