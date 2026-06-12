import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { Textarea } from '@/components/ui/textarea';

/**
 * Props accepted by the `FormTextarea` component.
 */
export interface FormTextarea<TFieldValues extends FieldValues> {
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
   * Optional label rendered above the textarea using a `<Label>` element.
   * Omit to render the field without a visible label.
   */
  label?: string | ReactNode;

  /**
   * When `true`, displays a character count below the textarea.
   * Shows current length or "current/max" format when `maxLength` is provided.
   *
   * @default false
   */
  showCharacterCount?: boolean;

  /**
   * Maximum number of characters allowed in the textarea.
   * When provided with `showCharacterCount`, displays count as "X/Y" format.
   * Also sets the native HTML `maxLength` attribute to enforce the limit.
   */
  maxLength?: number;

  /**
   * Additional props forwarded to the underlying `<Textarea>` component.
   *
   * Form state is internally controlled by React Hook Form, therefore the
   * following props cannot be overridden:
   * - `value`
   * - `onChange`
   *
   * Use this prop for additional native textarea attributes such as:
   * - `placeholder`
   * - `rows`
   * - `disabled`
   * - `maxLength`
   * - `className`
   */
  textareaProps?: Omit<React.ComponentProps<typeof Textarea>, 'value' | 'onChange'>;

  /**
   * Layout orientation of the form item.
   * - `vertical`: Label is stacked above the textarea (default).
   * - `horizontal`: Label is placed side-by-side with the textarea.
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
   * Useful for adjusting the label width in horizontal layout (e.g. `sm:w-1/4`).
   */
  labelClassName?: string;
}
