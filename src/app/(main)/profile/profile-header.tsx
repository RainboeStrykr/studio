'use client';

import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User as UserIcon, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';

interface ProfileHeaderProps {
    user: User;
    bio?: string;
    stats: {
        showsWatched: number;
        currentlyWatching: number;
        favouritesCount: number;
    };
}

export function ProfileHeader({ user, bio, stats }: ProfileHeaderProps) {
    const { updateBio } = useProfile();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(bio || '');

    const handleSaveBio = () => {
        updateBio(bioText);
        setIsEditingBio(false);
    };

    const handleCancelBio = () => {
        setBioText(bio || '');
        setIsEditingBio(false);
    };

    const displayName = user.displayName || user.email || 'Anonymous User';
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
                    <AvatarFallback className="text-2xl">
                        {user.photoURL ? <UserIcon /> : initials}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <h1 className="font-headline text-3xl font-bold">{displayName}</h1>

                    {/* Bio Section */}
                    <div className="mt-3">
                        {isEditingBio ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={bioText}
                                    onChange={(e) => setBioText(e.target.value)}
                                    placeholder="Tell us about your TV taste..."
                                    maxLength={120}
                                    className="resize-none"
                                    rows={2}
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {bioText.length}/120 characters
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleCancelBio}
                                        >
                                            <X className="mr-1 h-3 w-3" />
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSaveBio}
                                        >
                                            <Check className="mr-1 h-3 w-3" />
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="group flex items-start gap-2">
                                <p className="text-muted-foreground flex-1">
                                    {bio || 'No bio yet. Click edit to add one.'}
                                </p>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setIsEditingBio(true)}
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mt-6 flex gap-8">
                        <div>
                            <div className="text-2xl font-bold">{stats.showsWatched}</div>
                            <div className="text-sm text-muted-foreground">Shows Watched</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.currentlyWatching}</div>
                            <div className="text-sm text-muted-foreground">Currently Watching</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.favouritesCount}</div>
                            <div className="text-sm text-muted-foreground">Favourites</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
