import { XIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  title: React.ReactNode;
  disabled?: boolean;
  desc: React.JSX.Element | string;
  cancelBtnText?: string;
  confirmText?: React.ReactNode;
  destructive?: boolean;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
} & (
  | { footer: React.ReactNode | null; form?: undefined; handleConfirm?: undefined }
  | { footer?: undefined; form: string; handleConfirm?: undefined }
  | { footer?: undefined; form?: undefined; handleConfirm: () => void }
);

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    open,
    onOpenChange,
    onClose,
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    form,
    handleConfirm,
    footer,
    showCloseButton = false,
    ...actions
  } = props;

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      onClose?.();
    }
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open} {...actions}>
      <AlertDialogContent className={cn(className)}>
        {showCloseButton && (
          <AlertDialogCancel
            className="absolute right-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground border-none p-0 h-auto w-auto bg-transparent hover:bg-transparent hover:text-accent-foreground shadow-none"
            data-slot="alert-dialog-close"
            onClick={() => handleOpenChange(false)}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </AlertDialogCancel>
        )}
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{desc}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        {footer !== null && (
          <AlertDialogFooter>
            {footer !== undefined ? (
              footer
            ) : (
              <>
                <AlertDialogCancel disabled={isLoading}>
                  {cancelBtnText ?? 'Cancel'}
                </AlertDialogCancel>
                <Button
                  disabled={disabled || isLoading}
                  form={form}
                  onClick={handleConfirm}
                  type={form ? 'submit' : 'button'}
                  variant={destructive ? 'destructive' : 'default'}
                >
                  {confirmText ?? 'Continue'}
                </Button>
              </>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
