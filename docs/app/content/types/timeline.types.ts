export type Direction = 'ltr' | 'rtl';
export type Orientation = 'vertical' | 'horizontal';
export type Variant = 'default' | 'alternate';
export type Status = 'completed' | 'active' | 'pending';

export interface Timeline {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;

  /**
   * The text direction of the timeline.
   */
  dir?: Direction;

  /**
   * The orientation of the timeline.
   *
   * @default "vertical"
   */
  orientation?: Orientation;

  /**
   * The visual variant of the timeline.
   *
   * - `"default"` — items aligned in one direction.
   * - `"alternate"` — items alternate left and right (vertical) or top and bottom (horizontal).
   *
   * @default "default"
   */
  variant?: Variant;

  /**
   * The index of the active step in the timeline. Items before this index will be marked as `completed`,
   * the item at this index will be marked as `active`, and subsequent items will be `pending`.
   */
  activeIndex?: number;
}

export interface TimelineItem {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface TimelineConnector {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;

  /**
   * Whether to force the connector to render even if it's the last item in the timeline.
   *
   * @default false
   */
  forceMount?: boolean;
}

export interface TimelineContent {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface TimelineDot {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface TimelineHeader {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface TimelineTitle {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface TimelineDescription {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}

export interface TimelineTime {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;
}
