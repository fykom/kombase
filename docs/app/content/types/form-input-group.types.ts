import type { ReactNode } from 'react';
import type { Control } from 'react-hook-form';
import type { InputGroupInput } from '@/components/ui/input-group';

/**
 * Props accepted by the `FormInputGroup` component.
 */
export interface FormInputGroupProps {
  /**
   * The React Hook Form `control` object returned by `useForm`.
   */
  control: Control;

  /**
   * Dot-notation path to the field inside the form schema.
   * Fully type-safe — TypeScript will error if the path does not exist.
   */
  name: string;

  /**
   * Optional label rendered above the input group using a `<Label>` element.
   * Omit to render the field without a visible label.
   */
  label?: string;

  /**
   * Content rendered inside the right-side addon of the input group.
   * Accepts any React node — typically a currency symbol, unit, or icon.
   * When omitted, no addon is rendered.
   */
  addon?: ReactNode;

  /**
   * Props forwarded to the underlying `<InputGroupInput>` element.
   * RHF field props (`value`, `onChange`, `onBlur`, `ref`) are already
   * spread by the component.
   */
  inputGroupProps?: React.ComponentProps<typeof InputGroupInput>;

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
   * Useful for adjusting the label width in horizontal layout (e.g. `sm:w-1/4`).
   */
  labelClassName?: string;
}
