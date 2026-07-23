import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { goeyToast } from 'goey-toast';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { FormDatePicker } from '@/components/form/form-date-picker';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  date: z.date({
    error: 'Date is required',
  }),

  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function FormDatePickerDemo() {
  const [formLayout, setFormLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const form = useForm<FormData>({
    defaultValues: {
      date: new Date(new Date().getFullYear(), 1, 3),
      dateRange: undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (_data: FormData) => {
    goeyToast.success('Form submitted successfully!', {
      description: (
        <div className="space-y-1">
          <p>
            <strong>Selected Date:</strong> {dayjs(_data.date).format('PPP')}
          </p>

          <p>
            <strong>Selected Date Range:</strong>{' '}
            {`${dayjs(_data.dateRange.from).format('PPP')} - ${dayjs(_data.dateRange.to).format('PPP')}`}
          </p>
        </div>
      ),
    });
  };

  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 1, 12 + i),
  );

  return (
    <div className="flex flex-col items-center w-full max-w-sm space-y-6 mx-auto">
      <div className="flex items-center space-x-1 bg-secondary/60 p-1 rounded-lg w-full">
        <button
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            formLayout === 'vertical'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFormLayout('vertical')}
          type="button"
        >
          Vertical Layout
        </button>
        <button
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            formLayout === 'horizontal'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFormLayout('horizontal')}
          type="button"
        >
          Horizontal Layout
        </button>
      </div>

      <Form {...form}>
        <form className="space-y-6 w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormDatePicker
              control={form.control}
              datePickerProps={{
                captionLayout: 'dropdown',
                defaultMonth: new Date(new Date().getFullYear(), 1, 1),
                disabled: bookedDates,
                mode: 'single',
                modifiers: { booked: bookedDates },
                modifiersClassNames: { booked: '[&>button]:line-through opacity-100' },
              }}
              formatLabel={(value) =>
                value instanceof Date ? dayjs(value).format('PPP') : 'Pick a date'
              }
              label="Date"
              layout={formLayout}
              name="date"
              render={({ label }) => (
                <Button
                  className="w-full justify-between font-normal"
                  type="button"
                  variant="outline"
                >
                  {label}
                </Button>
              )}
            />

            <FormDatePicker
              control={form.control}
              datePickerProps={{
                mode: 'range',
                // numberOfMonths: 2,
              }}
              formatLabel={(value) => {
                const range = value as DateRange | undefined;

                if (!range?.from) {
                  return 'Pick a date range';
                }

                if (!range.to) {
                  return dayjs(range.from).format('PPP');
                }

                return `${dayjs(range.from).format('PPP')} - ${dayjs(range.to).format('PPP')}`;
              }}
              label="Date Range"
              layout={formLayout}
              name="dateRange"
              render={({ label }) => (
                <Button
                  className="w-full justify-between font-normal"
                  type="button"
                  variant="outline"
                >
                  {label}
                </Button>
              )}
            />
          </div>

          <Button className="w-full" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
