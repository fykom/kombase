import { zodResolver } from '@hookform/resolvers/zod';
import { gooeyToast } from 'goey-toast';
import { Rating, RatingItem } from 'kombase';
import { Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  rating: z.number().min(1, { message: 'Please select a rating of at least 1 star.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function RatingFormDemo() {
  const form = useForm<FormData>({
    defaultValues: {
      rating: 0,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    gooeyToast.success('Success', {
      description: `Feedback submitted! You rated this ${data.rating} out of 5.`,
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Product Review</FormLabel>
                <FormDescription>
                  Please rate your overall experience with our service.
                </FormDescription>
                <FormControl>
                  <Rating
                    className="gap-1 text-pink-500"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <RatingItem key={i}>
                        <Heart />
                      </RatingItem>
                    ))}
                  </Rating>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Submit Review
          </Button>
        </form>
      </Form>
    </div>
  );
}
