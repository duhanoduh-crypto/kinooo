import { Star } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ratingLabels: Record<number, string> = {
  1: 'Очень плохо',
  2: 'Плохо',
  3: 'Слабо',
  4: 'Ниже среднего',
  5: 'Средне',
  6: 'Выше среднего',
  7: 'Хорошо',
  8: 'Очень хорошо',
  9: 'Отлично',
  10: 'Шедевр',
};

const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'md',
  showLabel = false
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const currentRating = hoverRating || rating;

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <TooltipProvider delayDuration={0}>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleClick(value)}
                  onMouseEnter={() => !readonly && setHoverRating(value)}
                  onMouseLeave={() => !readonly && setHoverRating(0)}
                  disabled={readonly}
                  className={`transition-all ${
                    !readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
                  }`}
                  aria-label={`Оценка ${value} из 10: ${ratingLabels[value]}`}
                >
                  <Star
                    className={`${sizeClasses[size]} transition-colors ${
                      value <= currentRating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              </TooltipTrigger>
              {!readonly && (
                <TooltipContent side="top" className="font-medium">
                  <p>{value} - {ratingLabels[value]}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
      
      {showLabel && rating > 0 && (
        <p className="text-sm text-muted-foreground">
          {rating}/10 - {ratingLabels[rating]}
        </p>
      )}
    </div>
  );
};

export default StarRating;
