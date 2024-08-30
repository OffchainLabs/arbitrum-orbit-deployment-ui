import { Wallet } from '@/types/RollupContracts';
import { ScrollWrapper } from './ScrollWrapper';
import { WalletAddressManager } from './WalletAddressManager';
import { useState, useEffect } from 'react';
import { getRandomWallet } from '@/utils/getRandomWallet';

type SetBatchPostersProps = {
  savedBatchPosters?: Wallet[];
  onBatchPostersChange: (batchPosters: Wallet[]) => void;
};

export const SetBatchPosters = ({
  savedBatchPosters,
  onBatchPostersChange,
}: SetBatchPostersProps) => {
  const [batchPosters, setBatchPosters] = useState<Wallet[]>(
    () => savedBatchPosters || [getRandomWallet()],
  );

  useEffect(() => {
    onBatchPostersChange(batchPosters);
  }, [batchPosters, onBatchPostersChange]);

  const handleSetBatchPosters = (newBatchPosters: Wallet[]) => {
    setBatchPosters(newBatchPosters);
    onBatchPostersChange(newBatchPosters);
  };

  return (
    <>
      <label className={'cursor-pointer underline'}>
        <ScrollWrapper anchor="batch-posters">
          <span>Batch Posters #</span>
        </ScrollWrapper>
      </label>
      <WalletAddressManager
        wallets={batchPosters}
        setWallets={handleSetBatchPosters}
        fieldName="batchPosters"
        label="Batch Posters"
        maxWallets={16}
      />
    </>
  );
};
