'use client';

import Image from 'next/image';
import { Card as CardType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, History } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface GameCardProps {
  card: CardType | 'back';
  isSelected?: boolean;
  onSelect?: (card: CardType) => void;
  className?: string;
  isPlayerCard?: boolean;
  inSet?: boolean;
}

export function GameCard({ card, isSelected, onSelect, className, isPlayerCard, inSet }: GameCardProps) {
  if (card === 'back') {
    return (
      <Card className={cn("w-[200px] h-[300px] bg-card flex items-center justify-center border-4 border-card/50 shadow-lg overflow-hidden", className)}>
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
    <div className={cn('relative', isPlayerCard ? 'w-[150px] h-[225px]' : 'w-[200px] h-[300px]', className)}>
      <Card
        onClick={handleSelect}
        className={cn(
          "w-full h-full flex flex-col cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border-4",
          isSelected ? 'border-ring shadow-2xl scale-105' : 'border-card',
          inSet ? 'border-green-500' : '',
          onSelect ? '' : 'cursor-default hover:scale-100'
        )}
      >
        <CardHeader className="p-2 md:p-3">
          <CardTitle className="font-headline text-sm md:text-base leading-tight truncate">{card.name}</CardTitle>
          <div className="flex items-center space-x-2">
            {card.type === 'Person' ? <User className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" /> : <History className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />}
            <CardDescription className="text-xs md:text-sm">{card.type}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className={cn("relative w-full", isPlayerCard ? "h-[60px]" : "h-[80px] md:h-[120px]")}>
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover"
              data-ai-hint={card.hint}
            />
          </div>
          <ScrollArea className="flex-grow">
            <p className="text-[10px] md:text-xs p-2 md:p-3 text-foreground/80 leading-snug">{card.description}</p>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
