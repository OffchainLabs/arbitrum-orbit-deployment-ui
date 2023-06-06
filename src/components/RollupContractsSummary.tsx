import { RollupContracts } from '@/types/RollupContracts';

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

export function RollupContractsSummary(props: RollupContracts) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="font-bold">Contracts Deployed</p>
        <p className="font-light">Feel free to copy and paste these for later reference.</p>
      </div>
      <ul className="flex flex-col gap-2 rounded-lg border border-black p-3">
        <li className="flex flex-col">
          <span className="font-bold">Rollup address:</span>
          <BlockExplorerLink href={`https://goerli.arbiscan.io/address/${props.rollup}`}>
            {props.rollup}
          </BlockExplorerLink>
        </li>
        <li className="flex flex-col">
          <span className="font-bold">Inbox address:</span>
          <BlockExplorerLink href={`https://goerli.arbiscan.io/address/${props.inbox}`}>
            {props.inbox}
          </BlockExplorerLink>
        </li>
        <li className="flex flex-col">
          <span className="font-bold">Admin Proxy address: </span>
          <BlockExplorerLink href={`https://goerli.arbiscan.io/address/${props.adminProxy}`}>
            {props.adminProxy}
          </BlockExplorerLink>
        </li>
        <li className="flex flex-col">
          <span className="font-bold">Sequencer Inbox address:</span>
          <BlockExplorerLink href={`https://goerli.arbiscan.io/address/${props.sequencerInbox}`}>
            {props.sequencerInbox}
          </BlockExplorerLink>
        </li>
        <li className="flex flex-col">
          <span className="font-bold">Bridge address:</span>
          <BlockExplorerLink href={`https://goerli.arbiscan.io/address/${props.bridge}`}>
            {props.bridge}
          </BlockExplorerLink>
        </li>
        <li className="flex flex-col">
          <span className="font-bold">Utils address:</span>
          <BlockExplorerLink href={`https://goerli.arbiscan.io/address/${props.utils}`}>
            {props.utils}
          </BlockExplorerLink>
        </li>
        <li className="flex flex-col">
          <span className="font-bold">Validator Wallet Creator address:</span>
          <BlockExplorerLink
            href={`https://goerli.arbiscan.io/address/${props.validatorWalletCreator}`}
          >
            {props.validatorWalletCreator}
          </BlockExplorerLink>
        </li>
        <li className="flex flex-col">
          <span className="font-bold">Deployed at block number:</span>
          <BlockExplorerLink
            href={`https://goerli.arbiscan.io/block/${props.deployedAtBlockNumber}`}
          >
            {props.deployedAtBlockNumber}
          </BlockExplorerLink>
        </li>
      </ul>
    </div>
  );
}
