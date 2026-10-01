import type React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type FormTextareaProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string | React.ReactNode;
  showCharacterCount?: boolean;
  maxLength?: number;
  textareaProps?: Omit<React.ComponentProps<typeof Textarea>, 'value' | 'onChange'>;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  labelClassName?: string;
};

export function FormTextarea<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  showCharacterCount = false,
  maxLength,
  textareaProps,
  layout = 'vertical',
  className,
  labelClassName,
}: FormTextareaProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const currentLength = field.value?.length || 0;
        const isExceeded = maxLength !== undefined && currentLength > maxLength;

        return (
          <FormItem
            className={cn(
              layout === 'horizontal'
                ? 'flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 space-y-0'
                : 'space-y-2',
              className,
            )}
          >
            {label && (
              <Label
                className={cn(
                  layout === 'horizontal' && 'sm:w-1/3 sm:shrink-0 sm:pt-2',
                  labelClassName,
                )}
                htmlFor={field.name}
              >
                {label}
              </Label>
            )}
            <div className="flex-1 w-full space-y-1.5">
              <FormControl>
                <Textarea
                  id={field.name}
                  {...field}
                  {...textareaProps}
                  maxLength={maxLength}
                  value={field.value || ''}
                />
              </FormControl>
              {showCharacterCount && (
                <div
                  className={cn(
                    'text-xs text-right',
                    isExceeded ? 'text-destructive' : 'text-muted-foreground',
                  )}
                >
                  {maxLength !== undefined ? `${currentLength}/${maxLength}` : currentLength}
                </div>
              )}
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
}
