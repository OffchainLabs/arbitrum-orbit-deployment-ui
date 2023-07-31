import { ExternalLink } from './ExternalLink';
import { StepTitle } from './StepTitle';

export const DeployLocallyComponent = () => {
  return (
    <div>
      <StepTitle>Deploy Locally</StepTitle>
      Once you've downloaded both config files, please follow the steps below to complete local
      deployment of your Orbit chain. For more details on the steps involved and additional context,
      please visit the{' '}
      <ExternalLink
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
        className="underline"
      >
        documentation
      </ExternalLink>
      .
      <br />
      <br />
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
          <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">yarn install</pre>
          <br />
          Then, move both the <b>nodeConfig.json</b> and <b>orbitSetupScriptConfig.json</b> files
          into the <b>config</b> directory within the cloned repo.
        </li>
        <br />
        <li>
          Launch Docker, and in the base directory, run: <br />
          <br />
          <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
            docker-compose up -d
          </pre>
          <br />
          This will launch the node with a Public RPC reachable at{' '}
          <ExternalLink href="http://localhost:8449" className="underline">
            http://localhost:8449
          </ExternalLink>{' '}
          and a corresponding BlockScout explorer instance, viewable at{' '}
          <ExternalLink href="http://localhost:4000" className="underline">
            http://localhost:4000
          </ExternalLink>
          .
        </li>
        <br />
        <li>
          Then, add the private key for the wallet you used to deploy the rollup contracts earlier
          in the following command, and run it: <br />
          <br />
          <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
            PRIVATE_KEY="0xYourPrivateKey" L2_RPC_URL="https://goerli-rollup.arbitrum.io/rpc"
            L3_RPC_URL="http://localhost:8449" yarn run setup
          </pre>
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
          <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
            docker-compose logs -f nitro
          </pre>
        </li>
      </ol>
    </div>
  );
};
