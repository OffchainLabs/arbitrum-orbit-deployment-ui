import { Wallet } from '@/types/RollupContracts';

// Remove the private key if the user entered a custom address
export const compareWallets = (wallets: Wallet[], addresses: string[]): Wallet[] => {
  return addresses
    .map((address) => {
      const wallet = wallets.find((w) => w.address === address);
      return {
        privateKey: wallet ? wallet.privateKey : undefined,
        address,
      };
    })
    .filter(Boolean);
};
