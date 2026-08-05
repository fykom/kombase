import type React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string | React.ReactNode;
  inputProps?: React.ComponentProps<typeof Input>;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  labelClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  inputProps,
  layout = 'vertical',
  className,
  labelClassName,
  prefix,
  suffix,
}: FormInputProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
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
              <div className="flex w-full overflow-hidden rounded-md border border-input bg-background">
                {prefix && (
                  <div className="flex items-center border-r text-muted-foreground">{prefix}</div>
                )}

                <Input
                  id={field.name}
                  {...field}
                  {...inputProps}
                  className={cn('border-0 shadow-none focus-visible:ring-0', inputProps?.className)}
                />

                {suffix && (
                  <div className="flex items-center border-l text-muted-foreground">{suffix}</div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
