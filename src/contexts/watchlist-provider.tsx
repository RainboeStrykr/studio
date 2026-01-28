'use client';

import type React from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';
import type { Show } from '@/lib/types';

interface WatchlistContextType {
  watchlist: Show[];
  addToWatchlist: (show: Show) => void;
  removeFromWatchlist: (showId: string) => void;
  isOnWatchlist: (showId: string) => boolean;
  watchedEpisodes: Record<string, Set<string>>;
  toggleEpisodeWatched: (showId: string, episodeId: string) => void;
  isEpisodeWatched: (showId:string, episodeId: string) => boolean;
  getShowProgress: (showId: string) => number;
}

export const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<Show[]>([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Record<string, Set<string>>>({});

  const addToWatchlist = useCallback((show: Show) => {
    setWatchlist((prev) => {
      if (prev.find((s) => s.id === show.id)) {
        return prev;
      }
      return [...prev, show];
    });
  }, []);

  const removeFromWatchlist = useCallback((showId: string) => {
    setWatchlist((prev) => prev.filter((s) => s.id !== showId));
  }, []);

  const isOnWatchlist = useCallback((showId: string) => {
    return watchlist.some((s) => s.id === showId);
  }, [watchlist]);

  const toggleEpisodeWatched = useCallback((showId: string, episodeId: string) => {
    setWatchedEpisodes(prev => {
        const newWatched = {...prev};
        if (!newWatched[showId]) {
            newWatched[showId] = new Set();
        }
        
        if (newWatched[showId].has(episodeId)) {
            newWatched[showId].delete(episodeId);
        } else {
            newWatched[showId].add(episodeId);
        }

        return newWatched;
    });
  }, []);
  
  const isEpisodeWatched = useCallback((showId: string, episodeId: string) => {
    return !!watchedEpisodes[showId]?.has(episodeId);
  }, [watchedEpisodes]);

  const getShowProgress = useCallback((show: Show) => {
    const totalEpisodes = show.seasons.reduce((acc, season) => acc + season.episodes.length, 0);
    if (totalEpisodes === 0) return 0;
    
    const watchedCount = watchedEpisodes[show.id]?.size || 0;
    return (watchedCount / totalEpisodes) * 100;
  }, [watchedEpisodes]);

  const value = useMemo(
    () => ({
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isOnWatchlist,
      watchedEpisodes,
      toggleEpisodeWatched,
      isEpisodeWatched,
      getShowProgress,
    }),
    [watchlist, addToWatchlist, removeFromWatchlist, isOnWatchlist, watchedEpisodes, toggleEpisodeWatched, isEpisodeWatched, getShowProgress]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}
