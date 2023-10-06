import { isAddress } from 'viem';

export function assertIsAddress(value: any): asserts value is `0x${string}` {
  if (typeof value !== 'string' || !isAddress(value)) {
    throw new Error('Value must be of type `0x${string}`');
  }
}
