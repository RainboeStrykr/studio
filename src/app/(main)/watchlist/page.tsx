'use client';

import { ShowCard } from '@/components/show-card';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/hooks/use-watchlist';
import { Film } from 'lucide-react';
import Link from 'next/link';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
          My Watchlist
        </h1>
        <p className="text-muted-foreground">
          Shows you want to watch or are currently watching.
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
          <Film className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Your watchlist is empty</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add shows to your watchlist to track them here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Discover Shows</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {watchlist.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </div>
  );
}
