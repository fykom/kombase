import type { ReactNode } from 'react';
import type { Control } from 'react-hook-form';
import type { Combobox } from '@/components/ui/combobox';

/**
 * Props accepted by the `FormSearchSelect` component.
 */
export interface FormSearchSelectProps {
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
   * Render function that returns the combobox content.
   * This function is invoked during render and should return the combobox
   * structure including `ComboboxInput`, `ComboboxContent`, `ComboboxList`,
   * and `ComboboxItem` components.
   *
   * @example
   * ```tsx
   * render={() => (
   *   <>
   *     <ComboboxInput placeholder="Search..." />
   *     <ComboboxContent>
   *       <ComboboxList>
   *         <ComboboxItem value="react">React</ComboboxItem>
   *         <ComboboxItem value="vue">Vue</ComboboxItem>
   *       </ComboboxList>
   *     </ComboboxContent>
   *   </>
   * )}
   * ```
   */
  render: () => ReactNode;

  /**
   * Optional label rendered above the combobox using a `<Label>` element.
   * Omit to render the field without a visible label.
   */
  label?: string;

  /**
   * Additional props forwarded to the underlying `Combobox` component.
   *
   * Form state is fully controlled by React Hook Form, therefore the following
   * props are internally managed and cannot be overridden:
   * - `value`
   * - `onValueChange`
   * - `multiple`
   * - `defaultValue`
   *
   * Use this prop for extra configuration such as:
   * - `items`
   * - `disabled`
   * - `placeholder`
   * - `className`
   */
  comboboxProps?: Omit<
    React.ComponentProps<typeof Combobox>,
    'value' | 'onValueChange' | 'multiple' | 'defaultValue'
  >;

  /**
   * Layout orientation of the form item.
   * - `vertical`: Label is stacked above the combobox (default).
   * - `horizontal`: Label is placed side-by-side with the combobox.
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
