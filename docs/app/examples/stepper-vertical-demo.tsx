import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/stepper';

const steps = [
  {
    description: 'Gather project requirements and design UI mockups',
    title: 'Requirements & Design',
    value: 'design',
  },
  {
    description: 'Implement frontend components and database schema',
    title: 'Development Phase',
    value: 'development',
  },
  {
    description: 'Run unit test suites and performance benchmarks',
    title: 'Testing & QA',
    value: 'testing',
  },
  {
    description: 'Deploy project to production and monitor logs',
    title: 'Production Launch',
    value: 'launch',
  },
];

export default function StepperVerticalDemo() {
  return (
    <Stepper defaultValue="testing" orientation="vertical">
      <StepperList>
        {steps.map((step) => (
          <StepperItem key={step.value} value={step.value}>
            <StepperTrigger className="not-last:pb-6">
              <StepperIndicator />
              <div className="flex flex-col gap-1">
                <StepperTitle>{step.title}</StepperTitle>
                <StepperDescription>{step.description}</StepperDescription>
              </div>
            </StepperTrigger>
            <StepperSeparator className="absolute inset-y-0 top-5 left-3.5 -z-10 -order-1 h-full -translate-x-1/2" />
          </StepperItem>
        ))}
      </StepperList>
      {steps.map((step) => {
        let details = '';
        if (step.value === 'design') {
          details =
            'Create visual mockups, define color palettes, typography, and establish user journey maps.';
        } else if (step.value === 'development') {
          details =
            'Write clean code, integrate third-party APIs, configure state management, and build reusable UI elements.';
        } else if (step.value === 'testing') {
          details =
            'Perform integration testing, verify accessibility standards, audit load times, and fix bug reports.';
        } else if (step.value === 'launch') {
          details =
            'Deploy to production environment, setup continuous integration pipelines, and configure global domain names.';
        }
        return (
          <StepperContent
            className="flex flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground"
            key={step.value}
            value={step.value}
          >
            <div className="flex flex-col gap-px">
              <h4 className="font-semibold">{step.title}</h4>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
            <p className="text-sm">{details}</p>
          </StepperContent>
        );
      })}
    </Stepper>
  );
}
