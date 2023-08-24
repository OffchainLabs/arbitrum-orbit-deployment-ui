import { TextEncoder as NodeTextEncoder } from 'util';

// Polyfill TextEncoder for Jest (used in viem)
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = NodeTextEncoder;
}
