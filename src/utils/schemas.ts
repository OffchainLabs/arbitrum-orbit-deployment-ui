import { z } from 'zod';

export const AddressSchema = z
  .string()
  .length(42)
  .regex(/^0x[0-9a-fA-F]+$/, 'Must be a valid address');
