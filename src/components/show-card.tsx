import Image from 'next/image';
import Link from 'next/link';

import { getImageUrl } from '@/lib/tmdb';
import type { TMDBShowSummary } from '@/lib/types';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StarRating } from '@/components/star-rating';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ShowCardProps {
  show: TMDBShowSummary;
}

export function ShowCard({ show }: ShowCardProps) {
  const posterUrl = getImageUrl(show.poster_path, 'w400');
  const rating = show.vote_average / 2;
  const year = show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A';

  return (
    <Link href={`/shows/${show.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="p-0">
          <AspectRatio ratio={2 / 3}>
            <Image
              src={posterUrl}
              alt={`Poster for ${show.name}`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              unoptimized={posterUrl.includes('placehold.co')}
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg truncate">
            {show.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
            <StarRating rating={rating} readOnly />
            <span>({show.vote_average.toFixed(1)})</span>
            <span className="ml-auto">{year}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
