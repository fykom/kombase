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
   * Callback triggered when dialog is closed.
   */
  onClose?: () => void;

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

  /**
   * Shows a close button at the top right of the dialog.
   *
   * @default false
   */
  showCloseButton?: boolean;
} & (
  | {
      /**
       * Custom footer content. If `null`, AlertDialogFooter is hidden.
       */
      footer: React.ReactNode | null;

      /**
       * Not allowed when using custom `footer`.
       */
      form?: undefined;

      /**
       * Not allowed when using custom `footer`.
       */
      handleConfirm?: undefined;
    }
  | {
      /**
       * Not using custom footer.
       */
      footer?: undefined;

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
       * Not using custom footer.
       */
      footer?: undefined;

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
