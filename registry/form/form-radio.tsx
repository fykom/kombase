import type * as React from 'react';
import type { ComponentProps } from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export type RadioOption<TValue extends string = string> = {
  id: TValue;
  label: string | React.ReactNode;
  description?: string;
};

export type FormRadioProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  options?: readonly RadioOption<FieldPathValue<TFieldValues, FieldPath<TFieldValues>> & string>[];
  label?: string | React.ReactNode;
  className?: string;
  radioGroupProps?: Omit<ComponentProps<typeof RadioGroup>, 'value' | 'onValueChange'>;
  onValueChange?: (value: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>) => void;
  layout?: 'vertical' | 'horizontal';
  labelClassName?: string;
  orientation?: 'vertical' | 'horizontal';
};

export function FormRadio<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  options,
  className,
  radioGroupProps,
  onValueChange,
  layout = 'vertical',
  labelClassName,
  orientation = 'vertical',
}: FormRadioProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
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
              className={cn(layout === 'horizontal' && 'sm:w-1/3 sm:shrink-0', labelClassName)}
              htmlFor={field.name}
            >
              {label}
            </Label>
          )}

          <div className="flex-1 w-full space-y-1.5">
            <FormControl>
              <RadioGroup
                {...radioGroupProps}
                className={cn(
                  orientation === 'horizontal'
                    ? 'flex flex-row flex-wrap gap-4'
                    : 'flex flex-col gap-3',
                  radioGroupProps?.className,
                )}
                onValueChange={(val) => {
                  field.onChange(val);
                  onValueChange?.(val as FieldPathValue<TFieldValues, TName>);
                }}
                value={field.value as string}
              >
                {options?.map((opt) => {
                  const optionId = `${name}-${opt.id}`;
                  const hasDescription = !!opt.description;
                  return (
                    <div
                      className={cn(
                        'flex gap-2.5',
                        hasDescription ? 'items-start' : 'items-center',
                      )}
                      key={opt.id}
                    >
                      <RadioGroupItem
                        className={cn(hasDescription && 'mt-0.5')}
                        id={optionId}
                        value={opt.id}
                      />
                      <Label
                        className="text-sm leading-none cursor-pointer text-foreground/90 hover:text-foreground selection:bg-transparent font-normal"
                        htmlFor={optionId}
                      >
                        {opt.label}
                        {opt.description && (
                          <span className="block text-xs font-normal text-muted-foreground mt-1">
                            {opt.description}
                          </span>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
