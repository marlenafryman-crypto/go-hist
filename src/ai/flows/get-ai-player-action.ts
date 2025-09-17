'use server';

/**
 * @fileOverview An AI agent that determines the best action for an AI player to take on their turn.
 *
 * - getAiPlayerAction - A function that returns the best action for an AI player.
 */

import {ai} from '@/ai/genkit';
import {GetAiPlayerActionInputSchema, GetAiPlayerActionOutputSchema, type GetAiPlayerActionInput, type GetAiPlayerActionOutput} from './types';


export async function getAiPlayerAction(
  input: GetAiPlayerActionInput
): Promise<GetAiPlayerActionOutput> {
  return getAiPlayerActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAiPlayerActionPrompt',
  input: {schema: GetAiPlayerActionInputSchema},
  output: {schema: GetAiPlayerActionOutputSchema},
  prompt: `You are an AI player in the card game "Go Hist!". It is your turn to act. Analyze your hand and the current game state to decide the best strategic move.

  Your Name: {{{playerName}}}

  Your Hand:
  {{#each hand}}
  - Card ID: {{{this.id}}}, Name: "{{{this.name}}}", Description: "{{{this.description}}}"
  {{/each}}

  Your Goal: Form a "Hist Set" of 4 cards with a strong historical connection.

  Game State:
  - Your current Hist Sets: {{histSetCount}}
  - Other Players:
  {{#each otherPlayers}}
    - {{{this.name}}} (has {{{this.handSize}}} cards and {{{this.histSetCount}}} sets)
  {{/each}}
  - Card on top of Discard Pile: {{#if discardTopCard}}"{{discardTopCard.name}}"{{else}}Empty{{/if}}

  Available Actions:
  1.  **Form a Hist Set**: If you have 4 cards in your hand that form a valid historical set, you can declare it.
      - If you choose this, set 'action' to 'formSet'.
      - Provide the IDs of the 4 cards in 'cardIds'.
      - Provide a brief, convincing 'explanation' for the historical connection.
  2.  **Ask for a Card**: You can ask another player for a specific card to help you complete a potential set.
      - If you choose this, set 'action' to 'ask'.
      - Specify the 'opponentId' you are asking.
      - Create a clear 'request' string for the card you need (e.g., "a leader from the American Revolution" or "an event related to space exploration").
  3.  **Draw a Card**: If you cannot make a strong move, you can draw from the deck or the discard pile.
      - If you choose to draw from the deck, set 'action' to 'drawDeck'.
      - If you want the top card of the discard pile, set 'action' to 'drawDiscard'. Only do this if the card is genuinely useful for a potential set.

  Decision Strategy:
  - **Priority 1 (Winning Move)**: If you can form a Hist Set that will win you the game (i.e., you reach the winning number of sets), take it immediately.
  - **Priority 2 (Form a Set)**: If you have a definite, strong Hist Set in your hand, declare it. This is your primary way to score points. Be confident in the connection.
  - **Priority 3 (Ask for a Card)**: If you have 3 cards that are very close to forming a set, ask an opponent for a card that would complete it. Target opponents who are close to winning or who you think might have the card.
  - **Priority 4 (Draw)**: If the above options aren't viable, draw a card. Prefer the discard pile only if the top card directly helps you build a strong potential set (e.g., you have 2-3 cards that connect to it). Otherwise, draw from the main deck for a new, random card.

  Based on your hand and the game state, determine the single best action to take right now.
  `,
});

const getAiPlayerActionFlow = ai.defineFlow(
  {
    name: 'getAiPlayerActionFlow',
    inputSchema: GetAiPlayerActionInputSchema,
    outputSchema: GetAiPlayerActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
