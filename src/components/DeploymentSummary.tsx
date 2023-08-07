'use client';

import { useDeploymentPageContext } from './DeploymentPageContext';

function BlockExplorerLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="font-light text-[#1366C1] underline"
    >
      {children}
    </a>
  );
}

export function DeploymentSummary() {
  const [{ rollupContracts, validators = [], batchPoster }] = useDeploymentPageContext();

  return (
    <div className="flex flex-col gap-3">
      {rollupContracts && (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold">Rollup Contracts</p>
          </div>
          <ul className="flex flex-col gap-2 rounded-lg border border-black p-3">
            <li className="flex flex-col">
              <span className="font-bold">Rollup address:</span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/address/${rollupContracts.rollup}`}
              >
                {rollupContracts.rollup}
              </BlockExplorerLink>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Inbox address:</span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/address/${rollupContracts.inbox}`}
              >
                {rollupContracts.inbox}
              </BlockExplorerLink>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Outbox address:</span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/address/${rollupContracts.outbox}`}
              >
                {rollupContracts.outbox}
              </BlockExplorerLink>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Admin Proxy address: </span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/address/${rollupContracts.adminProxy}`}
              >
                {rollupContracts.adminProxy}
              </BlockExplorerLink>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Sequencer Inbox address:</span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/address/${rollupContracts.sequencerInbox}`}
              >
                {rollupContracts.sequencerInbox}
              </BlockExplorerLink>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Bridge address:</span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/address/${rollupContracts.bridge}`}
              >
                {rollupContracts.bridge}
              </BlockExplorerLink>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Utils address:</span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/address/${rollupContracts.utils}`}
              >
                {rollupContracts.utils}
              </BlockExplorerLink>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Validator Wallet Creator address:</span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/address/${rollupContracts.validatorWalletCreator}`}
              >
                {rollupContracts.validatorWalletCreator}
              </BlockExplorerLink>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Deployed at block number:</span>
              <BlockExplorerLink
                href={`https://goerli.arbiscan.io/block/${rollupContracts.deployedAtBlockNumber}`}
              >
                {rollupContracts.deployedAtBlockNumber}
              </BlockExplorerLink>
            </li>
          </ul>
        </>
      )}
      {validators.length > 0 && (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold">Validators</p>
          </div>
          <ul className="flex flex-col gap-2 rounded-lg border border-black p-3">
            {validators.map((validator, index) => (
              <li className="flex flex-col">
                <span className="font-bold">Validator #{index + 1} address:</span>
                <BlockExplorerLink href={`https://goerli.arbiscan.io/address/${validator}`}>
                  {validator.address}
                </BlockExplorerLink>
              </li>
            ))}
          </ul>
        </>
      )}
      {batchPoster && (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold">Batch Poster</p>
          </div>
          <ul className="flex flex-col gap-2 rounded-lg border border-black p-3">
            <li className="flex flex-col">
              <span className="font-bold">Batch Poster address:</span>
              <BlockExplorerLink href={`https://goerli.arbiscan.io/address/${batchPoster}`}>
                {batchPoster.address}
              </BlockExplorerLink>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
