import { Wallet } from '@/types/RollupContracts';
import { ScrollWrapper } from './ScrollWrapper';
import { WalletAddressManager } from './WalletAddressManager';
import { useState, useEffect } from 'react';
import { getRandomWallet } from '@/utils/getRandomWallet';

type SetValidatorsProps = {
  savedWallets?: Wallet[];
  onWalletsChange: (wallets: Wallet[]) => void;
};

export const SetValidators = ({ savedWallets, onWalletsChange }: SetValidatorsProps) => {
  const [wallets, setWallets] = useState<Wallet[]>(() => savedWallets || [getRandomWallet()]);

  useEffect(() => {
    onWalletsChange(wallets);
  }, [wallets, onWalletsChange]);

  const handleSetWallets = (newWallets: Wallet[]) => {
    setWallets(newWallets);
    onWalletsChange(newWallets);
  };

  return (
    <>
      <label className={'cursor-pointer underline'}>
        <ScrollWrapper anchor="validators">
          <span>{`Validators # (${wallets.length})`}</span>
        </ScrollWrapper>
      </label>
      <WalletAddressManager
        wallets={wallets}
        setWallets={handleSetWallets}
        fieldName="addresses"
        label="Validator"
        maxWallets={16}
      />
    </>
  );
};
