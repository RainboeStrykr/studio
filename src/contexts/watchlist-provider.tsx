'use client';

import React, {
  createContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { WatchlistShow, FirestoreEpisodeProgress } from '@/lib/types';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import {
  setDocumentNonBlocking,
  deleteDocumentNonBlocking,
  addDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';

interface WatchlistContextType {
  watchlist: WatchlistShow[];
  addToWatchlist: (show: WatchlistShow) => void;
  removeFromWatchlist: (showId: number) => void;
  isOnWatchlist: (showId: number) => boolean;
  watchedEpisodes: Map<number, Set<number>>;
  toggleEpisodeWatched: (
    showId: number,
    episodeId: number,
    seasonNumber: number
  ) => void;
  isEpisodeWatched: (showId: number, episodeId: number) => boolean;
  getShowProgress: (showId: number, totalEpisodes: number) => number;
  isWatchlistLoading: boolean;
}

export const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();

  // Firestore-backed watchlist
  const watchlistQuery = useMemoFirebase(
    () =>
      user && firestore
        ? collection(firestore, 'users', user.uid, 'watchlist')
        : null,
    [firestore, user]
  );
  const { data: watchlist, isLoading: isWatchlistLoading } =
    useCollection<WatchlistShow>(watchlistQuery);

  // Firestore-backed episode progress
  const progressQuery = useMemoFirebase(
    () =>
      user && firestore
        ? collection(firestore, 'users', user.uid, 'episode_progress')
        : null,
    [firestore, user]
  );
  const { data: episodeProgressDocs } =
    useCollection<FirestoreEpisodeProgress>(progressQuery);

  const [watchedEpisodes, setWatchedEpisodes] = useState(
    new Map<number, Set<number>>()
  );

  useEffect(() => {
    if (episodeProgressDocs) {
      const newWatched = new Map<number, Set<number>>();
      for (const progress of episodeProgressDocs) {
        if (!newWatched.has(progress.tvShowId)) {
          newWatched.set(progress.tvShowId, new Set());
        }
        newWatched.get(progress.tvShowId)!.add(progress.episodeId);
      }
      setWatchedEpisodes(newWatched);
    }
  }, [episodeProgressDocs]);

  const addToWatchlist = useCallback(
    (show: WatchlistShow) => {
      if (!user || !firestore) return;
      const showWithUser = { ...show, userId: user.uid };
      const docRef = doc(
        firestore,
        'users',
        user.uid,
        'watchlist',
        String(show.id)
      );
      setDocumentNonBlocking(docRef, showWithUser, { merge: true });
    },
    [user, firestore]
  );

  const removeFromWatchlist = useCallback(
    (showId: number) => {
      if (!user || !firestore) return;
      const docRef = doc(
        firestore,
        'users',
        user.uid,
        'watchlist',
        String(showId)
      );
      deleteDocumentNonBlocking(docRef);
    },
    [user, firestore]
  );

  const isOnWatchlist = useCallback(
    (showId: number) => {
      return !!watchlist?.some((s) => s.id === showId);
    },
    [watchlist]
  );

  const toggleEpisodeWatched = useCallback(
    async (showId: number, episodeId: number, seasonNumber: number) => {
      if (!user || !firestore) return;

      const progressColRef = collection(
        firestore,
        'users',
        user.uid,
        'episode_progress'
      );
      const isWatched = watchedEpisodes.get(showId)?.has(episodeId);

      if (isWatched) {
        // Find and delete the document
        const q = query(
          progressColRef,
          where('userId', '==', user.uid),
          where('episodeId', '==', episodeId)
        );
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(firestore);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit().catch(console.error);
      } else {
        // Add a new document
        const newProgress: FirestoreEpisodeProgress = {
          userId: user.uid,
          tvShowId: showId,
          episodeId,
          seasonNumber,
          watchedDate: new Date().toISOString(),
        };
        addDocumentNonBlocking(progressColRef, newProgress);
      }
    },
    [user, firestore, watchedEpisodes]
  );

  const isEpisodeWatched = useCallback(
    (showId: number, episodeId: number) => {
      return !!watchedEpisodes.get(showId)?.has(episodeId);
    },
    [watchedEpisodes]
  );

  const getShowProgress = useCallback(
    (showId: number, totalEpisodes: number) => {
      if (totalEpisodes === 0) return 0;
      const watchedCount = watchedEpisodes.get(showId)?.size || 0;
      return (watchedCount / totalEpisodes) * 100;
    },
    [watchedEpisodes]
  );

  const value = useMemo(
    () => ({
      watchlist: watchlist || [],
      addToWatchlist,
      removeFromWatchlist,
      isOnWatchlist,
      watchedEpisodes,
      toggleEpisodeWatched,
      isEpisodeWatched,
      getShowProgress,
      isWatchlistLoading,
    }),
    [
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isOnWatchlist,
      watchedEpisodes,
      toggleEpisodeWatched,
      isEpisodeWatched,
      getShowProgress,
      isWatchlistLoading,
    ]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}
