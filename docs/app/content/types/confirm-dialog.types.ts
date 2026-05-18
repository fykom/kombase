/**
 * Props accepted by the `ConfirmDialog` component.
 */
export type ConfirmDialog = {
  /**
   * Controls whether the dialog is open.
   */
  open: boolean;

  /**
   * Callback triggered when dialog open state changes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Dialog title content.
   */
  title: React.ReactNode;

  /**
   * Dialog description content.
   */
  desc: React.JSX.Element | string;

  /**
   * Disables the confirm button.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom text for the cancel button.
   *
   * @default "Cancel"
   */
  cancelBtnText?: string;

  /**
   * Custom content for the confirm button.
   *
   * @default "Continue"
   */
  confirmText?: React.ReactNode;

  /**
   * Applies destructive styling to the confirm button.
   */
  destructive?: boolean;

  /**
   * Loading state for the dialog actions.
   * Disables both confirm and cancel buttons.
   */
  isLoading?: boolean;

  /**
   * Additional class names applied to the dialog content.
   */
  className?: string;

  /**
   * Additional content rendered inside the dialog body.
   */
  children?: React.ReactNode;
} & (
  | {
      /**
       * HTML form ID used for submit-based confirmation.
       */
      form: string;

      /**
       * Not allowed when using `form`.
       */
      handleConfirm?: undefined;
    }
  | {
      /**
       * Form mode is disabled.
       */
      form?: undefined;

      /**
       * Callback executed when confirm button is clicked.
       */
      handleConfirm: () => void;
    }
);
