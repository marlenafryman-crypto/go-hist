
'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Loader2 } from 'lucide-react';
import type { Player, Card as CardType } from '@/lib/types';

const formSchema = z.object({
  opponentId: z.string().min(1, 'You must select an opponent.'),
  cardName: z.string().min(1, 'You must select a card to ask for.'),
});

interface AskForCardProps {
  currentPlayer: Player;
  otherPlayers: Player[];
  onAsk: (opponentId: string, cardName: string) => void;
}

export function AskForCard({ currentPlayer, otherPlayers, onAsk }: AskForCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const uniqueCardsInHand = useMemo(() => {
    const cardNames = new Set<string>();
    currentPlayer.hand.forEach(card => cardNames.add(card.name));
    return Array.from(cardNames);
  }, [currentPlayer.hand]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opponentId: '',
      cardName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onAsk(values.opponentId, values.cardName);
    setIsLoading(false);
    form.reset();
  }
  
  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-headline text-xl flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-primary" />
        Ask for a Card
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="opponentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opponent</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an opponent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {otherPlayers.map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a card to ask for" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {uniqueCardsInHand.map(cardName => (
                      <SelectItem key={cardName} value={cardName}>
                        {cardName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ask
          </Button>
        </form>
      </Form>
    </div>
  );
}
