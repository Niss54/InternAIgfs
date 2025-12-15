import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface RatingSystemProps {
  className?: string;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ className }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmitRating = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You need to select at least 1 star to submit your rating.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the rating to your backend
    console.log('Rating submitted:', { rating, comment });
    
    setSubmitted(true);
    toast({
      title: "Thank you for your feedback!",
      description: `You rated us ${rating} star${rating > 1 ? 's' : ''}. We appreciate your input!`,
    });
  };

  const resetRating = () => {
    setRating(0);
    setComment('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Card className={`glass-card max-w-md mx-auto ${className || ''}`}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
            <Star className="w-8 h-8 text-primary-foreground fill-current" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-4">
            Your {rating}-star rating has been submitted successfully.
          </p>
          <Button 
            variant="outline" 
            onClick={resetRating}
            className="btn-secondary-glow"
          >
            Rate Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass-card max-w-md mx-auto ${className || ''}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">
          Rate Your Experience
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          How would you rate InternAI?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Star Rating */}
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="transition-all duration-200 hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-8 h-8 transition-colors duration-200 ${
                  star <= (hoverRating || rating)
                    ? 'text-accent fill-accent'
                    : 'text-muted-foreground/40'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Rating Text */}
        {(rating > 0 || hoverRating > 0) && (
          <p className="text-center text-foreground font-medium">
            {hoverRating || rating} star{(hoverRating || rating) > 1 ? 's' : ''}
          </p>
        )}

        {/* Comment Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Additional Comments (Optional)
          </label>
          <Textarea
            placeholder="Tell us what you think about InternAI..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmitRating}
          className="w-full btn-neon"
          disabled={rating === 0}
        >
          Submit Rating
        </Button>
      </CardContent>
    </Card>
  );
};

export default RatingSystem;