'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Check } from 'lucide-react';
import type { Card as CardType } from '@/lib/types';

const formSchema = z.object({
  explanation: z.string().min(10, 'Explanation must be at least 10 characters.'),
});

interface HistSetVerifierProps {
  selectedCards: CardType[];
  onVerified: (explanation: string) => Promise<void>;
}

export function HistSetVerifier({ selectedCards, onVerified }: HistSetVerifierProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      explanation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await onVerified(values.explanation);
    setIsLoading(false);
  }
  
  return (
    <div className="space-y-4">
       <div className="grid grid-cols-4 gap-2">
        {selectedCards.map(card => (
            <div key={card.id} className="border rounded-md p-2 text-center bg-muted/50">
                <p className="text-xs font-semibold">{card.name}</p>
            </div>
        ))}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Connection Explanation</FormLabel>
                <FormControl>
                  <Textarea placeholder="Explain how these four cards are historically connected..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm Historical Set
              </>
            )}
          </Button>
          <p className="text-[10px] text-muted-foreground text-center italic">
            Note: In this version, sets are automatically approved once explained.
          </p>
        </form>
      </Form>
    </div>
  );
}
