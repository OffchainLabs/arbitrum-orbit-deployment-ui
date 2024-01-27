import { AddressSchema, PrivateKeySchema } from '@/utils/schemas';
import { z } from 'zod';

export const WalletSchema = z.object({
  address: AddressSchema,
  privateKey: PrivateKeySchema.optional(),
});
export type Wallet = z.infer<typeof WalletSchema>;
