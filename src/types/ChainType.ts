export const ChainType = {
  Rollup: 'Rollup',
  AnyTrust: 'AnyTrust',
} as const;

export type ChainType = (typeof ChainType)[keyof typeof ChainType];
