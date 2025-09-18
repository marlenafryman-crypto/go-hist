'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { verifyHistSetAction } from '@/app/game/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { Card as CardType } from '@/lib/types';
import type { VerifyHistSetOutput } from '@/ai/flows/types';

const formSchema = z.object({
  explanation: z.string().min(20, 'Explanation must be at least 20 characters.'),
});

interface HistSetVerifierProps {
  selectedCards: CardType[];
  onVerified: (explanation: string) => void;
}

export function HistSetVerifier({ selectedCards, onVerified }: HistSetVerifierProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyHistSetOutput | null>(null);
  const [explanation, setExplanation] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      explanation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setExplanation(values.explanation);

    const aiCards = selectedCards.map(({ id, name, type, description }) => ({ id, name, type, description }));
    const verificationResult = await verifyHistSetAction({
        cards: aiCards,
        explanation: values.explanation
    });
    setResult(verificationResult);
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
          <Button type="submit" disabled={isLoading || (!!result && result.isValid)}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Set
          </Button>
        </form>
      </Form>
      {result && (
        <Alert variant={result.isValid ? 'default' : 'destructive'} className="mt-4 bg-background/80">
          {result.isValid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle className="font-headline">{result.isValid ? 'Set Verified!' : 'Set Invalid'}</AlertTitle>
          <AlertDescription>
            <p className="mb-4">{result.reason}</p>
            {result.isValid && (
                <Button onClick={() => onVerified(explanation)}>Form This Set</Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
