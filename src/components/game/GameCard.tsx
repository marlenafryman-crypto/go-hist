'use client';

import Image from 'next/image';
import { Card as CardType, Player } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, History, Feather, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface GameCardProps {
  card: CardType | 'back';
  isSelected?: boolean;
  onSelect?: (card: CardType) => void;
  className?: string;
  isPlayerCard?: boolean;
  otherPlayers?: Player[];
  onAsk?: (opponentId: string, cardName: string) => void;
}

export function GameCard({ card, isSelected, onSelect, className, isPlayerCard, otherPlayers, onAsk }: GameCardProps) {
  if (card === 'back') {
    return (
      <Card className={cn("w-[220px] h-[320px] bg-card flex items-center justify-center border-4 border-card/50 shadow-lg overflow-hidden", className)}>
        <div className="relative w-full h-full">
            <Image
              src="https://i.ibb.co/LddKckY6/Untitled-design-81.png"
              alt="Go Hist Card Back"
              fill
              className="object-cover"
              data-ai-hint="card back"
            />
        </div>
      </Card>
    );
  }

  const handleSelect = () => {
    if (onSelect) {
      onSelect(card);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Card
        onClick={handleSelect}
        className={cn(
          "w-[220px] h-[320px] flex flex-col cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border-4",
          isSelected ? 'border-ring shadow-2xl scale-105' : 'border-card',
          onSelect ? '' : 'cursor-default hover:scale-100'
        )}
      >
        <CardHeader className="p-3">
          <CardTitle className="font-headline text-lg leading-tight truncate">{card.name}</CardTitle>
          <div className="flex items-center space-x-2">
            {card.type === 'Person' ? <User className="w-4 h-4 text-muted-foreground" /> : <History className="w-4 h-4 text-muted-foreground" />}
            <CardDescription>{card.type}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <div className="relative w-full h-[120px]">
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover"
              data-ai-hint={card.hint}
            />
          </div>
          <p className="text-xs p-3 text-foreground/80 leading-snug">{card.description}</p>
        </CardContent>
        {isPlayerCard && card.type === 'Person' && onAsk && otherPlayers && (
          <CardFooter className="p-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="sm" className="w-full">
                  <HelpCircle className="mr-2" /> Ask for Card
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1">
                <div className="flex flex-col">
                  <p className="p-2 text-sm font-medium">Ask which opponent?</p>
                  {otherPlayers.map(player => (
                    <Button
                      key={player.id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => onAsk(player.id, card.name)}
                    >
                      {player.name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
