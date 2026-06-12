import { zodResolver } from '@hookform/resolvers/zod';
import { goeyToast } from 'goey-toast';
import { FormRadio } from 'kombase';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  gender: z.enum(['male', 'female', 'other']),
  notificationPreference: z.enum(['all', 'mentions', 'none']),
});

type FormData = z.infer<typeof formSchema>;

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
] as const;

const NOTIFICATION_PREFERENCES = [
  {
    description: 'Get notified about every event and updates.',
    id: 'all',
    label: 'All Activities',
  },
  { description: 'Get notified only when you are tagged.', id: 'mentions', label: 'Only Mentions' },
  { description: 'Turn off all notifications.', id: 'none', label: 'Muted' },
] as const;

export default function FormRadioDemo() {
  const [optionsOrientation, setOptionsOrientation] = useState<'vertical' | 'horizontal'>(
    'horizontal',
  );

  const form = useForm<FormData>({
    defaultValues: {
      gender: 'male',
      notificationPreference: 'all',
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (_data: FormData) => {
    goeyToast.success('Form submitted successfully!', {
      description: `Gender: ${_data.gender}, Notifications: ${_data.notificationPreference}`,
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm space-y-6 mx-auto">
      <Tabs
        className="w-full"
        onValueChange={(val) => setOptionsOrientation(val as 'vertical' | 'horizontal')}
        value={optionsOrientation}
      >
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="vertical">Vertical List</TabsTrigger>
          <TabsTrigger value="horizontal">Horizontal Row</TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form className="space-y-6 w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <FormRadio
            control={form.control}
            label="Gender"
            labelClassName="sm:w-[120px]"
            layout="vertical"
            name="gender"
            options={GENDERS}
            orientation={optionsOrientation}
          />

          <FormRadio
            control={form.control}
            label="Notification Alert"
            labelClassName="sm:w-[120px]"
            layout="vertical"
            name="notificationPreference"
            options={NOTIFICATION_PREFERENCES}
            orientation="vertical"
          />

          <Button className="w-full" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
