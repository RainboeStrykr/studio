'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddFavouriteModal } from './add-favourite-modal';

interface SortablePosterProps {
    id: number;
    posterPath: string | null;
    title: string;
    onRemove: () => void;
}

function SortablePoster({ id, posterPath, title, onRemove }: SortablePosterProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const posterUrl = getImageUrl(posterPath, 'w300');

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group relative aspect-[2/3] overflow-hidden rounded-lg border bg-muted cursor-grab active:cursor-grabbing"
        >
            <Link href={`/shows/${id}`} className="block h-full w-full">
                <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    unoptimized={posterUrl.includes('placehold.co')}
                />
            </Link>

            {/* Remove button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
                <X className="h-4 w-4" />
            </button>

            {/* Title overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-sm font-semibold text-white truncate">{title}</p>
            </div>
        </div>
    );
}

function EmptySlot() {
    return (
        <div className="aspect-[2/3] rounded-lg border-2 border-dashed border-muted bg-muted/50 flex items-center justify-center">
            <div className="text-center p-4">
                <p className="text-xs text-muted-foreground">Empty Slot</p>
            </div>
        </div>
    );
}

export function FavouritesGrid() {
    const { profile, favouriteShows, removeFavourite, reorderFavourites } = useProfile();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = favouriteShows.findIndex((show) => show.id === active.id);
            const newIndex = favouriteShows.findIndex((show) => show.id === over.id);

            const newOrder = arrayMove(favouriteShows, oldIndex, newIndex);
            reorderFavourites(newOrder.map((show) => show.id));
        }
    };

    const favouritesCount = profile?.favourites.length || 0;
    const canAddMore = favouritesCount < 5;
    const emptySlots = 5 - favouritesCount;

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl font-bold">Favourite Shows</h2>
                {canAddMore && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Favourite
                    </Button>
                )}
            </div>

            {favouritesCount === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
                    <p className="text-lg text-muted-foreground">
                        Pick up to 5 shows you love — this is your TV personality.
                    </p>
                    <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Favourite
                    </Button>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={favouriteShows.map((show) => show.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                            {favouriteShows.map((show) => (
                                <SortablePoster
                                    key={show.id}
                                    id={show.id}
                                    posterPath={show.poster_path}
                                    title={show.name}
                                    onRemove={() => removeFavourite(show.id)}
                                />
                            ))}
                            {Array.from({ length: emptySlots }).map((_, i) => (
                                <EmptySlot key={`empty-${i}`} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <AddFavouriteModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </section>
    );
}
