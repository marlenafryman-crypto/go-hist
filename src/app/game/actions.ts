'use server';

import { findMatchingCard } from '@/ai/flows/find-matching-card';
import type { FindMatchingCardInput, FindMatchingCardOutput, VerifyHistSetInput, VerifyHistSetOutput, GetAiPlayerActionInput, GetAiPlayerActionOutput } from '@/ai/flows/types';
import { verifyHistSet } from '@/ai/flows/verify-hist-set';
import { getAiPlayerAction } from '@/ai/flows/get-ai-player-action';
import { getHistoricalSuggestions, GetHistoricalSuggestionsInput, GetHistoricalSuggestionsOutput } from '@/ai/flows/get-historical-suggestions';


export async function getHistoricalSuggestionsAction(input: GetHistoricalSuggestionsInput): Promise<GetHistoricalSuggestionsOutput & { error?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return {
            suggestions: [],
            error: 'AI historian is unavailable. Please set the GEMINI_API_KEY environment variable to enable this feature.',
        };
    }
    try {
        const result = await getHistoricalSuggestions(input);
        return result;
    } catch (error) {
        console.error('Error getting historical suggestions:', error);
        return {
            suggestions: [],
            error: 'A critical error occurred while communicating with the historian AI. Please try again later.',
        };
    }
}


export async function findMatchingCardAction(input: FindMatchingCardInput): Promise<FindMatchingCardOutput> {
    if (!process.env.GEMINI_API_KEY) {
        return {
            reason: 'AI arbiter is unavailable. Please set the GEMINI_API_KEY environment variable to enable this feature.',
        };
    }
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
    if (!process.env.GEMINI_API_KEY) {
        return {
            isValid: false,
            reason: 'AI historian is unavailable. Please set the GEMINI_API_KEY environment variable to enable this feature.',
        };
    }
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
     if (!process.env.GEMINI_API_KEY) {
        return {
            action: 'drawDeck',
            error: 'AI player is unavailable. Please set the GEMINI_API_KEY environment variable to enable AI opponents.',
        };
    }
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
