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
  upgradeExecutorAddress: `0x${string}`;
  sequencerInboxAddress: `0x${string}`;
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
      address: upgradeExecutorAddress,
      abi: parseAbi(['function executeCall(address target, bytes targetCallData)']),
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
