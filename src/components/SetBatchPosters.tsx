import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { ScrollWrapper } from './ScrollWrapper';
import { WalletAddressManager } from './WalletAddressManager';

export const SetBatchPosters = () => {
  const [{ batchPosters: savedBatchPosters }, dispatch] = useDeploymentPageContext();
  const { setValue } = useFormContext();

  const wallets = useMemo(() => {
    return savedBatchPosters || [getRandomWallet()];
  }, [savedBatchPosters]);

  const addresses = useMemo(() => {
    return wallets?.map((poster) => poster.address);
  }, [wallets]);

  const saveWallets = (wallets: Wallet[]) => {
    dispatch({
      type: 'set_batch_posters',
      payload: wallets,
    });
  };

  const addWallet = () => {
    const newWallet = getRandomWallet();
    saveWallets([...wallets, newWallet]);
  };

  const removeWallet = (index: number) => {
    const newWallets = wallets.filter((_, i) => i !== index);
    saveWallets(newWallets);
  };

  useEffect(() => {
    setValue('batchPosters', addresses);
  }, [addresses]);

  return (
    <>
      <label className={'cursor-pointer underline'}>
        <ScrollWrapper anchor="batch-posters">
          <span>Batch Posters #</span>
        </ScrollWrapper>
      </label>
      <WalletAddressManager
        addresses={addresses}
        addWallet={addWallet}
        removeWallet={removeWallet}
        fieldName="batchPosters"
        label="Batch Posters"
      />
    </>
  );
};
