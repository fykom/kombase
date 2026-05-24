import { Rating, RatingItem } from 'kombase';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function RatingControlledDemo() {
  const [rating, setRating] = React.useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-sm">Controlled Rating</h4>
        <Rating onValueChange={setRating} value={rating}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i} />
          ))}
        </Rating>
        <p className="text-muted-foreground text-sm">Current rating: {rating}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setRating(0)} size="sm" variant="outline">
          Clear
        </Button>
        <Button onClick={() => setRating(5)} size="sm" variant="outline">
          Set to 5
        </Button>
      </div>
    </div>
  );
}
