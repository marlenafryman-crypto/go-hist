
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { verifyConnectionAction } from '@/app/game/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, Scale } from 'lucide-react';
import type { Card as CardType } from '@/lib/types';
import type { VerifyHistoricalConnectionOutput } from '@/ai/flows/verify-historical-connection';

const formSchema = z.object({
  card1Name: z.string().min(1, 'First card name is required.'),
  card2Name: z.string().min(1, 'Second card name is required.'),
  explanation: z.string().min(10, 'Explanation must be at least 10 characters.'),
});

interface ConnectionVerifierProps {
  selectedCards: CardType[];
  onVerified: (card1Id: string, card2Id: string) => void;
}

export function ConnectionVerifier({ selectedCards, onVerified }: ConnectionVerifierProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyHistoricalConnectionOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      card1Name: '',
      card2Name: '',
      explanation: '',
    },
  });

  useEffect(() => {
    // When selectedCards change, update the form values.
    form.setValue('card1Name', selectedCards[0]?.name || '');
    form.setValue('card2Name', selectedCards[1]?.name || '');
    // Reset explanation and result when selection changes
    form.setValue('explanation', '');
    setResult(null);
  }, [selectedCards, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const verificationResult = await verifyConnectionAction(values);
    if (verificationResult.isValid) {
      const card1 = selectedCards.find(c => c.name === values.card1Name);
      const card2 = selectedCards.find(c => c.name === values.card2Name);
      if (card1 && card2) {
        onVerified(card1.id, card2.id);
      }
    }
    setResult(verificationResult);
    setIsLoading(false);
    form.setValue('explanation', '');
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Scale className="w-5 h-5 text-primary" />
        <h3 className="font-headline text-lg">
        Check Card Connections
        </h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="card1Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Select first card" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="card2Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Select second card" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Connection</FormLabel>
                <FormControl>
                  <Textarea placeholder="Explain the historical connection between these two..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading || selectedCards.length < 2}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Connection
          </Button>
        </form>
      </Form>
      {result && (
        <Alert variant={result.isValid ? 'default' : 'destructive'} className="mt-4 bg-background/80">
          {result.isValid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle className="font-headline">{result.isValid ? 'Connection Verified' : 'Connection Questionable'}</AlertTitle>
          <AlertDescription>{result.reason}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

    