'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { TMDBShow, Review as ReviewType } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';
import { StarRating } from '@/components/star-rating';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon } from 'lucide-react';
import React from 'react';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase';
import { collection } from 'firebase/firestore';

interface ReviewsProps {
  show: TMDBShow;
}

const ReviewCard = ({ review }: { review: ReviewType }) => {
  const avatarUrl =
    review.avatarUrl || `https://picsum.photos/seed/${review.author}/40/40`;

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={review.author} />
        <AvatarFallback>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{review.author}</p>
          <StarRating rating={review.rating} readOnly />
        </div>
        <p className="text-muted-foreground mt-2">{review.content}</p>
      </div>
    </div>
  );
};

export function Reviews({ show }: ReviewsProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const reviewsQuery = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, 'tv_shows', String(show.id), 'reviews')
        : null,
    [firestore, show.id]
  );
  const { data: firestoreReviews, isLoading } = useCollection<ReviewType>(reviewsQuery);

  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to leave a review.',
        variant: 'destructive',
      });
      return;
    }
    if (newRating === 0 || !newReview) {
      toast({
        title: 'Incomplete Review',
        description: 'Please provide a rating and a review.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    const reviewToSubmit: ReviewType = {
      userId: user.uid,
      tvShowId: show.id,
      author: user.displayName || user.email || 'Anonymous',
      avatarUrl: user.photoURL || undefined,
      rating: newRating,
      content: newReview,
      reviewDate: new Date().toISOString(),
    };

    const reviewsColRef = collection(firestore, 'tv_shows', String(show.id), 'reviews');
    addDocumentNonBlocking(reviewsColRef, reviewToSubmit);

    setNewReview('');
    setNewRating(0);
    setIsSubmitting(false);
    toast({
      title: 'Review Submitted!',
      description: 'Thanks for sharing your thoughts.',
    });
  };

  const allReviews = useMemo(() => {
    const tmdbReviews: ReviewType[] = show.reviews.results.map(r => ({
      id: r.id,
      author: r.author,
      content: r.content,
      rating: (r.author_details.rating || 0) / 2,
      reviewDate: 'N/A', // TMDB doesn't provide this
      tvShowId: show.id,
      userId: 'tmdb',
      avatarUrl: r.author_details.avatar_path ? getImageUrl(r.author_details.avatar_path, 'w200') : undefined,
    }));
    return [...(firestoreReviews || []), ...tmdbReviews];
  }, [firestoreReviews, show.reviews.results, show.id]);


  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-headline text-2xl font-bold mb-4">Leave a Review</h3>
        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <p className="font-medium">Your Rating:</p>
              <StarRating rating={newRating} onRatingChange={setNewRating} />
            </div>
            <Textarea
              placeholder={user ? "Share your thoughts on the show..." : "Please log in to leave a review."}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              disabled={!user || isSubmitting}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!user || isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div>
        <h3 className="font-headline text-2xl font-bold mb-4">User Reviews</h3>
        {isLoading ? (
            <p>Loading reviews...</p>
        ) : allReviews.length > 0 ? (
          <div className="space-y-6">
            {allReviews.map((review, index) => (
              <React.Fragment key={review.id || index}>
                <ReviewCard review={review} />
                {index < allReviews.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Be the first to review this show.
          </p>
        )}
      </div>
    </div>
  );
}
