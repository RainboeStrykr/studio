import { ShowCard } from '@/components/show-card';
import { shows } from '@/lib/data';

export default function DiscoverPage() {
  const popularShows = shows.slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
          Discover Shows
        </h1>
        <p className="text-muted-foreground">
          Browse popular shows and find your next obsession.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {popularShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}
