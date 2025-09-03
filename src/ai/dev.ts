import { config } from 'dotenv';
config();

import '@/ai/flows/verify-historical-connection.ts';
import '@/ai/flows/get-historical-suggestions.ts';
import '@/ai/flows/find-matching-card.ts';
