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
import { Database, Palette, Search } from 'lucide-react';

const timelineItems = [
  {
    date: 'January 8, 2025',
    dateTime: '2025-01-08',
    description: 'Validated product ideas through surveys and interviews.',
    icon: Search,
    id: 'idea-validation',
    title: 'Idea Validation',
  },
  {
    date: 'February 14, 2025',
    dateTime: '2025-02-14',
    description: 'Created visual identity, UI kit, and design system.',
    icon: Palette,
    id: 'branding-design',
    title: 'Branding & Design',
  },
  {
    date: 'March 10, 2025',
    dateTime: '2025-03-10',
    description: 'Defined backend services and database structure.',
    icon: Database,
    id: 'system-architecture',
    title: 'System Architecture',
  },
];

export default function TimelineCustomDotDemo() {
  return (
    <Timeline activeIndex={1} className="[--timeline-dot-size:2rem]">
      {timelineItems.map((item) => (
        <TimelineItem key={item.id}>
          <TimelineDot>
            <item.icon className="size-3.5" />
          </TimelineDot>
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
