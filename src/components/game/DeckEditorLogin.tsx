'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DeckEditorLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      onLoginSuccess();
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="font-headline text-3xl flex items-center gap-2">
                <KeyRound className="w-8 h-8 text-primary" />
                Deck Editor Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Unlock
              </Button>
            </CardContent>
          </form>
        </Card>
        <div className="w-full mt-4">
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
