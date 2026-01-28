'use client';

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Link as LinkIcon, Share2, Twitter } from "lucide-react";

export function ShareButton() {
    const { toast } = useToast();

    const onShare = (platform: string) => {
        toast({ title: `Shared to ${platform}! (simulation)` });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Share">
                    <Share2 />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onShare('Twitter')}
                    >
                        <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onShare('Facebook')}
                    >
                        <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast({ title: 'Link copied to clipboard!' });
                        }}
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
