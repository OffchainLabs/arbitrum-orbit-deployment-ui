import { ethers } from 'ethers';

export const getRandomWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  const privateKey = wallet.privateKey;
  const address = wallet.address;
  return { privateKey, address };
};
