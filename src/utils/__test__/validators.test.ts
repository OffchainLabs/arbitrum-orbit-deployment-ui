import { assertIsHexString } from '../validators';

describe('assertIsHexString Function', () => {
  it('should not throw an error for a valid EVM address', () => {
    expect(() => {
      assertIsHexString('0x13E43860E53d4Fc0775e6BE7a8c5ca5D6F001f8b');
    }).not.toThrow();
  });

  it('should not throw an error for a valid hex string', () => {
    expect(() => {
      assertIsHexString('0x1aF3');
    }).not.toThrow();
  });

  it('should not throw an error for a short hex string', () => {
    expect(() => {
      assertIsHexString('0x0');
    }).not.toThrow();
  });

  it('should throw an error for an empty hex string', () => {
    expect(() => {
      assertIsHexString('0x');
    }).toThrow();
  });

  it('should throw an error for a non-string value', () => {
    expect(() => {
      assertIsHexString(12345);
    }).toThrow('Value must be of type `0x${string}`');
  });

  it('should throw an error for a string without 0x prefix', () => {
    expect(() => {
      assertIsHexString('1aF3');
    }).toThrow('Value must be of type `0x${string}`');
  });

  it('should throw an error for a string with non-hex characters', () => {
    expect(() => {
      assertIsHexString('0x1aG3');
    }).toThrow('Value must be of type `0x${string}`');
  });

  it('should throw an error for null value', () => {
    expect(() => {
      assertIsHexString(null);
    }).toThrow('Value must be of type `0x${string}`');
  });

  it('should throw an error for undefined value', () => {
    expect(() => {
      assertIsHexString(undefined);
    }).toThrow('Value must be of type `0x${string}`');
  });
});
