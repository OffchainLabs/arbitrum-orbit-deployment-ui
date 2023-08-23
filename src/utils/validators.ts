export function assertIsHexString(value: any): asserts value is `0x${string}` {
  if (typeof value !== 'string' || !/^0x[0-9a-fA-F]+$/.test(value)) {
    throw new Error('Value must be of type `0x${string}`');
  }
}
