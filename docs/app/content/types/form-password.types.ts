import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { PasswordInput } from '@/components/password-input';

/**
 * Props accepted by the `FormInputPassword` component.
 */
export interface FormInputPassword<TFieldValues extends FieldValues> {
  /**
   * The React Hook Form `control` object returned by `useForm`.
   */
  control: Control<TFieldValues>;

  /**
   * Dot-notation path to the field inside the form schema.
   * Fully type-safe — TypeScript will error if the path does not exist.
   */
  name: FieldPath<TFieldValues>;

  /**
   * Optional label rendered above the input using a `<Label>` element.
   * Omit to render the field without a visible label.
   */
  label?: string | ReactNode;

  /**
   * Props forwarded directly to the underlying `<PasswordInput>` element.
   * RHF field props (`value`, `onChange`, `onBlur`, `ref`) are already
   * spread by the component — use this for native attributes like
   * `placeholder`, `disabled`, `autoComplete`, etc.
   */
  inputProps?: React.ComponentProps<typeof PasswordInput>;

  /**
   * Layout orientation of the form item.
   * - `vertical`: Label is stacked above the input (default).
   * - `horizontal`: Label is placed side-by-side with the input.
   *
   * @default "vertical"
   */
  layout?: 'vertical' | 'horizontal';

  /**
   * Additional class names applied to the outermost `FormItem` wrapper.
   */
  className?: string;

  /**
   * Additional class names applied to the `Label` element.
   * Useful for adjusting the label width in horizontal layout.
   */
  labelClassName?: string;
}
