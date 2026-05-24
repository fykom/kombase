import { Status, StatusIndicator, StatusLabel } from 'kombase';

export default function StatusDemo() {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Success</h3>
        <Status variant="success">
          <StatusIndicator />
          <StatusLabel>Online</StatusLabel>
        </Status>
        <Status variant="success">
          <StatusLabel>Online</StatusLabel>
        </Status>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Error</h3>
        <Status variant="error">
          <StatusIndicator />
          <StatusLabel>Offline</StatusLabel>
        </Status>
        <Status variant="error">
          <StatusLabel>Offline</StatusLabel>
        </Status>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Warning</h3>
        <Status variant="warning">
          <StatusIndicator />
          <StatusLabel>Away</StatusLabel>
        </Status>
        <Status variant="warning">
          <StatusLabel>Away</StatusLabel>
        </Status>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Info</h3>
        <Status variant="info">
          <StatusIndicator />
          <StatusLabel>Idle</StatusLabel>
        </Status>
        <Status variant="info">
          <StatusLabel>Idle</StatusLabel>
        </Status>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Default</h3>
        <Status variant="default">
          <StatusIndicator />
          <StatusLabel>Unknown</StatusLabel>
        </Status>
        <Status variant="default">
          <StatusLabel>Unknown</StatusLabel>
        </Status>
      </div>
    </div>
  );
}
