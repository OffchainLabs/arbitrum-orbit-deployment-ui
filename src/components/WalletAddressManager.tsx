import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { EditableInput } from './EditableInput';
import { RemovableInput } from './RemovableInput';

type WalletAddressManagerProps = {
  wallets: Wallet[];
  setWallets: (wallets: Wallet[]) => void;
  fieldName: string;
  label: string;
  maxWallets?: number;
};

export const WalletAddressManager = ({
  wallets,
  setWallets,
  fieldName,
  label,
  maxWallets = 16,
}: WalletAddressManagerProps) => {
  const { register, setValue, formState, getValues } = useFormContext();
  const { errors } = formState;
  const [walletCount, setWalletCount] = useState(wallets.length);

  const isMaxWalletCount = walletCount >= maxWallets;

  useEffect(() => {
    wallets.forEach((wallet, index) => {
      setValue(`${fieldName}.${index}`, wallet.address);
    });
  }, []);

  const handleAddWallet = () => {
    if (!isMaxWalletCount) {
      const newWallet = getRandomWallet();
      setValue(`${fieldName}.${walletCount}`, newWallet.address);
      setWalletCount(walletCount + 1);
      setWallets([...wallets, newWallet]);
    }
  };

  const handleRemoveWallet = (index: number) => {
    if (walletCount > 1 && index !== 0) {
      const newWallets = [...wallets];
      newWallets.splice(index, 1);
      setWallets(newWallets);
      setWalletCount(walletCount - 1);

      // Update form values
      const currentAddresses = getValues(fieldName);
      currentAddresses.splice(index, 1);
      setValue(fieldName, currentAddresses);
    }
  };

  // @ts-expect-error - react-hook-form doesn't handle the array properly
  const addressErrors = errors[fieldName] as { message: string }[];

  return (
    <div className="flex flex-col gap-2">
      {wallets.map((wallet, index) => (
        <div key={wallet.address + index}>
          {index === 0 ? (
            <EditableInput
              name={`${fieldName}.${index}`}
              placeholder={`${label} Address ${index + 1}`}
              register={() => register(`${fieldName}.${index}`)}
              error={addressErrors?.[index]?.message}
            />
          ) : (
            <RemovableInput
              placeholder={`${label} Address ${index + 1}`}
              register={register(`${fieldName}.${index}`)}
              onRemove={() => handleRemoveWallet(index)}
              error={addressErrors?.[index]?.message}
            />
          )}
        </div>
      ))}
      <button
        className={twMerge(
          'text-xs',
          !isMaxWalletCount && 'hover:underline',
          isMaxWalletCount && 'opacity-50',
        )}
        type="button"
        onClick={handleAddWallet}
        disabled={isMaxWalletCount}
      >
        {isMaxWalletCount ? (
          <span>Maximum Number of {label}s</span>
        ) : (
          <>
            <i className="pi pi-plus-circle mr-1 text-xs" />
            Add {label}
          </>
        )}
      </button>
    </div>
  );
};
