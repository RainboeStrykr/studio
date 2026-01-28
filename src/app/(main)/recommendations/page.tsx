'use client';

import { generateShowRecommendations } from '@/ai/flows/generate-show-recommendations';
import { ShowCard } from '@/components/show-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWatchlist } from '@/hooks/use-watchlist';
import { getShowsByTitle } from '@/lib/tmdb';
import type { TMDBShowSummary } from '@/lib/types';
import { Sparkles, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';

export default function RecommendationsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<TMDBShowSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

   if (isUserLoading || !user) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Logo className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setRecommendations([]);

    if (watchlist.length < 2) {
      toast({
        title: 'Not enough data',
        description:
          'Please add at least two shows to your watchlist for better recommendations.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const viewingHistory = watchlist
        .map((show) => `${show.name} (genre: ${show.genres.join(', ')})`)
        .join(', ');

      const result = await generateShowRecommendations({
        viewingHistory,
        numberOfRecommendations: 4,
      });

      const recommendedShows = await getShowsByTitle(result.recommendations);
      setRecommendations(recommendedShows);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      toast({
        title: 'Something went wrong',
        description: 'Could not generate recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
          For You
        </h1>
        <p className="text-muted-foreground">
          AI-powered recommendations based on your watchlist.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Button onClick={handleGenerate} disabled={isLoading} size="lg">
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? 'Generating...' : 'Generate Recommendations'}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="space-y-2">
                <Skeleton className="h-[300px] md:h-[450px]" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {recommendations.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
          <Bot className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Ready for new shows?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Click the button to generate your personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
