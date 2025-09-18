
'use client';

import { useState, useEffect } from 'react';
import { getHistoricalSuggestionsAction } from '@/app/game/actions';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lightbulb, XCircle } from 'lucide-react';
import type { Card as CardType } from '@/lib/types';
import { Badge } from '../ui/badge';

interface SuggestionProviderProps {
  selectedCards: CardType[];
}

export function SuggestionProvider({ selectedCards }: SuggestionProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const selectedCard = selectedCards[0];

  useEffect(() => {
    // Clear suggestions when card selection changes
    setSuggestions([]);
    setError(null);
  }, [selectedCard]);

  async function getSuggestions() {
    if (!selectedCard) return;

    setIsLoading(true);
    setSuggestions([]);
    setError(null);
    
    try {
      const result = await getHistoricalSuggestionsAction({ cardDescription: selectedCard.description });
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
      } else {
        setError("The historian couldn't find any specific suggestions for this card.");
      }
    } catch (e) {
        setError('A critical error occurred while communicating with the historian AI. Please try again later.');
    } finally {
        setIsLoading(false);
    }
  }

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
      
      <Button onClick={getSuggestions} disabled={isLoading || !selectedCard}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2"/>}
        Get Suggestions
      </Button>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle className="font-headline">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2 pt-2">
            <h4 className="font-headline text-md">Suggestions:</h4>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <Badge key={index} variant="secondary" className="text-wrap text-left">
                        {suggestion}
                    </Badge>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
