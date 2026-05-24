import type { EmptyProps } from '@/types';

export interface Status extends Omit<EmptyProps<'div'>, 'color'> {
  /**
   * @default false
   */
  asChild?: boolean;

  /**
   * @default "default"
   */
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}
