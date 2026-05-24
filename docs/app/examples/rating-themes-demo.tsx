import { Rating, RatingItem } from 'kombase';
import { Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  {
    className: 'text-yellow-500',
    description: 'Premium gold stars',
    icon: Star,
    label: 'Gold',
    value: 5,
  },
  {
    className: 'text-pink-500',
    description: 'Love & favorites',
    icon: Heart,
    label: 'Heart',
    value: 3,
  },
];

export default function RatingThemesDemo() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      {themes.map((theme) => (
        <div
          className="flex flex-1 flex-col items-center gap-3 rounded-lg border p-4 min-w-37.5"
          key={theme.label}
        >
          <h4 className="font-medium text-sm">{theme.label}</h4>

          <Rating className={cn('gap-1', theme.className)} defaultValue={theme.value}>
            {Array.from({ length: 5 }, (_, i) => (
              <RatingItem key={i}>
                <theme.icon />
              </RatingItem>
            ))}
          </Rating>
          <p className="text-muted-foreground text-xs text-center">{theme.description}</p>
        </div>
      ))}
    </div>
  );
}
