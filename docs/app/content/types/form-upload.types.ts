import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { FileUploadProps } from '@/components/ui/file-upload';

/**
 * Props accepted by the `FormUpload` component.
 */
export interface FormUploadProps<TFieldValues extends FieldValues> {
  /**
   * The React Hook Form `control` object returned by `useForm`.
   */
  control: Control<TFieldValues>;

  /**
   * Dot-notation path to the field inside the form schema.
   */
  name: FieldPath<TFieldValues>;

  /**
   * Optional label rendered above the file upload.
   */
  label?: string | ReactNode;

  /**
   * Additional props forwarded to the underlying FileUpload component.
   */
  uploadProps?: Omit<FileUploadProps, 'value' | 'onValueChange' | 'children'>;

  /**
   * Layout orientation of the form item.
   * - `vertical`: Label is stacked above the file upload (default).
   * - `horizontal`: Label is placed side-by-side.
   * @default "vertical"
   */
  layout?: 'vertical' | 'horizontal';

  /**
   * Additional class names applied to the outermost FormItem wrapper.
   */
  className?: string;

  /**
   * Additional class names applied to the Label.
   */
  labelClassName?: string;

  /**
   * Children components defining the layout of dropzone and list.
   */
  children?: ReactNode;
}
