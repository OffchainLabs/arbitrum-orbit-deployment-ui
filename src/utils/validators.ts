import { Address, isAddress } from 'viem';
import { PrivateKey, PrivateKeySchema } from './schemas';

export function assertIsAddress(value: any): asserts value is Address {
  if (typeof value !== 'string' || !isAddress(value)) {
    throw new Error(`${value} is not a valid address`);
  }
}

export function assertIsAddressArray(values: any[]): asserts values is Address[] {
  values.forEach(assertIsAddress);
}

export function assertIsPrivateKey(value: any): asserts value is PrivateKey {
  if (!PrivateKeySchema.parse(value)) throw new Error(`${value} is not a valid private key`);
}
