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
} from 'kombase';

const timelineItems = [
  {
    date: 'Jan - Mar',
    dateTime: '2025-01',
    description: 'Project foundation and team alignment',
    id: 'foundation-setup',
    title: 'Q1',
  },
  {
    date: 'Apr - Jun',
    dateTime: '2025-04',
    description: 'Core product development and integrations',
    id: 'product-development',
    title: 'Q2',
  },
  {
    date: 'Jul - Sep',
    dateTime: '2025-07',
    description: 'Performance testing and feature optimization',
    id: 'testing-optimization',
    title: 'Q3',
  },
];

export default function TimelineHorizontalDemo() {
  return (
    <Timeline activeIndex={1} orientation="horizontal">
      {timelineItems.map((item) => (
        <TimelineItem key={item.id}>
          <TimelineDot />
          <TimelineConnector />
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>{item.title}</TimelineTitle>
              <TimelineTime dateTime={item.dateTime}>{item.date}</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>{item.description}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
