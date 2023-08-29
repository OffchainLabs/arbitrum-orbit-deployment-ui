import { z } from 'zod';
import { Address } from 'abitype/zod';

export type RollupContracts = {
  rollup: string;
  inbox: string;
  outbox: string;
  adminProxy: string;
  sequencerInbox: string;
  bridge: string;
  utils: string;
  validatorWalletCreator: string;
  deployedAtBlockNumber: number;
};

export const ConfigWalletSchema = z.object({
  address: Address,
  privateKey: Address.optional(),
});

export type ConfigWallet = z.infer<typeof ConfigWalletSchema>;

export type RollupCreatedEvent = {
  args: {
    rollupAddress: `0x${string}`;
    inboxAddress: `0x${string}`;
    adminProxy: `0x${string}`;
    sequencerInbox: `0x${string}`;
    bridge: `0x${string}`;
  };
};
