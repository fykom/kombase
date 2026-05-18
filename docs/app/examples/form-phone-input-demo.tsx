import { zodResolver } from '@hookform/resolvers/zod';
import { FormPhoneInput, type PhoneInputProps } from 'kombase';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

type FormData = z.infer<typeof formSchema>;

const NORTH_AMERICAN_COUNTRIES: PhoneInputProps['countries'] = [
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brazil' },
];

export default function FormPhoneInputDemo() {
  const [formLayout, setFormLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const form = useForm<FormData>({
    defaultValues: {
      phoneNumber: '',
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
          <div className="space-y-4">
            <FormPhoneInput
              control={form.control}
              label="Phone Number"
              labelClassName="sm:w-[120px]"
              layout={formLayout}
              name="phoneNumber"
              phoneInputProps={{ placeholder: 'Type phone number' }}
              // isVisibleCountrySelect={false}
            />
            <FormPhoneInput
              control={form.control}
              label="Phone Number With Custom Countries"
              labelClassName="sm:w-[280px]"
              layout={formLayout}
              name="phoneNumber"
              phoneInputProps={{
                countries: NORTH_AMERICAN_COUNTRIES,
                defaultCountry: 'CA',
                placeholder: 'Type phone number',
              }}
              // isVisibleCountrySelect={false}
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
