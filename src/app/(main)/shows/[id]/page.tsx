import { getShowById, getImageUrl } from '@/lib/tmdb';
import Image from 'next/image';
import {
  PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/star-rating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EpisodeTracker } from './episode-tracker';
import { Reviews } from './reviews';
import { WatchlistToggle } from './watchlist-toggle';
import { notFound } from 'next/navigation';
import { ShareButton } from './share-button';
import type { WatchlistShow } from '@/lib/types';


export default async function ShowDetailPage({ params }: { params: { id: string } }) {
  const show = await getShowById(params.id).catch(() => notFound());

  if (!show) {
    notFound();
  }

  const backdropUrl = getImageUrl(show.backdrop_path, 'original');
  const posterUrl = getImageUrl(show.poster_path, 'w500');

  const rating = show.vote_average / 2;
  const year = show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A';

  const watchlistShow: WatchlistShow = {
      id: show.id,
      name: show.name,
      poster_path: show.poster_path,
      first_air_date: show.first_air_date,
      vote_average: show.vote_average,
      genres: show.genres.map(g => g.name),
  };

  return (
    <div>
      <section className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src={backdropUrl}
          alt={`Backdrop for ${show.name}`}
          className="object-cover"
          fill
          priority
          unoptimized={backdropUrl.includes('placehold.co')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      <div className="container mx-auto px-4 md:px-6 -mt-24 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-48 md:w-64 flex-shrink-0">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={posterUrl}
                alt={`Poster for ${show.name}`}
                className="object-cover"
                fill
                unoptimized={posterUrl.includes('placehold.co')}
              />
            </div>
          </div>
          <div className="flex-grow pt-24 md:pt-32">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">
              {show.name}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <span>{year}</span>
              <StarRating rating={rating} readOnly />
              <span>{show.vote_average.toFixed(1)}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {show.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
            <p className="mt-4 max-w-2xl text-foreground/80">
              {show.overview}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Button size="lg">
                <PlayCircle className="mr-2" />
                Watch Trailer
              </Button>
              <WatchlistToggle show={watchlistShow} />
              <ShareButton />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="episodes">
            <TabsList>
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="episodes" className="mt-6">
              <EpisodeTracker show={show} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Reviews show={show} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
