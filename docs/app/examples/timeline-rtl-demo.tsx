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
    date: 'February 3, 2025',
    dateTime: '2025-02-03',
    description: 'Keynote speakers and agenda revealed.',
    id: 'speaker-announcement',
    title: 'Speaker Announcement',
  },
  {
    date: 'March 10, 2025',
    dateTime: '2025-03-10',
    description: 'Public ticket booking officially opens.',
    id: 'ticket-sales',
    title: 'Ticket Sales Started',
  },
  {
    date: 'April 18, 2025',
    dateTime: '2025-04-18',
    description: 'Hands-on workshops hosted by industry experts.',
    id: 'workshop-session',
    title: 'Workshop Session',
  },
];

export default function TimelineRtlDemo() {
  return (
    <Timeline activeIndex={1} dir="rtl">
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
