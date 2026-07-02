import type { ReactNode } from 'react';

/**
 * Props accepted by the `FileUpload` component.
 */
export interface FileUploadProps {
  /**
   * Controlled array of files.
   */
  value?: File[];

  /**
   * Default array of files for uncontrolled usage.
   */
  defaultValue?: File[];

  /**
   * Callback fired when files are added or removed.
   */
  onValueChange?: (files: File[]) => void;

  /**
   * Callback fired when files are accepted.
   */
  onAccept?: (files: File[]) => void;

  /**
   * Callback fired when a file is accepted.
   */
  onFileAccept?: (file: File) => void;

  /**
   * Callback fired when a file is rejected.
   */
  onFileReject?: (file: File, message: string) => void;

  /**
   * Optional custom validation callback. Return a string error message if invalid, or null/undefined if valid.
   */
  onFileValidate?: (file: File) => string | null | undefined;

  /**
   * Callback fired when a file upload process is simulated or handled.
   */
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => Promise<void> | void;

  /**
   * Accepted file types (comma-separated string, e.g. "image/*,application/pdf").
   */
  accept?: string;

  /**
   * Maximum number of files allowed.
   */
  maxFiles?: number;

  /**
   * Maximum file size in bytes.
   */
  maxSize?: number;

  /**
   * Text direction layout: "ltr" or "rtl".
   */
  dir?: 'ltr' | 'rtl';

  /**
   * Optional label for accessibility.
   */
  label?: string;

  /**
   * Input name attribute.
   */
  name?: string;

  /**
   * Change the default rendered element to the one passed as a child.
   */
  asChild?: boolean;

  /**
   * Disable the file upload dropzone and input.
   * @default false
   */
  disabled?: boolean;

  /**
   * Mark the input state as invalid.
   * @default false
   */
  invalid?: boolean;

  /**
   * Enable multiple file selection.
   * @default false
   */
  multiple?: boolean;

  /**
   * HTML input required attribute.
   * @default false
   */
  required?: boolean;
}

/**
 * Props accepted by the `FileUploadDropzone` component.
 */
export interface FileUploadDropzoneProps {
  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;
}

/**
 * Props accepted by the `FileUploadTrigger` component.
 */
export interface FileUploadTriggerProps {
  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;
}

/**
 * Props accepted by the `FileUploadList` component.
 */
export interface FileUploadListProps {
  /**
   * Layout orientation of the file items.
   * @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;

  /**
   * Force mount the component regardless of whether files are present.
   * @default false
   */
  forceMount?: boolean;
}

/**
 * Props accepted by the `FileUploadItem` component.
 */
export interface FileUploadItemProps {
  /**
   * The File object represented by this list item.
   */
  value: File;

  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;
}

/**
 * Props accepted by the `FileUploadItemPreview` component.
 */
export interface FileUploadItemPreviewProps {
  /**
   * Optional custom preview renderer.
   */
  render?: (file: File, fallback: () => ReactNode) => ReactNode;

  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;
}

/**
 * Props accepted by the `FileUploadItemMetadata` component.
 */
export interface FileUploadItemMetadataProps {
  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;

  /**
   * Font size scale of the metadata text.
   * @default "default"
   */
  size?: 'default' | 'sm';
}

/**
 * Props accepted by the `FileUploadItemProgress` component.
 */
export interface FileUploadItemProgressProps {
  /**
   * Style variant of the progress indicator.
   * - `linear`: A standard progress bar.
   * - `circular`: An animated circle stroke indicator.
   * - `fill`: Progress dims the background of the parent container relative to percentage.
   * @default "linear"
   */
  variant?: 'linear' | 'circular' | 'fill';

  /**
   * Sizing parameter for circular variant in pixels.
   * @default 40
   */
  size?: number;

  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;

  /**
   * Force render the progress indicator.
   * @default false
   */
  forceMount?: boolean;
}

/**
 * Props accepted by the `FileUploadItemDelete` component.
 */
export interface FileUploadItemDeleteProps {
  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;
}

/**
 * Props accepted by the `FileUploadClear` component.
 */
export interface FileUploadClearProps {
  /**
   * Force mount the button even if no files have been selected.
   * @default false
   */
  forceMount?: boolean;

  /**
   * Change the default rendered element to the one passed as a child.
   * @default false
   */
  asChild?: boolean;
}
