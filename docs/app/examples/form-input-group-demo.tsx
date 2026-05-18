import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputGroup } from 'kombase';
import { Link2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  website: z.url('Must be a valid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export default function FormDemo() {
  const [formLayout, setFormLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const form = useForm<FormData>({
    defaultValues: {
      website: '',
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = () => {};

  const onError = () => {};

  return (
    <div className="flex flex-col items-center w-full max-w-sm space-y-6 mx-auto">
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
        <form className="space-y-6 w-full" onSubmit={form.handleSubmit(onSubmit, onError)}>
          <FormInputGroup
            addon={<Link2Icon className="w-4 h-4 text-muted-foreground" />}
            control={form.control}
            inputGroupProps={{ placeholder: 'https://example.com', type: 'url' }}
            label="Website"
            labelClassName="sm:w-[120px]"
            layout={formLayout}
            name="website"
          />

          <Button className="w-full" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
