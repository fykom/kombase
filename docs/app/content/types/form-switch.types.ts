import type { ComponentProps } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Props accepted by the `FormSwitch` component.
 */
export interface FormSwitch<TFieldValues extends FieldValues> {
  /**
   * The React Hook Form `control` object returned by `useForm`.
   */
  control: Control<TFieldValues>;

  /**
   * Dot-notation path to the boolean field inside the form schema.
   * Fully type-safe — TypeScript will error if the path does not exist.
   */
  name: FieldPath<TFieldValues>;

  /**
   * Primary label shown next to the switch.
   * In `"inline"` layout this appears on the left side.
   * In `"default"` layout this appears above the switch.
   */
  label?: string;

  /**
   * Optional secondary description rendered below the label.
   * Only visible in `"inline"` layout.
   */
  description?: string;

  /**
   * Controls the visual layout of the component.
   *
   * - `"default"` _(default)_ — label stacked above the switch, similar to other form fields.
   * - `"inline"` — label + description on the left, switch on the right inside a card-like row.
   *
   * @default "default"
   */
  layout?: 'default' | 'inline';

  /**
   * Additional class names applied to the outermost `FormItem` wrapper.
   */
  className?: string;

  /**
   * Additional class names applied to the `Label` element.
   * Useful for adjusting the label width in inline layout (e.g. `sm:w-1/4`).
   */
  labelClassName?: string;

  /**
   * Props forwarded to the underlying `<Switch>` element.
   * `checked` and `onCheckedChange` are managed internally by React Hook Form.
   */
  switchProps?: ComponentProps<'button'>;
}
