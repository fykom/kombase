export type Orientation = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';

export interface AvatarGroup {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * @default false
   */
  asChild?: boolean;

  /**
   * The orientation of the avatar group layout.
   *
   * @default "horizontal"
   */
  orientation?: Orientation;

  /**
   * The text and layout direction of the avatar group.
   *
   * @default "ltr"
   */
  dir?: Direction;

  /**
   * The size of each avatar in pixels.
   *
   * @default 40
   */
  size?: number;

  /**
   * The maximum number of avatars to display before truncating.
   */
  max?: number;

  /**
   * Whether to reverse the visual stacking order of the avatars.
   *
   * @default false
   */
  reverse?: boolean;

  /**
   * Custom function to render the overflow badge/indicator when avatars are truncated.
   *
   * ```tsx
   * renderOverflow={(count) => (
   *   <div className="bg-primary text-white">+{count}</div>
   * )}
   * ```
   */
  renderOverflow?: (count: number) => React.ReactNode;
}
