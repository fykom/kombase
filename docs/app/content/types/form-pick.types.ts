import type { ElementType, ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { RadioGroup } from '@/components/ui/radio-group';

/**
 * Props accepted by the `FormPick` component.
 */
export interface FormPick<TFieldValues extends FieldValues> {
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
   * Array of options to render as selectable cards.
   * Accepts both `readonly` (e.g. `as const`) and mutable arrays.
   */
  options?: PickOption[];

  /**
   * Optional label rendered above the pick group using `FormLabel`.
   * Omit to render the group without a visible label.
   */
  label?: string | ReactNode;

  /**
   * Additional class names applied to the outermost `FormItem` wrapper.
   * Use this to control spacing, width, etc.
   */
  className?: string;

  /**
   * Props forwarded to the underlying `RadioGroup` (Radix UI primitive).
   * `value` and `onValueChange` are omitted as they are managed internally
   * by React Hook Form.
   */
  radioGroupProps?: Omit<React.ComponentProps<typeof RadioGroup>, 'value' | 'onValueChange'>;

  /**
   * Custom render function for each option card.
   * When provided it **replaces** the default card layout entirely.
   * The wrapping `<Label htmlFor={...}>` is still provided by the component,
   * so you only need to return the inner content.
   */
  renderOption?: (option: PickOption, isSelected: boolean) => ReactNode;

  /**
   * Called **after** `field.onChange` whenever the selected value changes.
   * Use this for side-effects that should not live inside the form schema,
   * such as resetting dependent fields.
   */
  onValueChange?: (value: string) => void;

  /**
   * Layout orientation of the form item.
   * - `vertical`: Label is stacked above the options (default).
   * - `horizontal`: Label is placed side-by-side with the options.
   *
   * @default "vertical"
   */
  layout?: 'vertical' | 'horizontal';

  /**
   * Additional class names applied to the `FormLabel` element.
   * Useful for adjusting the label width in horizontal layout (e.g. `sm:w-1/4`).
   */
  labelClassName?: string;
}

/**
 * Represents a single selectable option in `FormPick`.
 */
export interface PickOption {
  /** The value written into the form field when this option is selected. */
  id: string;
  /** Primary human-readable label displayed on the card. */
  label: string | ReactNode;
  /** Optional secondary label (e.g. a region or category badge). */
  sub?: string;
  /** Optional Lucide icon or any React component rendered inside the card. */
  icon?: ElementType;
}
