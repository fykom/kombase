import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea } from 'kombase';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  bio: z.string().max(20, 'Bio must not exceed 20 characters'),
  comment: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function FormTextareaDemo() {
  const [formLayout, setFormLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const form = useForm<FormData>({
    defaultValues: {
      bio: '',
      comment: '',
      description: '',
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (_data: FormData) => {};

  return (
    <div className="flex flex-col items-center w-full max-w-2xl space-y-6 mx-auto">
      <div className="flex items-center space-x-1 bg-secondary/60 p-1 rounded-lg w-full">
        <button
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            formLayout === 'vertical'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFormLayout('vertical')}
          type="button"
        >
          Vertical Layout
        </button>
        <button
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            formLayout === 'horizontal'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFormLayout('horizontal')}
          type="button"
        >
          Horizontal Layout
        </button>
      </div>

      <Form {...form}>
        <form className="space-y-6 w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <FormTextarea
            control={form.control}
            label="Bio"
            labelClassName="sm:w-[140px]"
            layout={formLayout}
            maxLength={20}
            name="bio"
            showCharacterCount
            textareaProps={{ placeholder: 'Tell us about yourself (max 20 characters)', rows: 5 }}
          />

          <FormTextarea
            control={form.control}
            label="Description"
            labelClassName="sm:w-[140px]"
            layout={formLayout}
            name="description"
            textareaProps={{ placeholder: 'Enter a description (min 10 characters)', rows: 4 }}
          />

          <FormTextarea
            control={form.control}
            label="Comment (Optional)"
            labelClassName="sm:w-[140px]"
            layout={formLayout}
            name="comment"
            showCharacterCount
            textareaProps={{ placeholder: 'Add a comment', rows: 3 }}
          />

          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
