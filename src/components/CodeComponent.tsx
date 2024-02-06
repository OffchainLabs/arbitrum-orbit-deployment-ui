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

  const copyToClipboard = (dataToCopy: any) => {
    clipboard.copy(JSON.stringify(dataToCopy, null, 2));
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 500);
  };

  return (
    <div className="group relative">
      <div className="absolute right-1 top-0 m-2 space-x-2">
        <button
          onClick={() => copyToClipboard(dataToDownload)}
          className="relative rounded-lg bg-white px-3 py-2 text-black hover:bg-gray-200"
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
        wrapLines={true}
        customStyle={{ fontSize: '0.6rem' }}
        className="hide-scrollbar h-96 overflow-y-scroll"
      >
        {JSON.stringify(dataToDisplay, null, 2)}
      </SyntaxHighlighter>
    </div>
  );
};
