import { z } from 'zod';

export const AddressSchema = z
  .string()
  .length(42)
  .regex(/^0x[0-9a-fA-F]+$/, 'Must be a valid address');

export const PrivateKeySchema = z
  .string()
  .length(2 + 64)
  .regex(/^0x[0-9a-fA-F]+$/, 'Must be a valid private key');
