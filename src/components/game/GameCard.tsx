
'use client';

import Image from 'next/image';
import { Card as CardType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, History, Feather } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface GameCardProps {
  card: CardType | 'back';
  isSelected?: boolean;
  isVerified?: boolean;
  onSelect?: (card: CardType) => void;
  className?: string;
  isPlayerCard?: boolean;
  inSet?: boolean;
}

export function GameCard({ card, isSelected, isVerified, onSelect, className, isPlayerCard, inSet }: GameCardProps) {
  if (card === 'back') {
    return (
      <Card className={cn("bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center border-4 border-yellow-200/50 shadow-lg overflow-hidden", className, isPlayerCard ? 'w-[200px] h-[300px]' : 'w-[80px] h-[120px]')}>
        <div className="flex flex-col items-center justify-center opacity-50">
            <Feather className="w-12 h-12 text-white/80" />
            <p className="font-headline text-white/80 text-lg mt-2">Go Hist</p>
        </div>
      </Card>
    );
  }

  const handleSelect = () => {
    if (onSelect) {
      onSelect(card);
    }
  };
  
  const isInteractive = !!onSelect;

  const cardBaseSize = isPlayerCard ? 'w-[200px] h-[300px]' : 'w-[80px] h-[120px]';
  const cardTitleSize = isPlayerCard ? 'text-base' : 'text-xs';
  const iconSize = isPlayerCard ? 'w-4 h-4' : 'w-3 h-3';
  const cardDescriptionSize = isPlayerCard ? 'text-sm' : 'text-[10px]';
  const imageSize = isPlayerCard ? 'h-[150px]' : 'h-[60px]';
  const textContentSize = isPlayerCard ? 'text-sm' : 'text-[9px]';


  return (
    <div className={cn('relative shrink-0', cardBaseSize, className)}>
      <Card
        onClick={handleSelect}
        className={cn(
          "w-full h-full flex flex-col shadow-lg border-4 transition-all duration-200",
          isSelected ? 'border-primary shadow-2xl scale-105' : 'border-card',
          isVerified ? 'border-blue-500 shadow-2xl scale-105' : '',
          isInteractive ? 'cursor-pointer' : 'cursor-default',
          inSet ? 'border-green-500' : ''
        )}
      >
        <CardHeader className="p-2">
          <CardTitle className={cn("font-headline leading-tight whitespace-normal", cardTitleSize)}>{card.name}</CardTitle>
          <div className="flex items-center space-x-2">
            {card.type === 'Person' ? <User className={cn(iconSize, "text-muted-foreground")} /> : <History className={cn(iconSize, "text-muted-foreground")} />}
            <CardDescription className={cardDescriptionSize}>{card.type}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col min-h-0">
          <div className={cn("relative w-full", imageSize)}>
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover"
              data-ai-hint={card.hint}
            />
          </div>
          <ScrollArea className="flex-grow">
            <p className={cn("p-2 text-foreground/80 leading-snug", textContentSize)}>{card.description}</p>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
