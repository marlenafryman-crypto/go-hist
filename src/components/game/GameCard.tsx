
'use client';

import Image from 'next/image';
import { Card as CardType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, History } from 'lucide-react';
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
      <Card className={cn("bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center border-4 border-yellow-200/50 shadow-lg overflow-hidden relative", className, isPlayerCard ? 'w-[200px] h-[300px]' : 'w-[80px] h-[120px]')}>
        <Image src="https://lh3.googleusercontent.com/pw/AP1GczPQDkjfYTgBMaPMoiVpyJRWMl0hkIgEVmHsR9PvQ8SzLWuK35dV3oV-n9CVeMEWMWBGbyRD03h7WJ2YiJildf0T49O_VOnNxxq0NCqKW-zF0rgFq6BOwNdYoeL6TPEl1dWnQJN7K8HU_4hpwQTMFzp8=w607-h911-s-no-gm?authuser=0" alt="Go Hist Card Back" layout="fill" objectFit="contain" className="p-4 opacity-80" />
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
