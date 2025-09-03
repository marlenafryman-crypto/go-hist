'use client';

import Image from 'next/image';
import { Card as CardType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { PersonIcon, History } from 'lucide-react';

interface GameCardProps {
  card: CardType | 'back';
  isSelected?: boolean;
  onSelect?: (card: CardType) => void;
  className?: string;
}

export function GameCard({ card, isSelected, onSelect, className }: GameCardProps) {
  if (card === 'back') {
    return (
      <Card className={cn("w-[220px] h-[320px] bg-primary flex items-center justify-center border-4 border-primary-foreground/50 shadow-lg", className)}>
        <div className="flex flex-col items-center">
          <FeatherIcon className="w-16 h-16 text-primary-foreground" />
          <p className="font-headline text-primary-foreground text-2xl mt-2">Go Hist</p>
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
            {card.type === 'Person' ? <PersonIcon className="w-4 h-4 text-muted-foreground" /> : <History className="w-4 h-4 text-muted-foreground" />}
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
      </Card>
    </div>
  );
}

function FeatherIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" x2="2" y1="8" y2="22" />
      <line x1="17.5" x2="9" y1="15" y2="15" />
    </svg>
  );
}
