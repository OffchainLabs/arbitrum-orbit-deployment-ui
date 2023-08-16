import { ConfigWallet } from '@/types/RollupContracts';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export const getRandomWallet = () => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return { privateKey, address: account.address } as ConfigWallet;
};
