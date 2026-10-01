'use client';

import { goeyToast } from 'goey-toast';
import { ArrowUp, Paperclip, Upload, X } from 'lucide-react';
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
  type FileUploadProps,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';

export default function FileUploadChatInputDemo() {
  const [input, setInput] = React.useState('');
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const onInputChange = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  }, []);

  const onUpload: NonNullable<FileUploadProps['onUpload']> = React.useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        setIsUploading(true);
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
          } finally {
            setIsUploading(false);
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

  const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInput('');
    setFiles([]);
  }, []);

  return (
    <FileUpload
      className="relative h-[400px] w-full items-center p-8 flex flex-col justify-center"
      disabled={isUploading}
      maxFiles={10}
      maxSize={5 * 1024 * 1024}
      multiple
      onFileReject={onFileReject}
      onUpload={onUpload}
      onValueChange={setFiles}
      value={files}
    >
      <FileUploadDropzone
        className="absolute top-0 left-0 z-0 flex size-full items-center justify-center rounded-none border-none bg-background/50 p-0 opacity-0 backdrop-blur transition-opacity duration-200 ease-out data-dragging:z-10 data-dragging:opacity-100"
        onClick={(event) => event.preventDefault()}
        tabIndex={-1}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">Upload max 5 files each up to 5MB</p>
        </div>
      </FileUploadDropzone>
      <form
        className="relative flex w-full max-w-md flex-col gap-2.5 rounded-md border border-input px-3 py-2 outline-none focus-within:ring-1 focus-within:ring-ring/50"
        onSubmit={onSubmit}
      >
        <FileUploadList className="overflow-x-auto px-0 py-1" orientation="horizontal">
          {files.map((file, index) => (
            <FileUploadItem className="max-w-52 p-1.5" key={index} value={file}>
              <FileUploadItemPreview className="size-8 [&>svg]:size-5">
                <FileUploadItemProgress variant="fill" />
              </FileUploadItemPreview>
              <FileUploadItemMetadata size="sm" />
              <FileUploadItemDelete asChild>
                <Button
                  className="absolute -top-1 -right-1 size-4 shrink-0 cursor-pointer rounded-full"
                  size="icon"
                  variant="secondary"
                >
                  <X className="size-2.5" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
        <Textarea
          className="field-sizing-content min-h-10 w-full resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
          disabled={isUploading}
          onChange={onInputChange}
          placeholder="Type your message here..."
          value={input}
        />
        <div className="flex items-center justify-end gap-1.5">
          <FileUploadTrigger asChild>
            <Button className="size-7 rounded-sm" size="icon" type="button" variant="ghost">
              <Paperclip className="size-3.5" />
              <span className="sr-only">Attach file</span>
            </Button>
          </FileUploadTrigger>
          <Button className="size-7 rounded-sm" disabled={!input.trim() || isUploading} size="icon">
            <ArrowUp className="size-3.5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </FileUpload>
  );
}
