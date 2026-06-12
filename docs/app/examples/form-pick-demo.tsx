import { zodResolver } from '@hookform/resolvers/zod';
import { goeyToast } from 'goey-toast';
import { FormPick } from 'kombase';
import { SparklesIcon, ZapIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  gender: z.enum(['male', 'female', 'other']),
  plan: z.enum(['free', 'pro']),
});

type FormData = z.infer<typeof formSchema>;

const PLANS = [
  { icon: SparklesIcon, id: 'free', label: 'Free', sub: 'Forever' },
  { icon: ZapIcon, id: 'pro', label: 'Pro', sub: '$9 / month' },
] as const;

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
] as const;

export default function FormDemo() {
  const [formLayout, setFormLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const form = useForm<FormData>({
    defaultValues: {
      gender: 'male',
      plan: 'free',
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (_data: FormData) => {
    goeyToast.success('Form submitted successfully!', {
      description: `Selected Plan: ${_data.plan}, Gender: ${_data.gender}`,
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
          <FormPick
            control={form.control}
            label="Subscription Plan"
            labelClassName="sm:w-[120px]"
            layout={formLayout}
            name="plan"
            options={PLANS}
            radioGroupProps={{ className: 'grid grid-cols-2 gap-4' }}
          />

          <FormPick
            className={formLayout === 'horizontal' ? 'sm:items-center' : ''}
            control={form.control}
            label="Gender (Custom Render)"
            labelClassName={cn(
              'sm:w-auto sm:shrink-0 pr-4',
              formLayout === 'horizontal' && 'sm:pt-0',
            )}
            layout={formLayout}
            name="gender"
            options={GENDERS}
            radioGroupProps={{
              className: 'flex flex-row flex-wrap gap-4',
            }}
            renderOption={(option, isSelected) => (
              <div className="flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-muted/30 transition-colors w-fit">
                <div
                  className={cn(
                    'size-4 rounded-full border transition-all shrink-0',
                    isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30',
                  )}
                />
                <span className="text-sm font-medium text-foreground leading-none">
                  {option.label}
                </span>
              </div>
            )}
          />

          <Button className="w-full" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
