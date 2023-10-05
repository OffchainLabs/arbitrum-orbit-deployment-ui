import { PublicClient, WalletClient, encodeFunctionData, parseAbi } from 'viem';

function getEncodedCallData(keyset: `0x${string}`) {
  return encodeFunctionData({
    abi: parseAbi(['function setValidKeyset(bytes keysetBytes)']),
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
  keyset: `0x${string}`;
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
      abi: parseAbi(['function executeCall(address target, bytes targetCallData)']),
      functionName: 'executeCall',
      args: [
        sequencerInboxAddress as `0x${string}`, // target
        getEncodedCallData(keyset), // targetCallData
      ],
      account,
    });

    return walletClient.writeContract(request);
  } catch (e) {
    throw new Error(`Error setting keyset: ${e}`);
  }
};
