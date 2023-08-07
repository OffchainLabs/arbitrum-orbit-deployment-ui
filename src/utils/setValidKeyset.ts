import { PublicClient, WalletClient } from 'viem';
import { AnyTrustConfigData } from '@/types/rollupConfigDataType';
import SequencerInbox from '@/ethereum/SequencerInbox.json';
import { assertIsHexString } from './validators';

export const setValidKeyset = async ({
  anyTrustConfigData,
  account,
  publicClient,
  walletClient,
  keyset,
}: {
  anyTrustConfigData: AnyTrustConfigData;
  keyset: string;
  account: `0x${string}`;
  publicClient: PublicClient;
  walletClient: WalletClient;
}) => {
  try {
    const keysetAddress = anyTrustConfigData.node['data-availability']['sequencer-inbox-address'];
    assertIsHexString(keysetAddress);

    const { request } = await publicClient.simulateContract({
      address: keysetAddress,
      abi: SequencerInbox.abi,
      functionName: 'setValidKeyset',
      args: [keyset],
      account,
    });

    return walletClient.writeContract(request);
  } catch (e) {
    throw new Error(`Error setting keyset: ${e}`);
  }
};
