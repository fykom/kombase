import { LongText } from '@/components/long-text';

export default function ExamplePage() {
  return (
    <div className="space-y-6 p-6 text-center">
      {/* Basic Usage */}
      <LongText className="max-w-36">
        This is a very long text that will automatically truncate when it exceeds the container
        width.
      </LongText>

      {/* Custom Tooltip / Popover Content Style */}
      <div className="max-w-62.5 rounded-md">
        <LongText className="text-muted-foreground" contentClassName="max-w-xs break-words text-sm">
          This content will show inside a Tooltip on desktop and inside a Popover on mobile devices
          when the text is overflowing.
        </LongText>
      </div>
    </div>
  );
}
