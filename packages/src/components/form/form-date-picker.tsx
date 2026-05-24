import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import type { DateRange } from 'react-day-picker';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type BaseProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  layout?: 'vertical' | 'horizontal';
  formatLabel: (value?: Date | DateRange) => string;
  className?: string;
  labelClassName?: string;
  render: (params: { label: string; value?: Date | DateRange }) => React.ReactElement<{
    children?: React.ReactNode;
    className?: string;
  }>;
};

type CalendarProps = React.ComponentProps<typeof Calendar>;

type DatePickerProps<TFieldValues extends FieldValues> = BaseProps<TFieldValues> & {
  datePickerProps: CalendarProps;
};

type FormDatePickerProps<TFieldValues extends FieldValues> = DatePickerProps<TFieldValues>;

export function FormDatePicker<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  datePickerProps,
  layout = 'vertical',
  className,
  labelClassName,
  formatLabel,
  render,
}: FormDatePickerProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isRange = datePickerProps?.mode === 'range';

        const rangeValue = field.value as DateRange | undefined;

        const singleValue = field.value as Date | undefined;

        const currentValue = isRange ? rangeValue : singleValue;

        const defaultLabel = isRange
          ? rangeValue?.from
            ? rangeValue.to
              ? `${dayjs(rangeValue.from).format('PPP')} - ${dayjs(rangeValue.to).format('PPP')}`
              : dayjs(rangeValue.from).format('PPP')
            : 'Pick a date range'
          : singleValue
            ? dayjs(singleValue).format('PPP')
            : 'Pick a date';

        const text = formatLabel?.(field.value) ?? defaultLabel;

        const trigger = render({
          label: text,
          value: currentValue,
        });

        return (
          <FormItem
            className={cn(
              layout === 'horizontal'
                ? 'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 space-y-0'
                : 'space-y-2',
              className,
            )}
          >
            {label && (
              <Label
                className={cn(layout === 'horizontal' && 'sm:w-1/3 sm:shrink-0', labelClassName)}
                htmlFor={field.name}
              >
                {label}
              </Label>
            )}
            <div className="flex-1 w-full space-y-1.5">
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    {React.cloneElement(trigger, {
                      children: (
                        <div className="flex items-center justify-between w-full">
                          <span>{trigger.props.children}</span>

                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </div>
                      ),
                    })}
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      {...({
                        id: field.name,
                        ...datePickerProps,
                        onSelect: field.onChange,
                        selected: field.value,
                      } as any)}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
}
