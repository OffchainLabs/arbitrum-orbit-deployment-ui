import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { ScrollWrapper } from './ScrollWrapper';
import { WalletAddressManager } from './WalletAddressManager';

export const SetValidators = () => {
  const [{ validators: savedValidators }, dispatch] = useDeploymentPageContext();
  const { setValue } = useFormContext();

  const wallets = useMemo(() => {
    return savedValidators || [getRandomWallet()];
  }, [savedValidators]);

  const addresses = useMemo(() => {
    return wallets?.map((validator) => validator.address);
  }, [wallets]);

  const saveWallets = (wallets: Wallet[]) => {
    dispatch({
      type: 'set_validators',
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
    setValue('validators', addresses);
  }, [addresses]);
  return (
    <>
      <label className={'cursor-pointer underline'}>
        <ScrollWrapper anchor="validators">
          <span>Validators #</span>
        </ScrollWrapper>
      </label>
      <WalletAddressManager
        addresses={addresses}
        addWallet={addWallet}
        removeWallet={removeWallet}
        fieldName="validators"
        label="Validator"
      />
    </>
  );
};
