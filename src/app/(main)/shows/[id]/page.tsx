
'use client';

import { getShowById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import {
  Bookmark,
  Share2,
  PlayCircle,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/star-rating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EpisodeTracker } from './episode-tracker';
import { Reviews } from './reviews';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ShowDetailPage({ params }: { params: { id: string } }) {
  const show = getShowById(params.id);
  const { addToWatchlist, removeFromWatchlist, isOnWatchlist } =
    useWatchlist();
  const { toast } = useToast();

  if (!show) {
    notFound();
  }

  const backdrop = PlaceHolderImages.find((img) => img.id === show.backdropId);
  const poster = PlaceHolderImages.find((img) => img.id === show.posterId);

  const onWatchlistToggle = () => {
    if (isOnWatchlist(show.id)) {
      removeFromWatchlist(show.id);
      toast({ title: `Removed "${show.title}" from your watchlist.` });
    } else {
      addToWatchlist(show);
      toast({ title: `Added "${show.title}" to your watchlist.` });
    }
  };

  const onShare = (platform: string) => {
    toast({ title: `Shared to ${platform}! (simulation)` });
  };

  return (
    <div>
      <section className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src={
            backdrop?.imageUrl || `https://picsum.photos/seed/${show.id}/1280/720`
          }
          alt={`Backdrop for ${show.title}`}
          className="object-cover"
          fill
          priority
          data-ai-hint={backdrop?.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      <div className="container mx-auto px-4 md:px-6 -mt-24 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-48 md:w-64 flex-shrink-0">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={
                  poster?.imageUrl || `https://picsum.photos/seed/${show.id}/400/600`
                }
                alt={`Poster for ${show.title}`}
                className="object-cover"
                fill
                data-ai-hint={poster?.imageHint}
              />
            </div>
          </div>
          <div className="flex-grow pt-24 md:pt-32">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">
              {show.title}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <span>{show.year}</span>
              <StarRating rating={show.rating} readOnly />
              <span>{show.rating.toFixed(1)}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {show.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            <p className="mt-4 max-w-2xl text-foreground/80">
              {show.synopsis}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Button size="lg">
                <PlayCircle className="mr-2" />
                Watch Trailer
              </Button>
              <Button
                variant={isOnWatchlist(show.id) ? 'secondary' : 'outline'}
                size="icon"
                onClick={onWatchlistToggle}
                aria-label="Toggle Watchlist"
              >
                <Bookmark
                  className={cn(isOnWatchlist(show.id) && 'fill-current')}
                />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Share">
                    <Share2 />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onShare('Twitter')}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onShare('Facebook')}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({ title: 'Link copied to clipboard!' });
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
