import { PublicClient, WalletClient, encodeFunctionData } from 'viem';

import SequencerInbox from '@/ethereum/SequencerInbox.json';
import UpgradeExecutor from '@/ethereum/UpgradeExecutor.json';

function getEncodedCallData(keyset: string) {
  return encodeFunctionData({
    abi: SequencerInbox.abi,
    functionName: 'setValidKeyset',
    args: [keyset],
  });
}

export const setValidKeyset = async ({
  upgradeExecutorAddress,
  sequencerInboxAddress,
  publicClient,
  walletClient,
  keyset,
}: {
  upgradeExecutorAddress: string;
  sequencerInboxAddress: string;
  keyset: string;
  publicClient: PublicClient;
  walletClient: WalletClient;
}) => {
  const account = walletClient.account?.address;

  if (typeof account === 'undefined') {
    throw new Error('[setValidKeyset] account is undefined');
  }

  try {
    const { request } = await publicClient.simulateContract({
      address: upgradeExecutorAddress as `0x${string}`,
      abi: UpgradeExecutor.abi,
      functionName: 'executeCall',
      args: [
        sequencerInboxAddress, // target
        getEncodedCallData(keyset), // targetCallData
      ],
      account,
    });

    return walletClient.writeContract(request);
  } catch (e) {
    throw new Error(`Error setting keyset: ${e}`);
  }
};
