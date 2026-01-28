'use client';

import { ShowCard } from '@/components/show-card';
import { searchShows } from '@/lib/data';
import { useSearchParams } from 'next/navigation';
import { SearchX } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const results = searchShows(query);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="space-y-2 mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
          Search Results
        </h1>
        <p className="text-muted-foreground">
          Showing results for "{query}"
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
            <SearchX className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No results found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                We couldn't find any shows matching your search. Try another keyword.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </div>
  );
}
