'use client';

import { useProfile } from '@/hooks/use-profile';
import { Badge } from '@/components/ui/badge';
import { Film } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';

export function RecentActivity() {
    const { recentActivity } = useProfile();

    if (recentActivity.length === 0) {
        return (
            <section>
                <h2 className="font-headline text-2xl font-bold mb-6">Recent Activity</h2>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
                    <Film className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No activity yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Start watching and logging shows!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <h2 className="font-headline text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
                {recentActivity.map((activity) => {
                    const posterUrl = getImageUrl(activity.show.poster_path, 'w200');

                    return (
                        <Link
                            key={activity.show.id}
                            href={`/shows/${activity.show.id}`}
                            className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                        >
                            <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded">
                                <Image
                                    src={posterUrl}
                                    alt={activity.show.name}
                                    fill
                                    className="object-cover"
                                    unoptimized={posterUrl.includes('placehold.co')}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{activity.show.name}</h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <Badge
                                        variant={activity.status === 'WATCHING' ? 'default' : 'secondary'}
                                    >
                                        {activity.status === 'WATCHING' ? 'Currently Watching' : 'Recently Watched'}
                                    </Badge>
                                    {activity.lastEpisode && (
                                        <span className="text-sm text-muted-foreground">
                                            S{activity.lastEpisode.seasonNumber}E{activity.lastEpisode.episodeNumber}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {new Date(activity.updatedAt).toLocaleDateString()}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
