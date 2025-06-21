import { Panel } from '@/plugin-ui/components/panel';
import { ToolbarButton } from './button';
import { ToolbarSection } from './section';
import { SettingsIcon, RefreshCwIcon } from 'lucide-react';
import { useVSCode } from '@/hooks/use-vscode';

export const SettingsButton = ({
  onOpenPanel,
  isActive = false,
}: {
  onOpenPanel: () => void;
  isActive?: boolean;
}) => (
  <ToolbarSection>
    <ToolbarButton onClick={onOpenPanel} active={isActive}>
      <SettingsIcon className="size-4" />
    </ToolbarButton>
  </ToolbarSection>
);

export const SettingsPanel = ({ onClose }: { onClose?: () => void }) => {
  return (
    <Panel>
      <Panel.Header title="Settings" />
      <Panel.Content>
        <ConnectionSettings />
      </Panel.Content>
      <Panel.Content>
        <ProjectInfoSection />
      </Panel.Content>
    </Panel>
  );
};

const ConnectionSettings = () => {
  const {
    windows,
    isDiscovering,
    discoveryError,
    discover,
    selectedSession,
    selectSession,
  } = useVSCode();

  const handleSessionChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const selectedSessionId = target.value === '' ? undefined : target.value;
    selectSession(selectedSessionId);
  };

  const { appName } = useVSCode();

  const handleRefresh = () => {
    discover();
  };

  return (
    <div className="space-y-4 pb-4">
      <div>
        <label
          htmlFor="session-select"
          className="mb-2 block font-medium text-sm text-zinc-700"
        >
          IDE Window {appName && `(${appName})`}
        </label>
        <div className="flex w-full items-center space-x-2">
          <select
            id="session-select"
            value={selectedSession?.sessionId || ''}
            onChange={handleSessionChange}
            className="h-8 min-w-0 flex-1 rounded-lg border border-zinc-300 bg-zinc-500/10 px-3 text-sm backdrop-saturate-150 focus:border-zinc-500 focus:outline-none"
            disabled={isDiscovering}
          >
            <option value="" disabled>
              {windows.length > 0
                ? 'Select an IDE window...'
                : 'No windows available'}
            </option>
            {windows.map((window) => (
              <option key={window.sessionId} value={window.sessionId}>
                {window.displayName} - Port {window.port}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isDiscovering}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-500/10 backdrop-saturate-150 transition-colors hover:bg-zinc-500/20 disabled:opacity-50"
            title="Refresh window list"
          >
            <RefreshCwIcon
              className={`size-4 ${isDiscovering ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
        {discoveryError && (
          <p className="mt-1 text-red-600 text-sm">
            Error discovering windows: {discoveryError}
          </p>
        )}
        {!isDiscovering && windows.length === 0 && !discoveryError && (
          <p className="mt-1 text-sm text-zinc-500">
            No IDE windows found. Make sure the Stagewise extension is installed
            and running.
          </p>
        )}
      </div>

      {selectedSession && (
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-blue-800 text-sm">
            <strong>Selected:</strong> {selectedSession.displayName}
          </p>
          <p className="mt-1 text-blue-600 text-xs">
            Session ID: {selectedSession.sessionId.substring(0, 8)}...
          </p>
        </div>
      )}

      {!selectedSession && windows.length > 0 && (
        <div className="rounded-lg bg-amber-50 p-3">
          <p className="text-amber-800 text-sm">
            <strong>No window selected:</strong> Please select an IDE window
            above to connect.
          </p>
        </div>
      )}
    </div>
  );
};

const ProjectInfoSection = () => (
  <div className="space-y-2 text-xs text-zinc-700">
    <div className="my-2 flex flex-wrap items-center gap-3">
      <a
        href="https://x.com/linusorii"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-700 hover:underline"
        title="OctopusDev on X"
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
        </svg>
        OctopusDev
      </a>
      <a
        href="https://github.com/lwaaron/stagewise"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-700 hover:underline"
        title="GitHub Repository"
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.08.79 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
        </svg>
        GitHub
      </a>
    </div>
  </div>
);
