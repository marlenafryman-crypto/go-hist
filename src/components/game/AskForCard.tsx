'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { HelpCircle, Loader2 } from 'lucide-react';
import type { Player } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const formSchema = z.object({
  opponentId: z.string().min(1, 'Select an opponent.'),
  request: z.string().min(2, 'Enter at least 2 characters.'),
});

interface AskForCardProps {
  otherPlayers: Player[];
  onAsk: (opponentId: string, request: string) => Promise<void>;
  disabled?: boolean;
}

export function AskForCard({ otherPlayers, onAsk, disabled }: AskForCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
    setOpen(false);
    form.reset();
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
          <HelpCircle className="mr-2 h-5 w-5" /> Ask Opponent
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="opponentId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Opponent" />
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
                  <FormControl>
                      <Input placeholder="Keyword (e.g., 'Newton', 'Scientist')" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={disabled || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Check Hand
            </Button>
            <p className="text-[10px] text-muted-foreground text-center italic">
              Searches for keywords in names and types.
            </p>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
