import { FC, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
const { nightOwl } = require('react-syntax-highlighter/dist/cjs/styles/prism');
import { useClipboard } from 'use-clipboard-copy';

interface ConfigComponentProps {
  data: any;
  fileName: string;
  transformDataFunc?: (data: any) => any;
}

export const CodeComponent: FC<ConfigComponentProps> = ({ data, fileName, transformDataFunc }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const clipboard = useClipboard();

  const downloadJSON = (dataToDownload: any) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };

  const copyToClipboard = (dataToCopy: any) => {
    clipboard.copy(JSON.stringify(dataToCopy, null, 2));
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 500);
  };

  const dataToRender = transformDataFunc ? transformDataFunc(data) : data;

  return (
    <div className="group relative">
      <div className="absolute right-0 top-0 m-2 space-x-2">
        <button
          onClick={() => downloadJSON(data)}
          className="rounded-lg bg-[#243145] px-3 py-2 text-white"
        >
          <i className="pi pi-download"></i>
        </button>
        <button
          onClick={() => copyToClipboard(data)}
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
        {JSON.stringify(dataToRender, null, 2)}
      </SyntaxHighlighter>
    </div>
  );
};
