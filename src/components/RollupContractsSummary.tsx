import { RollupContracts } from '@/types/RollupContracts';

export function RollupContractsSummary(props: RollupContracts) {
  return (
    <div>
      <p>Rollup address: {props.rollup}</p>
      <p>Inbox address: {props.inbox}</p>
      <p>Admin Proxy address: {props.adminProxy}</p>
      <p>Sequencer Inbox address: {props.sequencerInbox}</p>
      <p>Bridge address: {props.bridge}</p>
      <p>Utils address: {props.utils}</p>
      <p>Validator Wallet Creator address: {props.validatorWalletCreator}</p>
      <p>Deployed at block number: {props.deployedAtBlockNumber}</p>
    </div>
  );
}
