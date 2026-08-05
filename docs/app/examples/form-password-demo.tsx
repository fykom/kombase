import { zodResolver } from '@hookform/resolvers/zod';
import { goeyToast } from 'goey-toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { FormInputPassword } from '@/components/form/form-password';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type FormData = z.infer<typeof formSchema>;

export default function FormPasswordDemo() {
  const [formLayout, setFormLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const form = useForm<FormData>({
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (_data: FormData) => {
    goeyToast.success('Form submitted successfully!', {
      description: 'Password has been set.',
    });
  };

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
        <form className="space-y-6 w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormInputPassword
              control={form.control}
              inputProps={{ placeholder: 'Enter password' }}
              label="Password"
              labelClassName="sm:w-[120px]"
              layout={formLayout}
              name="password"
            />
          </div>

          <Button className="w-full" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
