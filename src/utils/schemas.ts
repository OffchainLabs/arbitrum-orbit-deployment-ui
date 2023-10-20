import { z } from 'zod';
import { Address } from 'abitype/zod';

export const AddressSchema = Address;

export const PrivateKeySchema = z
  .string()
  .length(2 + 64)
  .regex(/^0x[0-9a-fA-F]+$/, 'Must be a valid private key');

export type PrivateKey = z.infer<typeof PrivateKeySchema>;
