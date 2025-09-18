
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
  onSelect?: (card: CardType) => void;
  className?: string;
  isPlayerCard?: boolean;
  inSet?: boolean;
}

export function GameCard({ card, isSelected, onSelect, className, isPlayerCard, inSet }: GameCardProps) {
  if (card === 'back') {
    return (
      <Card className={cn("bg-card flex items-center justify-center border-4 border-card/50 shadow-lg overflow-hidden", className)}>
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
  
  const isInteractive = !!onSelect;

  const cardBaseSize = isPlayerCard ? 'w-[150px] h-[225px]' : 'w-[120px] h-[180px]';
  const cardTitleSize = isPlayerCard ? 'text-sm' : 'text-xs';
  const iconSize = isPlayerCard ? 'w-3 h-3' : 'w-3 h-3';
  const cardDescriptionSize = isPlayerCard ? 'text-xs' : 'text-[10px]';
  const imageSize = isPlayerCard ? 'h-[60px]' : 'h-[80px]';
  const textContentSize = isPlayerCard ? 'text-[10px]' : 'text-[9px]';


  return (
    <div className={cn('relative shrink-0', cardBaseSize, className)}>
      <Card
        onClick={handleSelect}
        className={cn(
          "w-full h-full flex flex-col shadow-lg border-4 transition-all duration-200",
          isSelected ? 'border-primary shadow-2xl scale-105' : 'border-card',
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
