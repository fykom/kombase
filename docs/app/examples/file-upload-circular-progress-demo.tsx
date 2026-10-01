'use client';

import { goeyToast } from 'goey-toast';
import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';

export default function FileUploadCircularProgressDemo() {
  const [files, setFiles] = React.useState<File[]>([]);

  const onUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      },
    ) => {
      try {
        const uploadPromises = files.map(async (file) => {
          try {
            const totalChunks = 10;
            let uploadedChunks = 0;

            for (let i = 0; i < totalChunks; i++) {
              await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 100));

              uploadedChunks++;
              const progress = (uploadedChunks / totalChunks) * 100;
              onProgress(file, progress);
            }

            await new Promise((resolve) => setTimeout(resolve, 500));
            onSuccess(file);
          } catch (error) {
            onError(file, error instanceof Error ? error : new Error('Upload failed'));
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Unexpected error during upload:', error);
      }
    },
    [],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    goeyToast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      className="w-full max-w-md"
      maxFiles={10}
      maxSize={5 * 1024 * 1024}
      multiple
      onFileReject={onFileReject}
      onUpload={onUpload}
      onValueChange={setFiles}
      value={files}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max 10 files, up to 5MB each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button className="mt-2 w-fit" size="sm" variant="outline">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList orientation="horizontal">
        {files.map((file, index) => (
          <FileUploadItem className="p-0" key={index} value={file}>
            <FileUploadItemPreview className="size-20 [&>svg]:size-12">
              <FileUploadItemProgress size={40} variant="circular" />
            </FileUploadItemPreview>
            <FileUploadItemMetadata className="sr-only" />
            <FileUploadItemDelete asChild>
              <Button
                className="absolute -top-1 -right-1 size-5 rounded-full"
                size="icon"
                variant="secondary"
              >
                <X className="size-3" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
