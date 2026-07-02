'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { goeyToast } from 'goey-toast';
import {
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
  FormUpload,
} from 'kombase';
import { CloudUpload, X } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormDescription } from '@/components/ui/form';

const formSchema = z.object({
  files: z
    .array(z.custom<File>())
    .min(1, 'Please select at least one file')
    .max(2, 'Please select up to 2 files')
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
      message: 'File size must be less than 5MB',
      path: ['files'],
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function FileUploadFormDemo() {
  const form = useForm<FormValues>({
    defaultValues: {
      files: [],
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = React.useCallback((data: FormValues) => {
    goeyToast.success('Submitted values:', {
      description: (
        <pre className="mt-2 w-80 rounded-md bg-accent/30 p-4 text-accent-foreground">
          <code>
            {JSON.stringify(
              data.files.map((file) =>
                file.name.length > 25 ? `${file.name.slice(0, 25)}...` : file.name,
              ),
              null,
              2,
            )}
          </code>
        </pre>
      ),
    });
  }, []);

  return (
    <Form {...form}>
      <form className="w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
        <FormUpload
          control={form.control}
          label="Attachments"
          name="files"
          uploadProps={{
            accept: 'image/*',
            maxFiles: 2,
            maxSize: 5 * 1024 * 1024,
            multiple: true,
            onFileReject: (_, message) => {
              form.setError('files', {
                message,
              });
            },
          }}
        >
          <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
            <CloudUpload className="size-4" />
            Drag and drop or
            <FileUploadTrigger asChild>
              <Button className="p-0" size="sm" type="button" variant="link">
                choose files
              </Button>
            </FileUploadTrigger>
            to upload
          </FileUploadDropzone>
          <FileUploadList>
            {form.watch('files')?.map((file, index) => (
              <FileUploadItem key={index} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete asChild>
                  <Button className="size-7" size="icon" variant="ghost">
                    <X />
                    <span className="sr-only">Delete</span>
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FormUpload>
        <FormDescription className="mt-1 text-xs text-muted-foreground">
          Upload up to 2 images up to 5MB each.
        </FormDescription>
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
