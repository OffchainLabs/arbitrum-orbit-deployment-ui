'use client';

import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

import { ChainId } from '@/types/ChainId';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { getBlockExplorerUrl } from '@/utils/getBlockExplorerUrl';

function BlockExplorerLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="overflow-clip text-ellipsis text-sm font-light underline"
    >
      {children}
    </a>
  );
}

export function DeploymentSummary() {
  const { chain } = useNetwork();

  const [{ rollupContracts, validators = [], batch_posters: batchPosters = [] }] =
    useDeploymentPageContext();

  const blockExplorerUrl = useMemo(
    () => chain?.blockExplorers?.default?.url ?? getBlockExplorerUrl(ChainId.ArbitrumSepolia),
    [chain],
  );

  return (
    <div className="flex w-full flex-wrap gap-10 md:flex-nowrap">
      <div className="flex w-full flex-col md:w-1/2">
        {rollupContracts && (
          <div>
            <p className="mb-2 text-xl font-light">Rollup Contracts</p>
            <ul className="flex flex-col gap-3 rounded-sm border border-[#5E5E5E] bg-[#191919] p-4">
              <li className="flex flex-col" key={rollupContracts.rollup}>
                <span className="text-sm font-medium">Rollup address:</span>
                <BlockExplorerLink href={`${blockExplorerUrl}/address/${rollupContracts.rollup}`}>
                  {rollupContracts.rollup}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col">
                <span className="text-sm font-medium" key={rollupContracts.inbox}>
                  Inbox address:
                </span>
                <BlockExplorerLink href={`${blockExplorerUrl}/address/${rollupContracts.inbox}`}>
                  {rollupContracts.inbox}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col">
                <span className="text-sm font-medium" key={rollupContracts.outbox}>
                  Outbox address:
                </span>
                <BlockExplorerLink href={`${blockExplorerUrl}/address/${rollupContracts.outbox}`}>
                  {rollupContracts.outbox}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col">
                <span className="text-sm font-medium" key={rollupContracts.adminProxy}>
                  Admin Proxy address:{' '}
                </span>
                <BlockExplorerLink
                  href={`${blockExplorerUrl}/address/${rollupContracts.adminProxy}`}
                >
                  {rollupContracts.adminProxy}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col" key={rollupContracts.sequencerInbox}>
                <span className="text-sm font-medium">Sequencer Inbox address:</span>
                <BlockExplorerLink
                  href={`${blockExplorerUrl}/address/${rollupContracts.sequencerInbox}`}
                >
                  {rollupContracts.sequencerInbox}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col" key={rollupContracts.bridge}>
                <span className="text-sm font-medium">Bridge address:</span>
                <BlockExplorerLink href={`${blockExplorerUrl}/address/${rollupContracts.bridge}`}>
                  {rollupContracts.bridge}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col" key={rollupContracts.validatorUtils}>
                <span className="text-sm font-medium">Validator Utils address:</span>
                <BlockExplorerLink
                  href={`${blockExplorerUrl}/address/${rollupContracts.validatorUtils}`}
                >
                  {rollupContracts.validatorUtils}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col" key={rollupContracts.validatorWalletCreator}>
                <span className="text-sm font-medium">Validator Wallet Creator address:</span>
                <BlockExplorerLink
                  href={`${blockExplorerUrl}/address/${rollupContracts.validatorWalletCreator}`}
                >
                  {rollupContracts.validatorWalletCreator}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col" key={rollupContracts.upgradeExecutor}>
                <span className="text-sm font-medium">Upgrade Executor address:</span>
                <BlockExplorerLink
                  href={`${blockExplorerUrl}/address/${rollupContracts.upgradeExecutor}`}
                >
                  {rollupContracts.upgradeExecutor}
                </BlockExplorerLink>
              </li>
              <li className="flex flex-col" key={rollupContracts.deployedAtBlockNumber}>
                <span className="text-sm font-medium">Deployed at block number:</span>
                <BlockExplorerLink
                  href={`${blockExplorerUrl}/block/${rollupContracts.deployedAtBlockNumber}`}
                >
                  {rollupContracts.deployedAtBlockNumber}
                </BlockExplorerLink>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col md:w-1/2">
        {validators.length > 0 && (
          <div>
            <p className="mb-2 text-xl font-light">Validators</p>
            <ul className="flex flex-col gap-3 rounded-sm border border-[#5E5E5E] bg-[#191919] p-4">
              {validators.map((validator, index) => (
                <li className="flex flex-col" key={validator.address}>
                  <BlockExplorerLink href={`${blockExplorerUrl}/address/${validator.address}`}>
                    {validator.address}
                  </BlockExplorerLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        {batchPosters.length > 0 && (
          <div>
            <p className="mb-2 text-xl font-light">Batch Poster</p>
            <ul className="flex flex-col gap-3 rounded-sm border border-[#5E5E5E] bg-[#191919] p-4">
              {batchPosters.map((batchPoster, index) => (
                <li className="flex flex-col" key={batchPoster.address}>
                  <BlockExplorerLink href={`${blockExplorerUrl}/address/${batchPoster.address}`}>
                    {batchPoster.address}
                  </BlockExplorerLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
