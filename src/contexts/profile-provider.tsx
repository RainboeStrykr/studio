'use client';

import React, {
    createContext,
    useMemo,
    useCallback,
    useEffect,
    useState,
    useRef,
} from 'react';
import type { UserProfile, RecentActivity, WatchlistShow, TMDBShowSummary } from '@/lib/types';
import {
    useUser,
    useFirestore,
    useDoc,
    useMemoFirebase,
} from '@/firebase';
import { doc } from 'firebase/firestore';
import {
    setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { useWatchlist } from '@/hooks/use-watchlist';

interface ProfileContextType {
    profile: UserProfile | null;
    favouriteShows: TMDBShowSummary[];
    recentActivity: RecentActivity[];
    isLoading: boolean;
    addFavourite: (showId: number) => void;
    removeFavourite: (showId: number) => void;
    reorderFavourites: (newOrder: number[]) => void;
    updateBio: (bio: string) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
    undefined
);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { watchlist, watchedEpisodes } = useWatchlist();
    const hasInitialized = useRef(false);

    // Firestore-backed profile
    const profileDocRef = useMemoFirebase(
        () =>
            user && firestore
                ? doc(firestore, 'users', user.uid, 'profile', 'info')
                : null,
        [firestore, user]
    );

    const { data: profile, isLoading: isProfileLoading } =
        useDoc<UserProfile>(profileDocRef);

    const [favouriteShows, setFavouriteShows] = useState<TMDBShowSummary[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

    // Initialize profile if it doesn't exist (only once per user session)
    useEffect(() => {
        if (user && firestore && !isProfileLoading && !profile && !hasInitialized.current) {
            console.log('Initializing profile for user:', user.uid);
            hasInitialized.current = true;
            const docRef = doc(firestore, 'users', user.uid, 'profile', 'info');
            const initialProfile: UserProfile = {
                favourites: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setDocumentNonBlocking(docRef, initialProfile, { merge: true });
        }

        // Reset initialization flag when user changes
        if (!user) {
            hasInitialized.current = false;
        }
    }, [user, firestore, profile, isProfileLoading]);

    // Log profile changes
    useEffect(() => {
        if (profile) {
            console.log('Profile loaded:', profile);
        }
    }, [profile]);

    // Fetch favourite shows from TMDB
    useEffect(() => {
        if (!profile?.favourites || profile.favourites.length === 0) {
            setFavouriteShows([]);
            return;
        }

        console.log('Fetching favourites from watchlist. Favourites IDs:', profile.favourites);
        console.log('Watchlist:', watchlist.map(w => ({ id: w.id, name: w.name })));

        // Get show details from watchlist first (they're already there with full data)
        const favouriteShowsFromWatchlist = profile.favourites
            .map(favId => watchlist.find(w => Number(w.id) === favId))
            .filter((show): show is WatchlistShow => show !== undefined);

        console.log('Found in watchlist:', favouriteShowsFromWatchlist.map(s => s.name));

        // Convert WatchlistShows to TMDBShowSummary format
        const converted: TMDBShowSummary[] = favouriteShowsFromWatchlist.map(show => ({
            id: Number(show.id),
            name: show.name,
            poster_path: show.poster_path,
            first_air_date: show.first_air_date,
            vote_average: show.vote_average,
            backdrop_path: null,
            overview: '',
            genre_ids: [],
        }));

        // Maintain the order from favourites array
        const orderedShows = profile.favourites
            .map(favId => converted.find(s => s.id === favId))
            .filter((show): show is TMDBShowSummary => show !== undefined);

        setFavouriteShows(orderedShows);
    }, [profile?.favourites, watchlist]);

    // Calculate recent activity from episode progress
    useEffect(() => {
        if (!watchlist || watchlist.length === 0) {
            setRecentActivity([]);
            return;
        }

        const activityMap = new Map<number, { lastWatched: string; episodeCount: number }>();

        // Build activity map from watched episodes
        watchedEpisodes.forEach((episodes, showId) => {
            const episodeCount = episodes.size;
            activityMap.set(showId, {
                lastWatched: new Date().toISOString(),
                episodeCount,
            });
        });

        // Build recent activity array
        const activities: RecentActivity[] = [];
        watchlist.forEach(show => {
            const showId = Number(show.id);
            const activity = activityMap.get(showId);

            if (activity && activity.episodeCount > 0) {
                activities.push({
                    show,
                    status: 'WATCHING',
                    updatedAt: activity.lastWatched,
                });
            }
        });

        activities.sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setRecentActivity(activities.slice(0, 15));
    }, [watchlist, watchedEpisodes]);

    const addFavourite = useCallback(
        (showId: number) => {
            if (!user || !firestore || !profile) {
                console.error('addFavourite: Missing dependencies', {
                    user: !!user,
                    firestore: !!firestore,
                    profile: !!profile
                });
                return;
            }

            if (profile.favourites.length >= 5) {
                console.warn('addFavourite: Max limit reached');
                return;
            }

            if (profile.favourites.includes(showId)) {
                console.warn('addFavourite: Already in favourites');
                return;
            }

            const updatedFavourites = [...profile.favourites, showId];
            const docRef = doc(firestore, 'users', user.uid, 'profile', 'info');

            console.log('addFavourite: Saving to Firestore', {
                path: `users/${user.uid}/profile/info`,
                showId,
                updatedFavourites
            });

            setDocumentNonBlocking(docRef, {
                ...profile,
                favourites: updatedFavourites,
                updatedAt: new Date().toISOString(),
            }, { merge: true });
        },
        [user, firestore, profile]
    );

    const removeFavourite = useCallback(
        (showId: number) => {
            if (!user || !firestore || !profile) return;

            const updatedFavourites = profile.favourites.filter(id => id !== showId);
            const docRef = doc(firestore, 'users', user.uid, 'profile', 'info');
            setDocumentNonBlocking(docRef, {
                ...profile,
                favourites: updatedFavourites,
                updatedAt: new Date().toISOString(),
            }, { merge: true });
        },
        [user, firestore, profile]
    );

    const reorderFavourites = useCallback(
        (newOrder: number[]) => {
            if (!user || !firestore || !profile) return;

            const docRef = doc(firestore, 'users', user.uid, 'profile', 'info');
            setDocumentNonBlocking(docRef, {
                ...profile,
                favourites: newOrder,
                updatedAt: new Date().toISOString(),
            }, { merge: true });
        },
        [user, firestore, profile]
    );

    const updateBio = useCallback(
        (bio: string) => {
            if (!user || !firestore || !profile) return;

            const truncatedBio = bio.slice(0, 120);
            const docRef = doc(firestore, 'users', user.uid, 'profile', 'info');
            setDocumentNonBlocking(docRef, {
                ...profile,
                bio: truncatedBio,
                updatedAt: new Date().toISOString(),
            }, { merge: true });
        },
        [user, firestore, profile]
    );

    const value = useMemo(
        () => ({
            profile: profile || null,
            favouriteShows,
            recentActivity,
            isLoading: isProfileLoading,
            addFavourite,
            removeFavourite,
            reorderFavourites,
            updateBio,
        }),
        [
            profile,
            favouriteShows,
            recentActivity,
            isProfileLoading,
            addFavourite,
            removeFavourite,
            reorderFavourites,
            updateBio,
        ]
    );

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}
