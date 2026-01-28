'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { TMDBShow, Review, TMDBReview } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';
import { StarRating } from '@/components/star-rating';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';
import React from 'react';

interface ReviewsProps {
  show: TMDBShow;
}

const ReviewCard = ({ review }: { review: TMDBReview | Review }) => {
  const isTmdbReview = 'author_details' in review;
  const rating = isTmdbReview ? (review.author_details.rating ? review.author_details.rating / 2 : 0) : review.rating;
  const avatarPath = isTmdbReview ? review.author_details.avatar_path : null;
  
  let avatarUrl = `https://picsum.photos/seed/${review.author}/40/40`;
  if (avatarPath) {
      if (avatarPath.startsWith('/')) {
        avatarUrl = getImageUrl(avatarPath.substring(1), 'w200');
      } else {
        avatarUrl = `https://www.gravatar.com/avatar/${avatarPath}?s=40`;
      }
  }


  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={review.author} />
        <AvatarFallback>
            <User />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
            <p className="font-semibold">{review.author}</p>
            {rating > 0 && <StarRating rating={rating} readOnly />}
        </div>
        <p className="text-muted-foreground mt-2">{review.content}</p>
      </div>
    </div>
  );
};

export function Reviews({ show }: ReviewsProps) {
  const [reviews, setReviews] = useState<(TMDBReview | Review)[]>(show.reviews.results);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newRating === 0 || !newReview) {
        toast({ title: "Incomplete Review", description: "Please provide a rating and a review.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    
    setTimeout(() => {
        const submittedReview: Review = {
            id: `review-${Date.now()}`,
            author: "You",
            avatarUrl: 'avatar-3',
            rating: newRating,
            content: newReview,
        };
        setReviews([submittedReview, ...reviews]);
        setNewReview('');
        setNewRating(0);
        setIsSubmitting(false);
        toast({ title: "Review Submitted!", description: "Thanks for sharing your thoughts." });
    }, 1000);
  };

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
              placeholder="Share your thoughts on the show..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div>
        <h3 className="font-headline text-2xl font-bold mb-4">User Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <React.Fragment key={review.id}>
                <ReviewCard review={review} />
                {index < reviews.length - 1 && <Separator />}
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
