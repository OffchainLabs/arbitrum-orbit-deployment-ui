import { PublicClient, WalletClient } from 'viem';
import { erc20ABI } from 'wagmi';

export type ApproveProps = {
  erc20ContractAddress: `0x${string}`;
  spender: `0x${string}`;
  amount: bigint;
  publicClient: PublicClient;
  walletClient: WalletClient;
};

export async function approve({
  erc20ContractAddress,
  spender,
  amount,
  publicClient,
  walletClient,
}: ApproveProps) {
  const account = walletClient.account?.address;

  if (typeof account === 'undefined') {
    throw new Error('[utils/erc20::approve] account is undefined');
  }

  walletClient.account?.address;
  const { request } = await publicClient.simulateContract({
    address: erc20ContractAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender, amount],
    account,
  });

  const hash = await walletClient.writeContract(request);
  return await publicClient.waitForTransactionReceipt({ hash: hash });
}

export type FetchAllowanceProps = {
  erc20ContractAddress: `0x${string}`;
  owner: `0x${string}`;
  spender: `0x${string}`;
  publicClient: PublicClient;
};

export async function fetchAllowance({
  erc20ContractAddress,
  owner,
  spender,
  publicClient,
}: FetchAllowanceProps) {
  return publicClient.readContract({
    address: erc20ContractAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [owner, spender],
  });
}
