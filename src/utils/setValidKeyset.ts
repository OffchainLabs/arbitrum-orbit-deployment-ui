import { AnyTrustConfigData } from '@/types/rollupConfigDataType';
import { ethers } from 'ethers';
import SequencerInbox from '@/ethereum/SequencerInbox.json';

export const setValidKeyset = async ({
  anyTrustConfigData,
  signer,
  keyset,
}: {
  anyTrustConfigData: AnyTrustConfigData;
  keyset: string;
  signer: ethers.Signer;
}) => {
  try {
    const keysetAddress = anyTrustConfigData.node['data-availability']['sequencer-inbox-address'];
    const sequencerInboxContract = new ethers.Contract(keysetAddress, SequencerInbox.abi, signer);
    return sequencerInboxContract.setValidKeyset(keyset);
  } catch (e) {
    throw new Error(`Error setting keyset: ${e}`);
  }
};
