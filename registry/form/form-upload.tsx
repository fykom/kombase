import type React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FileUpload, type FileUploadProps } from '@/components/ui/file-upload';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormUploadProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string | React.ReactNode;
  uploadProps?: Omit<FileUploadProps, 'value' | 'onValueChange' | 'children'>;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  labelClassName?: string;
  children?: React.ReactNode;
};

export function FormUpload<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  uploadProps,
  layout = 'vertical',
  className,
  labelClassName,
  children,
}: FormUploadProps<TFieldValues>) {
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
              <FileUpload
                disabled={field.disabled}
                id={field.name}
                onValueChange={field.onChange}
                value={field.value}
                {...uploadProps}
              >
                {children}
              </FileUpload>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
