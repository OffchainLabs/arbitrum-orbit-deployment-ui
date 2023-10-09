import { Address, isAddress } from 'viem';

export function assertIsAddress(value: any): asserts value is Address {
  if (typeof value !== 'string' || !isAddress(value)) {
    throw new Error(`${value} is not a valid address`);
  }
}
