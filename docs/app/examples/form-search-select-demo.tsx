import { zodResolver } from '@hookform/resolvers/zod';
import { FormSearchSelect } from 'komdes';
import { GlobeIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import {
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { InputGroupAddon } from '@/components/ui/input-group';

const FRAMEWORKS = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'] as const;

const COUNTRIES = [
  { code: '', continent: '', label: 'Select country', value: '' },
  {
    code: 'ar',
    continent: 'South America',
    label: 'Argentina',
    value: 'argentina',
  },
  { code: 'au', continent: 'Oceania', label: 'Australia', value: 'australia' },
  { code: 'br', continent: 'South America', label: 'Brazil', value: 'brazil' },
  { code: 'ca', continent: 'North America', label: 'Canada', value: 'canada' },
  { code: 'cn', continent: 'Asia', label: 'China', value: 'china' },
  {
    code: 'co',
    continent: 'South America',
    label: 'Colombia',
    value: 'colombia',
  },
  { code: 'eg', continent: 'Africa', label: 'Egypt', value: 'egypt' },
  { code: 'fr', continent: 'Europe', label: 'France', value: 'france' },
  { code: 'de', continent: 'Europe', label: 'Germany', value: 'germany' },
  { code: 'it', continent: 'Europe', label: 'Italy', value: 'italy' },
  { code: 'jp', continent: 'Asia', label: 'Japan', value: 'japan' },
  { code: 'ke', continent: 'Africa', label: 'Kenya', value: 'kenya' },
  { code: 'mx', continent: 'North America', label: 'Mexico', value: 'mexico' },
  {
    code: 'nz',
    continent: 'Oceania',
    label: 'New Zealand',
    value: 'new-zealand',
  },
  { code: 'ng', continent: 'Africa', label: 'Nigeria', value: 'nigeria' },
  {
    code: 'za',
    continent: 'Africa',
    label: 'South Africa',
    value: 'south-africa',
  },
  { code: 'kr', continent: 'Asia', label: 'South Korea', value: 'south-korea' },
  {
    code: 'gb',
    continent: 'Europe',
    label: 'United Kingdom',
    value: 'united-kingdom',
  },
  {
    code: 'us',
    continent: 'North America',
    label: 'United States',
    value: 'united-states',
  },
];

const TIMEZONES = [
  {
    items: [
      '(GMT-5) New York',
      '(GMT-8) Los Angeles',
      '(GMT-6) Chicago',
      '(GMT-5) Toronto',
      '(GMT-8) Vancouver',
      '(GMT-3) São Paulo',
    ],
    value: 'Americas',
  },
  {
    items: [
      '(GMT+0) London',
      '(GMT+1) Paris',
      '(GMT+1) Berlin',
      '(GMT+1) Rome',
      '(GMT+1) Madrid',
      '(GMT+1) Amsterdam',
    ],
    value: 'Europe',
  },
  {
    items: [
      '(GMT+9) Tokyo',
      '(GMT+8) Shanghai',
      '(GMT+8) Singapore',
      '(GMT+4) Dubai',
      '(GMT+11) Sydney',
      '(GMT+9) Seoul',
    ],
    value: 'Asia/Pacific',
  },
] as const;

const formSchema = z.object({
  basic: z.string().min(1, 'Please select one'),
  inputGroup: z.string({
    error: 'Please select timezone',
  }),
  multiple: z.array(z.string()).min(1, 'Please select a framework'),
  searchbox: z.object(
    {
      code: z.string(),
      continent: z.string(),
      label: z.string(),
      value: z.string(),
    },
    {
      error: 'Please select country',
    },
  ),
});

type FormData = z.infer<typeof formSchema>;

export default function FormSearchSelectDemo() {
  const [formLayout, setFormLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const form = useForm<FormData>({
    defaultValues: {
      basic: '',
      inputGroup: '',
      multiple: [FRAMEWORKS[0]],
      searchbox: undefined,
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
          <FormSearchSelect
            comboboxProps={{ items: FRAMEWORKS }}
            control={form.control}
            label="Basic"
            labelClassName="sm:w-[140px]"
            layout={formLayout}
            name="basic"
            render={() => (
              <>
                <ComboboxInput placeholder="Select a framework" showClear />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </>
            )}
          />

          <FormSearchSelect
            comboboxProps={{ items: FRAMEWORKS }}
            control={form.control}
            label="Search select multiple"
            labelClassName="sm:w-[200px]"
            layout={formLayout}
            multiple
            name="multiple"
            render={({ anchor }) => (
              <>
                <ComboboxChips className="w-full" ref={anchor}>
                  <ComboboxValue>
                    {(values) => (
                      <>
                        {values.map((value: string) => (
                          <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput />
                      </>
                    )}
                  </ComboboxValue>
                </ComboboxChips>

                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>

                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </>
            )}
          />

          <FormSearchSelect
            comboboxProps={{ items: COUNTRIES }}
            control={form.control}
            label="With search box"
            labelClassName="sm:w-[140px]"
            layout={formLayout}
            name="searchbox"
            render={() => (
              <>
                <ComboboxTrigger
                  render={
                    <Button className="w-64 justify-between font-normal" variant="outline">
                      <ComboboxValue />
                    </Button>
                  }
                />
                <ComboboxContent>
                  <ComboboxInput placeholder="Search" showTrigger={false} />
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.code} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </>
            )}
          />

          <FormSearchSelect
            comboboxProps={{ items: TIMEZONES }}
            control={form.control}
            label="Search input group"
            labelClassName="sm:w-[200px]"
            layout={formLayout}
            name="inputGroup"
            render={() => (
              <>
                <ComboboxInput placeholder="Select a timezone">
                  <InputGroupAddon>
                    <GlobeIcon />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent alignOffset={-28} className="w-60">
                  <ComboboxEmpty>No timezones found.</ComboboxEmpty>
                  <ComboboxList>
                    {(group) => (
                      <ComboboxGroup items={group.items} key={group.value}>
                        <ComboboxLabel>{group.value}</ComboboxLabel>
                        <ComboboxCollection>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxCollection>
                      </ComboboxGroup>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </>
            )}
          />

          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
