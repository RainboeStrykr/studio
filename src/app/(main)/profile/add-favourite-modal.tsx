'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { useWatchlist } from '@/hooks/use-watchlist';
import { searchShows, getShowById } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import type { TMDBShowSummary } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Search, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddFavouriteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddFavouriteModal({ open, onOpenChange }: AddFavouriteModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TMDBShowSummary[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState<number | null>(null);
    const { profile, addFavourite } = useProfile();
    const { addToWatchlist } = useWatchlist();
    const { toast } = useToast();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const results = await searchShows(searchQuery);
            setSearchResults(results.results.slice(0, 12)); // Limit to 12 results
        } catch (error) {
            toast({
                title: 'Search failed',
                description: 'Failed to search shows. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddFavourite = async (showId: number, showName: string) => {
        if (profile && profile.favourites.includes(showId)) {
            toast({
                title: 'Already added',
                description: `${showName} is already in your favourites.`,
            });
            return;
        }

        if (profile && profile.favourites.length >= 5) {
            toast({
                title: 'Limit reached',
                description: 'You can only have 5 favourite shows. Remove one to add another.',
                variant: 'destructive',
            });
            return;
        }

        setIsAdding(showId);

        try {
            // Fetch full show details from TMDB
            const showDetails = await getShowById(String(showId));

            // Add to watchlist first (favourites depend on watchlist)
            addToWatchlist({
                id: String(showDetails.id),
                name: showDetails.name,
                poster_path: showDetails.poster_path,
                first_air_date: showDetails.first_air_date || '',
                vote_average: showDetails.vote_average,
                userId: '', // Will be set by addToWatchlist
            });

            // Then add to favourites
            addFavourite(showId);

            toast({
                title: 'Added to favourites',
                description: `${showName} has been added to your favourites and watchlist.`,
            });

            // Clear search and close modal
            setTimeout(() => {
                setSearchQuery('');
                setSearchResults([]);
                onOpenChange(false);
            }, 500);
        } catch (error) {
            console.error('Error adding favourite:', error);
            toast({
                title: 'Failed to add favourite',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsAdding(null);
        }
    };

    const isAlreadyFavourite = (showId: number) => {
        return profile?.favourites.includes(showId) || false;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add Favourite Show</DialogTitle>
                    <DialogDescription>
                        Search for a show to add to your favourites (max 5).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for shows..."
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" disabled={isSearching}>
                        {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                </form>

                <div className="flex-1 overflow-y-auto mt-4">
                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {searchResults.map((show) => {
                                const isFavourite = isAlreadyFavourite(show.id);
                                const isCurrentlyAdding = isAdding === show.id;
                                const posterUrl = getImageUrl(show.poster_path, 'w300');

                                return (
                                    <div
                                        key={show.id}
                                        className="group relative aspect-[2/3] overflow-hidden rounded-lg border bg-muted"
                                    >
                                        <Image
                                            src={posterUrl}
                                            alt={show.name}
                                            fill
                                            className="object-cover"
                                            unoptimized={posterUrl.includes('placehold.co')}
                                        />

                                        {/* Overlay with add button */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                            <p className="text-white text-sm font-semibold text-center mb-3 line-clamp-2">
                                                {show.name}
                                            </p>
                                            <Button
                                                size="sm"
                                                variant={isFavourite ? 'secondary' : 'default'}
                                                onClick={() => handleAddFavourite(show.id, show.name)}
                                                disabled={isFavourite || isCurrentlyAdding}
                                            >
                                                {isCurrentlyAdding ? (
                                                    'Adding...'
                                                ) : isFavourite ? (
                                                    <>
                                                        <Check className="mr-1 h-3 w-3" />
                                                        Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Add
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Title always visible at bottom */}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                            <p className="text-xs text-white truncate">{show.name}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-muted-foreground">
                            {searchQuery ? 'No results found. Try a different search.' : 'Search for a show to get started.'}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
