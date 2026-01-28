import Image from 'next/image';
import Link from 'next/link';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Show } from '@/lib/types';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StarRating } from '@/components/star-rating';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  const poster = PlaceHolderImages.find((img) => img.id === show.posterId);

  return (
    <Link href={`/shows/${show.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="p-0">
          <AspectRatio ratio={2 / 3}>
            <Image
              src={poster?.imageUrl || `https://picsum.photos/seed/${show.id}/400/600`}
              alt={`Poster for ${show.title}`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              data-ai-hint={poster?.imageHint || 'movie poster'}
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg truncate">
            {show.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
            <StarRating rating={show.rating} readOnly />
            <span>({show.rating.toFixed(1)})</span>
            <span className="ml-auto">{show.year}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
