import { z } from 'zod';
import { Address } from 'abitype/zod';

export const AddressSchema = Address;
export type Address = z.infer<typeof Address>;

export const PrivateKeySchema = z.string().transform((val, ctx) => {
  const regex = /^0x[a-fA-F0-9]{64}$/;

  if (!regex.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid Private Key ${val}`,
    });
  }

  return val as `0x${string}`;
});
export type PrivateKey = z.infer<typeof PrivateKeySchema>;

export const HexStringSchema = z.string().transform((val, ctx) => {
  const regex = /^0x[a-fA-F0-9]$/;

  if (!regex.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid Hex String ${val}`,
    });
  }

  return val as `0x${string}`;
});
export type HexString = z.infer<typeof HexStringSchema>;
