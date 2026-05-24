export type Direction = 'ltr' | 'rtl';
export type Orientation = 'horizontal' | 'vertical';
export type ActivationMode = 'automatic' | 'manual';
export type Size = 'default' | 'sm' | 'lg';
export type Step = 0.5 | 1;
export type DataState = 'full' | 'partial' | 'empty';

export interface Rating {
  /**
   * The controlled value of the rating.
   */
  value?: number;

  /**
   * The default value of the rating when uncontrolled.
   *
   * @default 0
   */
  defaultValue?: number;

  /**
   * Event handler called when the rating value changes.
   */
  onValueChange?: (value: number) => void;

  /**
   * Event handler called when a rating item is hovered or unhovered.
   */
  onHover?: (value: number | null) => void;

  /**
   * The maximum rating score (number of rating items).
   *
   * @default 5
   */
  max?: number;

  /**
   * The activation mode of items when navigating via keyboard.
   *
   * - `"automatic"` — selection changes automatically when item is focused.
   * - `"manual"` — selection changes only when items are clicked or Space/Enter is pressed.
   *
   * @default "automatic"
   */
  activationMode?: ActivationMode;

  /**
   * The text direction of the component.
   */
  dir?: Direction;

  /**
   * The orientation of the rating group.
   *
   * @default "horizontal"
   */
  orientation?: Orientation;

  /**
   * The size of the rating items.
   *
   * @default "default"
   */
  size?: Size;

  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;

  /**
   * The step value for incrementing/decrementing selection. Use `0.5` for half-star ratings.
   *
   * @default 1
   */
  step?: Step;

  /**
   * Whether the rating can be cleared by clicking the currently selected value again.
   *
   * @default false
   */
  clearable?: boolean;

  /**
   * Prevents interaction and dims the component.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Prevents changes to the value but maintains keyboard focusability.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Whether selection is required before submitting a form.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The name attribute for form submission (creates a visually hidden input).
   */
  name?: string;
}

export interface RatingItem {
  /**
   * The zero-based index of this rating item. If not provided, it is assigned automatically.
   */
  index?: number;

  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;

  /**
   * The content to render inside the item.
   * Can be a function receiving the current state (`"full" | "partial" | "empty"`) for advanced customization.
   *
   * @default <Star />
   */
  children?: React.ReactNode | ((dataState: DataState) => React.ReactNode);
}
