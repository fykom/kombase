export type Direction = 'ltr' | 'rtl';
export type Orientation = 'horizontal' | 'vertical';
export type NavigationDirection = 'next' | 'prev';
export type ActivationMode = 'automatic' | 'manual';
export type DataState = 'inactive' | 'active' | 'completed';

export interface Stepper {
  /**
   * The controlled value of the active step.
   */
  value?: string;

  /**
   * The default value of the active step when uncontrolled.
   */
  defaultValue?: string;

  /**
   * Event handler called when the active step changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Event handler called when a step is marked as complete.
   */
  onValueComplete?: (value: string, completed: boolean) => void;

  /**
   * Event handler called when a step is registered dynamically.
   */
  onValueAdd?: (value: string) => void;

  /**
   * Event handler called when a step is unregistered dynamically.
   */
  onValueRemove?: (value: string) => void;

  /**
   * Async or sync validation function that controls whether navigation to the target step is allowed.
   * Return `true` to allow, `false` to block.
   */
  onValidate?: (value: string, direction: NavigationDirection) => boolean | Promise<boolean>;

  /**
   * Keyboard activation behavior of the step triggers.
   *
   * - `"automatic"` — step changes when focused.
   * - `"manual"` — step changes only when clicked or activated via Space/Enter.
   *
   * @default "automatic"
   */
  activationMode?: ActivationMode;

  /**
   * The text and layout direction of the stepper.
   */
  dir?: Direction;

  /**
   * The orientation layout of the stepper.
   *
   * @default "horizontal"
   */
  orientation?: Orientation;

  /**
   * Disables user interactions and visual markers of the entire stepper.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to wrap navigation back to the beginning when reaching the end of the step list.
   *
   * @default false
   */
  loop?: boolean;

  /**
   * When enabled, prevents clicking or tab navigation from changing the steps directly.
   *
   * @default false
   */
  nonInteractive?: boolean;

  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperList {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperItem {
  /**
   * Unique identifier of the step item.
   */
  value: string;

  /**
   * Explicitly set the step as completed.
   *
   * @default false
   */
  completed?: boolean;

  /**
   * Disables this individual step item.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperTrigger {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperIndicator {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;

  /**
   * Custom child element or render function receiving the current state.
   */
  children?: React.ReactNode | ((dataState: DataState) => React.ReactNode);
}

export interface StepperSeparator {
  /**
   * Forces the separator to render even if it belongs to the last step.
   *
   * @default false
   */
  forceMount?: boolean;

  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperTitle {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperDescription {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperContent {
  /**
   * The identifier of the step this panel belongs to. Shows only when active.
   */
  value: string;

  /**
   * Forces mounting the content panel even when not active.
   *
   * @default false
   */
  forceMount?: boolean;

  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperPrev {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface StepperNext {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}
