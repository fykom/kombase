import type React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Combobox, useComboboxAnchor } from '@/components/ui/combobox';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormSearchSelectProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  multiple?: boolean;
  label?: string;
  comboboxProps?: Omit<
    React.ComponentProps<typeof Combobox>,
    'value' | 'onValueChange' | 'multiple' | 'defaultValue'
  >;
  render: (props: { anchor: ReturnType<typeof useComboboxAnchor> }) => React.ReactNode;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  labelClassName?: string;
};

export function FormSearchSelect<TFieldValues extends FieldValues>({
  control,
  name,
  render,
  label,
  comboboxProps,
  layout = 'vertical',
  className,
  labelClassName,
  multiple = false,
}: FormSearchSelectProps<TFieldValues>) {
  const anchor = useComboboxAnchor();

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
              <Combobox
                id={field.name}
                multiple={multiple}
                onValueChange={field.onChange}
                value={field.value}
                {...comboboxProps}
              >
                {render({ anchor })}
              </Combobox>
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
