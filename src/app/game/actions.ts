'use server';

import { verifyHistoricalConnection, VerifyHistoricalConnectionInput, VerifyHistoricalConnectionOutput } from '@/ai/flows/verify-historical-connection';
import { findMatchingCard } from '@/ai/flows/find-matching-card';
import type { FindMatchingCardInput, FindMatchingCardOutput } from '@/ai/flows/types';


export async function verifyConnectionAction(input: VerifyHistoricalConnectionInput): Promise<VerifyHistoricalConnectionOutput> {
  try {
    const result = await verifyHistoricalConnection(input);
    return result;
  } catch (error) {
    console.error('Error verifying connection:', error);
    return {
      isValid: false,
      reason: 'An error occurred while communicating with the historian AI. Please try again.',
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

    