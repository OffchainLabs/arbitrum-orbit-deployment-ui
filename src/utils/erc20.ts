import { PublicClient, WalletClient, maxInt256 } from 'viem';
import { erc20ABI } from 'wagmi';

export type ApproveProps = {
  erc20ContractAddress: `0x${string}`;
  spender: `0x${string}`;
  amount?: bigint;
  publicClient: PublicClient;
  walletClient: WalletClient;
  account: `0x${string}`;
};

export async function approve({
  erc20ContractAddress,
  spender,
  amount = maxInt256,
  publicClient,
  walletClient,
  account,
}: ApproveProps) {
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
