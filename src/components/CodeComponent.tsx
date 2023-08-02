import { useConfigDownloads } from '@/hooks/useConfigDownloads';
import { FC, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
const { nightOwl } = require('react-syntax-highlighter/dist/cjs/styles/prism');
import { useClipboard } from 'use-clipboard-copy';

interface CodeComponentProps {
  fileName: string;
  dataToDownload: any;
  dataToDisplay: any;
}

export const CodeComponent: FC<CodeComponentProps> = ({
  fileName,
  dataToDownload,
  dataToDisplay,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const clipboard = useClipboard();
  const { downloadJSON } = useConfigDownloads();

  const copyToClipboard = (dataToCopy: any) => {
    clipboard.copy(JSON.stringify(dataToCopy, null, 2));
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 500);
  };

  return (
    <div className="group relative">
      <div className="absolute right-0 top-0 m-2 space-x-2">
        <button
          onClick={() => downloadJSON(dataToDownload, fileName)}
          className="rounded-lg bg-[#243145] px-3 py-2 text-white"
        >
          <i className="pi pi-download"></i>
        </button>
        <button
          onClick={() => copyToClipboard(dataToDownload)}
          className="relative rounded-lg bg-[#243145] px-3 py-2 text-white"
        >
          <i className="pi pi-copy"></i>
          {showTooltip && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white">
              Copied
            </span>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language="json"
        style={nightOwl}
        className="h-96 overflow-x-auto whitespace-pre-wrap break-all rounded-lg p-2 text-xs"
      >
        {JSON.stringify(dataToDisplay, null, 2)}
      </SyntaxHighlighter>
    </div>
  );
};
