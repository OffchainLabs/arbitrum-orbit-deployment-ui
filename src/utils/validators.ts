import { Address, isAddress } from 'viem';

export function assertIsAddress(value: any): asserts value is Address {
  if (typeof value !== 'string' || !isAddress(value)) {
    throw new Error(`${value} is not a valid address`);
  }
}

export function assertIsAddressArray(values: any[]): asserts values is Address[] {
  values.forEach(assertIsAddress);
}
