import { config } from 'dotenv';
config();

import '@/ai/flows/get-historical-suggestions.ts';
import '@/ai/flows/find-matching-card.ts';
import '@/ai/flows/get-ai-player-action.ts';
