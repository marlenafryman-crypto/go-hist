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

  const cardBaseSize = isPlayerCard ? 'w-[150px] h-[225px]' : 'w-[200px] h-[300px]';
  const cardTitleSize = isPlayerCard ? 'text-sm' : 'text-base';
  const iconSize = isPlayerCard ? 'w-3 h-3' : 'w-4 h-4';
  const cardDescriptionSize = isPlayerCard ? 'text-xs' : 'text-sm';
  const imageSize = isPlayerCard ? 'h-[60px]' : 'h-[120px]';
  const textContentSize = isPlayerCard ? 'text-[10px]' : 'text-xs';


  return (
    <div className={cn('relative', cardBaseSize, className)}>
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
          <CardTitle className={cn("font-headline leading-tight truncate", cardTitleSize)}>{card.name}</CardTitle>
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
            <p className={cn("p-2 md:p-3 text-foreground/80 leading-snug", textContentSize)}>{card.description}</p>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
