'use client';

import { useContext } from 'react';
import { WatchlistContext } from '@/contexts/watchlist-provider';

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
