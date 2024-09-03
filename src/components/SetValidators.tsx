import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { ScrollWrapper } from './ScrollWrapper';
import { EditableInput } from './EditableInput';
import { RemovableInput } from './RemovableInput';

type SetValidatorsProps = {
  wallets: Wallet[];
  setWallets: (wallets: Wallet[]) => void;
  walletCount: number;
  setWalletCount: (walletCount: number) => void;
};

export const SetValidators = ({
  wallets,
  setWallets,
  walletCount,
  setWalletCount,
}: SetValidatorsProps) => {
  const { register, setValue, formState, getValues } = useFormContext();
  const { errors } = formState;

  const isMaxWalletCount = walletCount >= 16;

  useEffect(() => {
    wallets.forEach((wallet, index) => {
      setValue(`addresses.${index}`, wallet.address);
    });
  }, []);

  const handleAddValidator = () => {
    if (!isMaxWalletCount) {
      const newWallet = getRandomWallet();
      setValue(`addresses.${walletCount}`, newWallet.address);
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
      const currentAddresses = getValues('addresses');
      currentAddresses.splice(index, 1);
      setValue('addresses', currentAddresses);
    }
  };

  // @ts-expect-error - react-hook-form doesn't handle the array properly
  const addressErrors = errors.addresses as { message: string }[];

  return (
    <>
      <label className={'cursor-pointer underline'}>
        <ScrollWrapper anchor="validators">
          <span>{'Validators #'}</span>
        </ScrollWrapper>
      </label>
      <div className="flex flex-col gap-2">
        {wallets.map((wallet, index) => (
          <div key={wallet.address + index}>
            {index === 0 ? (
              <EditableInput
                name={`addresses.${index}`}
                placeholder={`Validator Address ${index + 1}`}
                register={() => register(`addresses.${index}`)}
                error={addressErrors?.[index]?.message}
              />
            ) : (
              <RemovableInput
                placeholder={`Validator Address ${index + 1}`}
                register={register(`addresses.${index}`)}
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
          onClick={handleAddValidator}
          disabled={isMaxWalletCount}
        >
          {isMaxWalletCount ? (
            <span>Maximum Number of Validators</span>
          ) : (
            <>
              <i className="pi pi-plus-circle mr-1 text-xs" />
              Add Validator
            </>
          )}
        </button>
      </div>
    </>
  );
};
