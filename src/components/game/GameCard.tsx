'use client';

import Image from 'next/image';
import { Card as CardType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, History, Sparkles } from 'lucide-react';
import images from '@/app/lib/placeholder-images.json';

interface GameCardProps {
  card: CardType | 'back';
  isSelected?: boolean;
  onSelect?: (card: CardType) => void;
  className?: string;
  isPlayerCard?: boolean;
}

export function GameCard({ card, isSelected, onSelect, className, isPlayerCard }: GameCardProps) {
  if (card === 'back') {
    return (
      <Card className={cn(
        "bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center border-4 border-yellow-200/50 shadow-lg overflow-hidden relative", 
        className, 
        isPlayerCard ? 'w-[200px] h-[300px]' : 'w-[80px] h-[120px]'
      )}>
        <Image 
          src={images.card_back} 
          alt="Go Hist Card Back" 
          fill 
          className="object-cover" 
          priority
        />
      </Card>
    );
  }

  const handleSelect = () => {
    if (onSelect) {
      onSelect(card);
    }
  };
  
  const isInteractive = !!onSelect;

  const cardBaseSize = isPlayerCard ? 'w-[200px] h-[300px]' : 'w-[120px] h-[180px]';
  const cardTitleSize = isPlayerCard ? 'text-base' : 'text-xs';
  const iconSize = isPlayerCard ? 'w-4 h-4' : 'w-3 h-3';
  const cardDescriptionSize = isPlayerCard ? 'text-sm' : 'text-[10px]';
  const imageSize = isPlayerCard ? 'h-[150px]' : 'h-[90px]';
  const textContentSize = isPlayerCard ? 'text-sm' : 'text-[9px]';

  return (
    <div className={cn('relative shrink-0 transition-transform duration-200', isInteractive && 'hover:-translate-y-2', cardBaseSize, className)}>
      <Card
        onClick={handleSelect}
        className={cn(
          "w-full h-full flex flex-col shadow-lg border-4 transition-all duration-200",
          isSelected ? 'border-primary ring-4 ring-primary/30 shadow-2xl scale-105 z-10' : 'border-card',
          isInteractive ? 'cursor-pointer' : 'cursor-default',
        )}
      >
        <CardHeader className="p-2 space-y-0.5">
          <CardTitle className={cn("font-headline leading-tight whitespace-normal truncate", cardTitleSize)}>{card.name}</CardTitle>
          <div className="flex items-center space-x-2">
            {card.type === 'Person' ? (
              <User className={cn(iconSize, "text-primary")} />
            ) : card.type === 'Event' ? (
              <History className={cn(iconSize, "text-blue-500")} />
            ) : (
              <Sparkles className={cn(iconSize, "text-amber-500")} />
            )}
            <CardDescription className={cn("font-medium", cardDescriptionSize)}>{card.type}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col min-h-0">
          <div className={cn("relative w-full border-y", imageSize)}>
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover"
              data-ai-hint={card.hint}
            />
          </div>
          <div className="flex-grow overflow-y-auto bg-background/30 p-2">
            <p className={cn("text-foreground/80 leading-snug italic", textContentSize)}>{card.description}</p>
          </div>
        </CardContent>
      </Card>
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white z-20">
          ✓
        </div>
      )}
    </div>
  );
}
