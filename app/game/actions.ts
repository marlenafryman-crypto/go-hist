'use server';

import { findMatchingCard } from '@/ai/flows/find-matching-card';
import type { FindMatchingCardInput, FindMatchingCardOutput, VerifyHistSetInput, VerifyHistSetOutput, GetAiPlayerActionInput, GetAiPlayerActionOutput } from '@/ai/flows/types';
import { verifyHistSet } from '@/ai/flows/verify-hist-set';
import { getAiPlayerAction } from '@/ai/flows/get-ai-player-action';
import { getHistoricalSuggestions, GetHistoricalSuggestionsInput, GetHistoricalSuggestionsOutput } from '@/ai/flows/get-historical-suggestions';


export async function getHistoricalSuggestionsAction(input: GetHistoricalSuggestionsInput): Promise<GetHistoricalSuggestionsOutput> {
    try {
        const result = await getHistoricalSuggestions(input);
        return result;
    } catch (error) {
        console.error('Error getting historical suggestions:', error);
        return {
            suggestions: [],
        };
    }
}


export async function findMatchingCardAction(input: FindMatchingCardInput): Promise<FindMatchingCardOutput> {
    try {
        const result = await findMatchingCard(input);
        return result;
    } catch (error) {
        console.error('Error finding matching card:', error);
        return {
            cardId: undefined,
            reason: 'An error occurred while communicating with the arbiter AI. Please try again.',
        };
    }
}

export async function verifyHistSetAction(input: VerifyHistSetInput): Promise<VerifyHistSetOutput> {
    try {
        const result = await verifyHistSet(input);
        return result;
    } catch (error) {
        console.error('Error verifying Hist Set:', error);
        return {
            isValid: false,
            reason: 'An error occurred while communicating with the historian AI. Please try again.',
        };
    }
}


export async function getAiPlayerActionAction(input: GetAiPlayerActionInput): Promise<GetAiPlayerActionOutput> {
    try {
        const result = await getAiPlayerAction(input);
        return result;
    } catch (error) {
        console.error('Error getting AI player action:', error);
        // Default to drawing from the deck on error
        return {
            action: 'drawDeck'
        };
    }
}
