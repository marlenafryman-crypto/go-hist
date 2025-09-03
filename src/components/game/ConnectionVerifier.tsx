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
}

export function ConnectionVerifier({ selectedCards }: ConnectionVerifierProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyHistoricalConnectionOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      card1Name: selectedCards[0]?.name || '',
      card2Name: selectedCards[1]?.name || '',
      explanation: '',
    },
  });

  useEffect(() => {
    form.reset({
      card1Name: selectedCards[0]?.name || '',
      card2Name: selectedCards[1]?.name || '',
      explanation: form.getValues('explanation') || '',
    });
  }, [selectedCards, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const verificationResult = await verifyConnectionAction(values);
    setResult(verificationResult);
    setIsLoading(false);
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-headline text-xl flex items-center gap-2">
        <Scale className="w-5 h-5 text-primary" />
        Consult the Historian
      </h3>
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
                    <Input placeholder="Name of first card" {...field} />
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
                    <Input placeholder="Name of second card" {...field} />
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
          <Button type="submit" disabled={isLoading}>
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
