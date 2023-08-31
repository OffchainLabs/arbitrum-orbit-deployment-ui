import { z } from 'zod';
import { AddressSchema } from '@/utils/schemas';

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
  nativeToken: string;
};

export const WalletSchema = z.object({
  address: AddressSchema,
  privateKey: AddressSchema.optional(),
});

export type Wallet = z.infer<typeof WalletSchema>;

export type RollupCreatedEvent = {
  args: {
    rollupAddress: `0x${string}`;
    inboxAddress: `0x${string}`;
    adminProxy: `0x${string}`;
    sequencerInbox: `0x${string}`;
    bridge: `0x${string}`;
    nativeToken: `0x${string}`;
  };
};
