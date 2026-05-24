export type Direction = 'ltr' | 'rtl';
export type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;
export type InteractOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent | FocusEvent;
}>;
export type OpenAutoFocusEvent = CustomEvent<Record<string, never>>;
export type CloseAutoFocusEvent = CustomEvent<Record<string, never>>;

// export interface DivProps extends React.ComponentProps<"div"> {
//   asChild?: boolean;
// }

export interface ScrollOffset {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface Tour {
  /**
   * Whether the tour is currently open (controlled state).
   *
   * ```ts
   * open={isOpen}
   * ```
   */
  open?: boolean;
  /**
   * The initial open state of the tour when it is first rendered (uncontrolled state).
   *
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Event handler called when the open state of the tour changes.
   *
   * ```ts
   * onOpenChange={(open) => {
   *   console.log("Tour open:", open);
   * }}
   * ```
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The active step index of the tour (0-indexed, controlled state).
   *
   * ```ts
   * value={currentStep}
   * ```
   */
  value?: number;
  /**
   * The initial step index of the tour when it is first rendered (uncontrolled state).
   *
   * @default 0
   */
  defaultValue?: number;
  /**
   * Event handler called when the active step index of the tour changes.
   *
   * ```ts
   * onValueChange={(step) => {
   *   console.log("Current step:", step);
   * }}
   * ```
   */
  onValueChange?: (step: number) => void;
  /**
   * Event handler called when the tour completes successfully (i.e., all steps are completed).
   *
   * ```ts
   * onComplete={() => {
   *   console.log("Tour finished!");
   * }}
   * ```
   */
  onComplete?: () => void;
  /**
   * Event handler called when the user skips or closes the tour before reaching the last step.
   *
   * ```ts
   * onSkip={() => {
   *   console.log("Tour skipped.");
   * }}
   * ```
   */
  onSkip?: () => void;
  /**
   * Event handler called when the Escape key is pressed while the tour is open.
   *
   * ```ts
   * onEscapeKeyDown={(event) => {
   *   event.preventDefault(); // prevent closing the tour
   * }}
   * ```
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Event handler called when a pointer down event occurs outside the active tour step.
   *
   * ```ts
   * onPointerDownOutside={(event) => {
   *   console.log("Clicked outside step content");
   * }}
   * ```
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
  /**
   * Event handler called when an interaction (pointer down or focus) occurs outside the active tour step.
   *
   * ```ts
   * onInteractOutside={(event) => {
   *   console.log("Interacted outside active step");
   * }}
   * ```
   */
  onInteractOutside?: (event: InteractOutsideEvent) => void;
  /**
   * Event handler called when a tour step opens and focuses its content.
   *
   * ```ts
   * onOpenAutoFocus={(event) => {
   *   event.preventDefault(); // prevent auto-focusing elements inside step
   * }}
   * ```
   */
  onOpenAutoFocus?: (event: OpenAutoFocusEvent) => void;
  /**
   * Event handler called when the tour is closed and the focus returns to the previously focused element.
   *
   * ```ts
   * onCloseAutoFocus={(event) => {
   *   event.preventDefault(); // prevent focusing back on trigger
   * }}
   * ```
   */
  onCloseAutoFocus?: (event: CloseAutoFocusEvent) => void;
  /**
   * The text direction of the tour content ("ltr" | "rtl").
   */
  dir?: Direction;
  /**
   * The alignment offset (in pixels) of the step popover relative to the target element.
   *
   * @default 0
   */
  alignOffset?: number;
  /**
   * The distance (in pixels) between the step popover and the target element.
   *
   * @default 16
   */
  sideOffset?: number;
  /**
   * The padding (in pixels) around the target element for the spotlight mask effect.
   *
   * @default 4
   */
  spotlightPadding?: number;
  /**
   * Whether the window should automatically scroll to the target element of the active step if it is outside the viewport.
   *
   * @default true
   */
  autoScroll?: boolean;
  /**
   * The scroll behavior used when auto-scrolling to the target element ("auto" | "smooth").
   *
   * @default "smooth"
   */
  scrollBehavior?: ScrollBehavior;
  /**
   * The margins/offsets for scrolling, specifying how far from the viewport edges the target element should be positioned when scrolled into view.
   *
   * @default { top: 100, bottom: 100, left: 0, right: 0 }
   */
  scrollOffset?: ScrollOffset;
  /**
   * Whether the tour can be dismissed by clicking outside the popover.
   *
   * @default true
   */
  dismissible?: boolean;
  /**
   * Whether the tour behaves as a modal, blocking interactions with the rest of the page and locking body scrolling.
   *
   * @default true
   */
  modal?: boolean;
  /**
   * A custom React element to be used as the footer for all steps in the tour.
   *
   * ```tsx
   * stepFooter={<MyCustomFooter />}
   * ```
   */
  stepFooter?: React.ReactElement;
}

export interface TourSpotlight {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
  /**
   * Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.
   *
   * @default false
   */
  forceMount?: boolean;
}

export interface TourSpotlightRing {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
  /**
   * Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.
   *
   * @default false
   */
  forceMount?: boolean;
}

export interface TourStep {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
  /**
   * The target element that the step popover points to. Can be a CSS selector query string, a React Ref, or an HTMLElement instance.
   */
  target: string | React.RefObject<HTMLElement> | HTMLElement;
  /**
   * The side of the target element to position the step popover.
   *
   * @default "bottom"
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * The distance (in pixels) between the step popover and the target element.
   *
   * @default 16
   */
  sideOffset?: number;
  /**
   * The alignment of the step popover relative to the target element.
   *
   * @default "center"
   */
  align?: 'start' | 'center' | 'end';
  /**
   * The alignment offset (in pixels) of the step popover relative to the target element.
   *
   * @default 0
   */
  alignOffset?: number;
  /**
   * The element or array of elements used as the boundary for collision detection.
   */
  collisionBoundary?: Element | null | (Element | null)[];
  /**
   * The padding (in pixels) to apply around the boundary for collision detection.
   */
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  /**
   * The padding (in pixels) to apply around the arrow inside the step popover.
   */
  arrowPadding?: number;
  /**
   * The sticky behavior of the step popover relative to the target element when scrolling.
   *
   * @default "partial"
   */
  sticky?: 'partial' | 'always';
  /**
   * Whether to hide the step popover when the target element is detached from the viewport.
   *
   * @default false
   */
  hideWhenDetached?: boolean;
  /**
   * Whether to prevent collisions with the boundaries and adjust position dynamically.
   *
   * @default true
   */
  avoidCollisions?: boolean;
  /**
   * Whether the step is required to be mounted or validated.
   *
   * @default false
   */
  required?: boolean;
  /**
   * Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.
   *
   * @default false
   */
  forceMount?: boolean;
  /**
   * Callback function triggered when this step is entered.
   */
  onStepEnter?: () => void;
  /**
   * Callback function triggered when this step is exited.
   */
  onStepLeave?: () => void;
}

export interface TourPortal {
  /**
   * The children components to render inside the portal.
   */
  children?: React.ReactNode;
  /**
   * Specify a container element to portal the content into.
   *
   * @default document.body
   */
  container?: HTMLElement | null;
}

export interface TourArrow {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
  /**
   * The width (in pixels) of the arrow SVG.
   *
   * @default 10
   */
  width?: number;
  /**
   * The height (in pixels) of the arrow SVG.
   *
   * @default 5
   */
  height?: number;
}

export interface TourClose {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface TourStepCounter {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}
