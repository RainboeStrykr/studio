'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useProfile } from '@/hooks/use-profile';
import { useWatchlist } from '@/hooks/use-watchlist';
import { Logo } from '@/components/icons';
import { ProfileHeader } from './profile-header';
import { FavouritesGrid } from './favourites-grid';
import { RecentActivity } from './recent-activity';

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { profile, isLoading } = useProfile();
    const { watchlist } = useWatchlist();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.replace('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || isLoading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Logo className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Calculate stats
    const showsWatched = watchlist.length;
    const currentlyWatching = 0; // Simplified - would need episode progress calculation
    const favouritesCount = profile?.favourites.length || 0;

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <ProfileHeader
                user={user}
                bio={profile?.bio}
                stats={{
                    showsWatched,
                    currentlyWatching,
                    favouritesCount,
                }}
            />

            <div className="mt-12 space-y-12">
                <FavouritesGrid />
                <RecentActivity />
            </div>
        </div>
    );
}
