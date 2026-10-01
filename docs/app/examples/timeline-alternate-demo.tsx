import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '@/components/timeline';

const timelineItems = [
  {
    date: 'April 10, 2025',
    dateTime: '2025-04-10',
    description: 'Collected competitor insights and user feedback.',
    id: 'market-research',
    title: 'Market Research',
  },
  {
    date: 'May 3, 2025',
    dateTime: '2025-05-03',
    description: 'Released the first interactive prototype for testing.',
    id: 'prototype-launch',
    title: 'Prototype Launch',
  },
  {
    date: 'June 12, 2025',
    dateTime: '2025-06-12',
    description: 'Configured APIs, database schema, and authentication.',
    id: 'backend-setup',
    title: 'Backend Setup',
  },
];

export default function TimelineAlternateDemo() {
  return (
    <Timeline activeIndex={1} variant="alternate">
      {timelineItems.map((item) => (
        <TimelineItem key={item.id}>
          <TimelineDot />
          <TimelineConnector />
          <TimelineContent>
            <TimelineHeader>
              <TimelineTime dateTime={item.dateTime}>{item.date}</TimelineTime>
              <TimelineTitle>{item.title}</TimelineTitle>
            </TimelineHeader>
            <TimelineDescription>{item.description}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
