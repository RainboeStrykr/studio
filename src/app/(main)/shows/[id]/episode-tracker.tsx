'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useWatchlist } from '@/hooks/use-watchlist';
import type { Show } from '@/lib/types';
import { useEffect, useState } from 'react';


interface EpisodeTrackerProps {
    show: Show;
}

export function EpisodeTracker({ show }: EpisodeTrackerProps) {
  const { toggleEpisodeWatched, isEpisodeWatched, getShowProgress } = useWatchlist();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(getShowProgress(show));
  }, [getShowProgress, show]);

  if (show.seasons.length === 0) {
    return (
        <p className="text-muted-foreground">Episode information coming soon.</p>
    )
  }

  return (
    <div className="space-y-4">
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-bold">{Math.round(progress)}%</span>
            </div>
             <Progress value={progress} className="h-2" />
        </div>
        
        <Accordion type="single" collapsible defaultValue="season-1">
        {show.seasons.map((season) => (
          <AccordionItem key={season.id} value={`season-${season.seasonNumber}`}>
            <AccordionTrigger className="font-bold text-lg">
              Season {season.seasonNumber}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 pt-2">
                {season.episodes.map((episode) => (
                  <div key={episode.id} className="flex items-start gap-4 p-2 rounded-md transition-colors hover:bg-muted/50">
                     <Checkbox
                        id={`episode-${episode.id}`}
                        checked={isEpisodeWatched(show.id, episode.id)}
                        onCheckedChange={() => toggleEpisodeWatched(show.id, episode.id)}
                        className="mt-1"
                      />
                    <div className="grid gap-1.5">
                      <label htmlFor={`episode-${episode.id}`} className="font-semibold cursor-pointer">
                        {episode.episodeNumber}. {episode.title}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {episode.synopsis}
                      </p>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>Aired: {episode.airDate}</span>
                          <span>&bull;</span>
                          <span>{episode.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        </Accordion>
    </div>
  )
}