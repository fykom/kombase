import type { ReactNode } from 'react';
import type { Control } from 'react-hook-form';
import type { PhoneInput as PI } from '@/components/phone-input';
import type { Popover, PopoverTrigger } from '@/components/ui/popover';

/**
 * Props for the `PhoneInput` component.
 */
export interface PhoneInput {
  /**
   * Initial phone number value for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Controlled phone number value.
   */
  value?: string;

  /**
   * Called whenever the phone number value changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Initial selected country for uncontrolled usage.
   */
  defaultCountry?: string;

  /**
   * Controlled selected country code.
   */
  country?: string;

  /**
   * Called whenever the selected country changes.
   */
  onCountryChange?: (country: string) => void;

  /**
   * List of available countries displayed in the country selector.
   */
  countries?: Country[];

  /**
   * Native form field name.
   */
  name?: string;

  /**
   * Placeholder text displayed when the input is empty.
   */
  placeholder?: string;

  /**
   * Render the root element as a child component using Radix Slot.
   */
  asChild?: boolean;

  /**
   * Disables the input and prevents user interaction.
   */
  disabled?: boolean;

  /**
   * Makes the input read-only.
   */
  readOnly?: boolean;

  /**
   * Marks the input as required for form validation.
   */
  required?: boolean;

  /**
   * Marks the input as invalid.
   */
  invalid?: boolean;

  /**
   * Whether to display the country flag.
   *
   * @default true
   */
  showFlag?: boolean;
}

/**
 * Props for the `PhoneInputCountrySelect` component.
 *
 * Extends all props from the underlying `Popover` component and
 * exposes selected props from `PopoverTrigger` for controlling
 * trigger behavior and styling.
 */
export interface PhoneInputCountrySelect
  extends React.ComponentProps<typeof Popover>,
    Pick<React.ComponentProps<typeof PopoverTrigger>, 'disabled' | 'className'> {}

/**
 * Props accepted by the `FormPhoneInput` component.
 */
export interface FormPhoneInput {
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
   * Optional label rendered above the input using a `<Label>` element.
   * Omit to render the field without a visible label.
   */
  label?: string | ReactNode;

  /**
   * Props forwarded directly to the underlying `<PhoneInput>` component.
   * RHF field props (`value`, `onValueChange`, `name`) are already
   * controlled by the component — use this for additional phone input
   * configuration like `defaultCountry`, `countries`, `placeholder`,
   * `disabled`, `readOnly`, `required`, `invalid`, `showFlag`, etc.
   */
  phoneInputProps?: Omit<React.ComponentProps<typeof PI>, keyof React.ComponentProps<'div'>>;

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

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag?: string;
}
