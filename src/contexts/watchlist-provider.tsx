'use client';

import type React from 'react';
import { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { WatchlistShow } from '@/lib/types';

interface WatchlistContextType {
  watchlist: WatchlistShow[];
  addToWatchlist: (show: WatchlistShow) => void;
  removeFromWatchlist: (showId: number) => void;
  isOnWatchlist: (showId: number) => boolean;
  watchedEpisodes: Record<number, Set<number>>;
  toggleEpisodeWatched: (showId: number, episodeId: number) => void;
  isEpisodeWatched: (showId:number, episodeId: number) => boolean;
  getShowProgress: (showId: number, totalEpisodes: number) => number;
}

export const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

const isServer = typeof window === 'undefined';

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistShow[]>(() => {
    if (isServer) return [];
    try {
      const item = window.localStorage.getItem('watchlist');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const [watchedEpisodes, setWatchedEpisodes] = useState<Record<number, Set<number>>>(() => {
    if (isServer) return {};
     try {
      const item = window.localStorage.getItem('watchedEpisodes');
      const parsed = item ? JSON.parse(item) : {};
      Object.keys(parsed).forEach(showId => {
        parsed[showId] = new Set(parsed[showId]);
      });
      return parsed;
    } catch (error) {
      console.error(error);
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error(error);
    }
  }, [watchlist]);

  useEffect(() => {
     try {
        const serializable: Record<string, unknown> = {};
        Object.keys(watchedEpisodes).forEach(showId => {
            const showIdNum = Number(showId);
            serializable[showIdNum] = Array.from(watchedEpisodes[showIdNum]);
        });
        window.localStorage.setItem('watchedEpisodes', JSON.stringify(serializable));
    } catch (error) {
        console.error(error);
    }
  }, [watchedEpisodes]);


  const addToWatchlist = useCallback((show: WatchlistShow) => {
    setWatchlist((prev) => {
      if (prev.find((s) => s.id === show.id)) {
        return prev;
      }
      return [...prev, show];
    });
  }, []);

  const removeFromWatchlist = useCallback((showId: number) => {
    setWatchlist((prev) => prev.filter((s) => s.id !== showId));
  }, []);

  const isOnWatchlist = useCallback((showId: number) => {
    return watchlist.some((s) => s.id === showId);
  }, [watchlist]);

  const toggleEpisodeWatched = useCallback((showId: number, episodeId: number) => {
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
  
  const isEpisodeWatched = useCallback((showId: number, episodeId: number) => {
    return !!watchedEpisodes[showId]?.has(episodeId);
  }, [watchedEpisodes]);

  const getShowProgress = useCallback((showId: number, totalEpisodes: number) => {
    if (totalEpisodes === 0) return 0;
    
    const watchedCount = watchedEpisodes[showId]?.size || 0;
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
