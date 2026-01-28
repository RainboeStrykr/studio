'use client';

import { useWatchlist } from '@/hooks/use-watchlist';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WatchlistShow } from '@/lib/types';

interface WatchlistToggleProps {
    show: WatchlistShow;
}

export function WatchlistToggle({ show }: WatchlistToggleProps) {
    const { addToWatchlist, removeFromWatchlist, isOnWatchlist } = useWatchlist();
    const { toast } = useToast();
    const onList = isOnWatchlist(show.id);

    const handleToggle = () => {
        if (onList) {
            removeFromWatchlist(show.id);
            toast({ title: `Removed "${show.name}" from your watchlist.` });
        } else {
            addToWatchlist(show);
            toast({ title: `Added "${show.name}" to your watchlist.` });
        }
    };

    return (
        <Button
            variant={onList ? 'secondary' : 'outline'}
            size="icon"
            onClick={handleToggle}
            aria-label="Toggle Watchlist"
        >
            <Bookmark className={cn(onList && 'fill-current')} />
        </Button>
    );
}
