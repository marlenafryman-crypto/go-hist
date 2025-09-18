'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { HelpCircle, Loader2 } from 'lucide-react';
import type { Player } from '@/lib/types';

const formSchema = z.object({
  opponentId: z.string().min(1, 'You must select an opponent.'),
  request: z.string().min(3, 'Your request must be at least 3 characters long.'),
});

interface AskForCardProps {
  otherPlayers: Player[];
  onAsk: (opponentId: string, request: string) => Promise<void>;
  disabled?: boolean;
}

export function AskForCard({ otherPlayers, onAsk, disabled }: AskForCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opponentId: '',
      request: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await onAsk(values.opponentId, values.request);
    setIsLoading(false);
    form.reset();
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-headline text-xl flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-primary" />
        Ask for a Card
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={disabled || isLoading} className="space-y-4">
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
              name="request"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., 'a scientist' or 'an event from the 1800s'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={disabled || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ask
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
