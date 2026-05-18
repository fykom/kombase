import type React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputField,
} from '@/components/dynamic/phone-input';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormPhoneInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  phoneInputProps?: Omit<
    React.ComponentProps<typeof PhoneInput>,
    keyof React.ComponentProps<'div'>
  >;
  phoneInputCountrySelectProps?: React.ComponentProps<typeof PhoneInputCountrySelect>;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  labelClassName?: string;
  isVisibleCountrySelect?: boolean;
};

export function FormPhoneInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  phoneInputProps,
  phoneInputCountrySelectProps,
  layout = 'vertical',
  className,
  labelClassName,
  isVisibleCountrySelect = true,
}: FormPhoneInputProps<TFieldValues>) {
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
              <PhoneInput {...phoneInputProps}>
                {isVisibleCountrySelect && (
                  <PhoneInputCountrySelect {...phoneInputCountrySelectProps} />
                )}
                <PhoneInputField id={field.name} {...field} />
              </PhoneInput>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
