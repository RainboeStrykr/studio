'use client';

import { Star } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  onRatingChange?: (rating: number) => void;
  totalStars?: number;
  readOnly?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  totalStars = 5,
  readOnly = false,
  className,
  ...props
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleStarClick = (index: number) => {
    if (onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const currentRating = hoverRating || rating;

  return (
    <div
      className={cn('flex items-center gap-1', !readOnly && 'cursor-pointer', className)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {[...Array(totalStars)].map((_, i) => {
        const starValue = i + 1;
        return (
          <Star
            key={i}
            className={cn(
              'h-5 w-5 transition-colors',
              starValue <= currentRating
                ? 'text-primary fill-primary'
                : 'text-muted-foreground'
            )}
            onClick={() => !readOnly && handleStarClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
          />
        );
      })}
    </div>
  );
}
