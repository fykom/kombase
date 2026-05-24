import { zodResolver } from '@hookform/resolvers/zod';
import { goeyToast } from 'goey-toast';
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrev,
  type StepperProps,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from 'kombase';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  bio: z.string().min(10, 'Biography must be at least 10 characters long'),
  email: z.email('Please enter a valid email address format'),
  firstName: z.string().min(1, 'Given name is required to continue'),
  lastName: z.string().min(1, 'Family name is required to continue'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

type FormSchema = z.infer<typeof formSchema>;

const steps = [
  {
    description: 'Enter your credentials',
    fields: ['username', 'email'] as const,
    title: 'Account Settings',
    value: 'account',
  },
  {
    description: 'Provide your personal details',
    fields: ['firstName', 'lastName', 'bio'] as const,
    title: 'Profile Information',
    value: 'profile',
  },
  {
    description: 'Verify your info before submitting',
    fields: [] as const,
    title: 'Review Summary',
    value: 'review',
  },
];

export default function StepperValidationDemo() {
  const [step, setStep] = React.useState('account');

  const form = useForm<FormSchema>({
    defaultValues: {
      bio: '',
      email: '',
      firstName: '',
      lastName: '',
      username: '',
    },
    resolver: zodResolver(formSchema),
  });

  const stepIndex = React.useMemo(() => steps.findIndex((s) => s.value === step), [step]);

  const onValidate: NonNullable<StepperProps['onValidate']> = React.useCallback(
    async (_value, direction) => {
      if (direction === 'prev') return true;

      const stepData = steps.find((s) => s.value === step);
      if (!stepData) return true;

      const isValid = await form.trigger(stepData.fields);

      if (!isValid) {
        goeyToast.info('Please complete all required fields to continue', {
          description: 'Fix the validation errors and try again.',
        });
      }

      return isValid;
    },
    [form, step],
  );

  const onSubmit = React.useCallback((input: FormSchema) => {
    return goeyToast.success(JSON.stringify(input, null, 2));
  }, []);

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <Stepper onValidate={onValidate} onValueChange={setStep} value={step}>
          <StepperList>
            {steps.map((step) => (
              <StepperItem key={step.value} value={step.value}>
                <StepperTrigger>
                  <StepperIndicator />
                  <div className="flex flex-col gap-1">
                    <StepperTitle>{step.title}</StepperTitle>
                    <StepperDescription>{step.description}</StepperDescription>
                  </div>
                </StepperTrigger>
                <StepperSeparator className="mx-4" />
              </StepperItem>
            ))}
          </StepperList>
          <StepperContent
            className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground"
            value="account"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a unique username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </StepperContent>
          <StepperContent
            className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground"
            value="profile"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Given Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your given name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your family name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[80px]"
                      placeholder="Tell us a bit about yourself..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </StepperContent>
          <StepperContent
            className="grid grid-cols-2 gap-4 rounded-md border bg-card p-4 text-card-foreground lg:grid-cols-3"
            value="review"
          >
            <div className="flex flex-col gap-1 rounded-md border p-2">
              <span className="font-medium text-sm">Chosen Username</span>
              <p className="text-sm">{form.watch('username') ?? 'Not provided'}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-md border p-2">
              <span className="font-medium text-sm">Email Address</span>
              <p className="text-sm">{form.watch('email') ?? 'Not provided'}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-md border p-2">
              <span className="font-medium text-sm">Given Name</span>
              <p className="text-sm">{form.watch('firstName') ?? 'Not provided'}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-md border p-2">
              <span className="font-medium text-sm">Family Name</span>
              <p className="text-sm">{form.watch('lastName') ?? 'Not provided'}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-md border p-2">
              <span className="font-medium text-sm">Biography</span>
              <p className="text-sm">{form.watch('bio') ?? 'Not provided'}</p>
            </div>
          </StepperContent>
          <div className="flex justify-between">
            <StepperPrev asChild>
              <Button type="button" variant="outline">
                Previous
              </Button>
            </StepperPrev>
            <div className="text-muted-foreground text-sm">
              Step {stepIndex + 1} of {steps.length}
            </div>
            {stepIndex === steps.length - 1 ? (
              <Button type="submit">Complete Setup</Button>
            ) : (
              <StepperNext asChild>
                <Button>Next</Button>
              </StepperNext>
            )}
          </div>
        </Stepper>
      </form>
    </Form>
  );
}
