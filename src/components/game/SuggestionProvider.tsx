'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, XCircle } from 'lucide-react';
import type { Card as CardType } from '@/lib/types';
import { Badge } from '../ui/badge';
import { getHistoricalSuggestionsAction } from '@/app/game/actions';

interface SuggestionProviderProps {
  selectedCards: CardType[];
}

export function SuggestionProvider({ selectedCards }: SuggestionProviderProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const selectedCard = selectedCards.length === 1 ? selectedCards[0] : null;

  const handleGetSuggestions = async () => {
    if (!selectedCard) return;

    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    
    const result = await getHistoricalSuggestionsAction({ cardDescription: selectedCard.description });

    if (result.error) {
      setError(result.error);
    } else {
      setSuggestions(result.suggestions);
    }
    setIsLoading(false);
  };

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
      
      <Button onClick={handleGetSuggestions} disabled={!selectedCard || isLoading}>
        {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Lightbulb className="mr-2"/>}
        Get Suggestions
      </Button>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle className="font-headline">AI Unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-headline text-lg">Connection Ideas:</h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge key={index} variant="secondary">{suggestion}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

    