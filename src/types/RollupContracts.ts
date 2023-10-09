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
  upgradeExecutor: string;
};

export const WalletSchema = z.object({
  address: AddressSchema,
  privateKey: AddressSchema.optional(),
});

export type Wallet = z.infer<typeof WalletSchema>;

export const RollupCreatedEvent = z.object({
  args: z.object({
    rollupAddress: AddressSchema,
    inboxAddressSchema: AddressSchema,
    adminProxy: AddressSchema,
    sequencerInbox: AddressSchema,
    bridge: AddressSchema,
    nativeToken: AddressSchema,
    upgradeExecutor: AddressSchema,
  })
})

export type RollupCreatedEvent = z.infer<typeof RollupCreatedEvent>;
