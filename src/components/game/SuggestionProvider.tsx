'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, XCircle } from 'lucide-react';
import type { Card as CardType } from '@/lib/types';
import { Badge } from '../ui/badge';

interface SuggestionProviderProps {
  selectedCards: CardType[];
}

export function SuggestionProvider({ selectedCards }: SuggestionProviderProps) {
  const [error, setError] = useState<string | null>("The AI Historian is currently disabled because no API key was provided. The rest of the game is fully functional.");
  
  const selectedCard = selectedCards[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Select a single card from your hand to get historical connection ideas from the AI historian.</p>
        {selectedCard && (
            <div className="p-2 border rounded-md bg-muted/50">
                <p className="text-sm font-semibold">Selected: <span className="text-primary">{selectedCard.name}</span></p>
            </div>
        )}
      </div>
      
      <Button disabled>
        <Lightbulb className="mr-2"/>
        Get Suggestions
      </Button>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle className="font-headline">AI Unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

    </div>
  );
}
