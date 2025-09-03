'use server';

import { verifyHistoricalConnection, VerifyHistoricalConnectionInput, VerifyHistoricalConnectionOutput } from '@/ai/flows/verify-historical-connection';

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
