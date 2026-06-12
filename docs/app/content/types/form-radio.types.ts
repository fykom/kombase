import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { RadioGroup } from '@/components/ui/radio-group';

/**
 * Props accepted by the `FormRadio` component.
 */
export interface FormRadio<TFieldValues extends FieldValues> {
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
   * Array of options to render as radio items.
   */
  options?: RadioOption[];

  /**
   * Optional label rendered above or to the side of the radio group.
   */
  label?: string | ReactNode;

  /**
   * Additional class names applied to the outermost `FormItem` wrapper.
   */
  className?: string;

  /**
   * Props forwarded to the underlying `RadioGroup` (Radix UI primitive).
   */
  radioGroupProps?: Omit<React.ComponentProps<typeof RadioGroup>, 'value' | 'onValueChange'>;

  /**
   * Called **after** `field.onChange` whenever the selected value changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Layout orientation of the form item (stacked or side-by-side with label).
   * - `vertical`: Label is stacked above the options (default).
   * - `horizontal`: Label is placed side-by-side with the options.
   *
   * @default "vertical"
   */
  layout?: 'vertical' | 'horizontal';

  /**
   * Additional class names applied to the `FormLabel` element.
   */
  labelClassName?: string;

  /**
   * Layout orientation of the options inside the radio group.
   * - `vertical`: Options are stacked in a column.
   * - `horizontal`: Options are placed in a row.
   *
   * @default "vertical"
   */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Represents a single selectable option in `FormRadio`.
 */
export interface RadioOption {
  /** The value written into the form field when this option is selected. */
  id: string;
  /** Human-readable label displayed next to the radio button. */
  label: string | ReactNode;
  /** Optional secondary description displayed under the label. */
  description?: string;
}
