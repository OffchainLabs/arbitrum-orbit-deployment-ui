'use client';

import { useMemo, useState } from 'react';
import { useNetwork } from 'wagmi';
import { useClipboard } from 'use-clipboard-copy';

import { ExternalLink } from '@/components/ExternalLink';
import { StepTitle } from '@/components/StepTitle';
import { useConfigDownloads } from '@/hooks/useConfigDownloads';
import { ChainId } from '@/types/ChainId';
import { getRpcUrl } from '@/utils/getRpcUrl';

const CodeSnippet = ({ code }: { code: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const clipboard = useClipboard();
  const copyToClipboard = (dataToCopy: any) => {
    clipboard.copy(dataToCopy);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 500);
  };

  return (
    <div className="group relative">
      <div className="absolute right-0 top-0 m-2 space-x-2">
        <button
          onClick={() => copyToClipboard(code)}
          className="relative rounded-lg bg-gray-100 px-3 py-2 text-black"
        >
          <i className="pi pi-copy"></i>
          {showTooltip && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white">
              Copied
            </span>
          )}
        </button>
      </div>
      <pre className="overflow-auto rounded-lg bg-white p-4 text-sm text-black">{code}</pre>
    </div>
  );
};

export default function DeployLocallyPage() {
  const { chain } = useNetwork();
  const { downloadRollupConfig, downloadL3Config } = useConfigDownloads();

  const parentChainRpcUrl = useMemo(
    () => chain?.rpcUrls?.default?.http[0] ?? getRpcUrl(ChainId.ArbitrumSepolia),
    [chain],
  );

  return (
    <div className="flex flex-col gap-5 border border-solid border-grey p-8">
      <StepTitle>Deploy Locally</StepTitle>
      <p>
        Once you've downloaded both config files, please follow the steps below to complete local
        deployment of your Orbit chain. For more details on the steps involved and additional
        context, please visit the{' '}
        <ExternalLink
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
          className="underline"
        >
          documentation
        </ExternalLink>
        .
      </p>
      <ol className="list-decimal pl-4">
        <li>
          Clone the{' '}
          <ExternalLink
            href="https://github.com/OffchainLabs/orbit-setup-script"
            className="underline"
          >
            https://github.com/OffchainLabs/orbit-setup-script
          </ExternalLink>{' '}
          repository, and run:
          <br />
          <br />
          <CodeSnippet code={`yarn install`} />
          <br />
          Then, move both the{' '}
          <b onClick={downloadRollupConfig} className="cursor-pointer underline">
            nodeConfig.json
          </b>{' '}
          and{' '}
          <b onClick={downloadL3Config} className="cursor-pointer underline">
            orbitSetupScriptConfig.json
          </b>{' '}
          files into the <b>config</b> directory within the cloned repo.
        </li>
        <br />
        <li>
          Launch Docker, and in the base directory, run: <br />
          <br />
          <CodeSnippet code="docker compose up -d" />
          <br />
          This will launch the node with a Public RPC reachable at{' '}
          <ExternalLink href="http://localhost:8449" className="underline">
            http://localhost:8449
          </ExternalLink>{' '}
          and a corresponding BlockScout explorer instance, viewable at{' '}
          <ExternalLink href="http://localhost" className="underline">
            http://localhost
          </ExternalLink>
          .
        </li>
        <br />
        <li>
          Then, add the private key for the wallet you used to deploy the rollup contracts earlier
          in the following command, and run it: <br />
          <br />
          <CodeSnippet
            code={`PRIVATE_KEY="0xYourPrivateKey" L2_RPC_URL="${parentChainRpcUrl}" L3_RPC_URL="http://localhost:8449" yarn run setup`}
          />
        </li>
        <br />
        <li>
          The Orbit chain is now set up. You can find all the information about the newly deployed
          chain in the <b>outputInfo.json</b> file, which is in the main directory of the script
          folder.
        </li>
        <br />
        <li>
          Optionally, to track logs, run the following command within the base directory:
          <br />
          <br />
          <CodeSnippet code="docker compose logs -f nitro" />
        </li>
      </ol>
    </div>
  );
}
