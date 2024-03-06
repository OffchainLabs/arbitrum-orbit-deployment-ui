import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { ScrollWrapper } from './ScrollWrapper';

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
  const { register, setValue, formState } = useFormContext();
  const { errors } = formState;

  const isMaxWalletCount = walletCount >= 16;

  const handleAddValidator = () => {
    if (!isMaxWalletCount) {
      const newWallet = getRandomWallet();
      setValue(`addresses.${walletCount}`, newWallet.address);
      setWalletCount(walletCount + 1);
      setWallets([...wallets, newWallet]);
    }
  };

  // @ts-expect-error - react-hook-form doesn't handle the array properly
  const addressErrors = errors.addresses as { message: string }[];

  return (
    <ScrollWrapper anchor="validators">
      <label className={'cursor-pointer underline'}>
        <span>{'Validators #'}</span>
      </label>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {wallets.slice(0, 8).map((wallet, index) => (
            <div key={wallet.address + index}>
              <input
                type="text"
                placeholder={`Validator Address ${index + 1}`}
                className={twMerge(
                  'w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input',
                  index === 0 && 'cursor-not-allowed bg-gray-200 opacity-50',
                  addressErrors?.[index] && 'border-red-500',
                )}
                readOnly={index === 0}
                {...register(`addresses.${index}`)}
              />
              {addressErrors?.[index] && (
                <p className="text-sm text-red-500">{String(addressErrors[index]?.message)}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {wallets.slice(8, 16).map((wallet, index) => (
            <div key={wallet.address + index}>
              <input
                type="text"
                placeholder={`Validator ${index + 9}`}
                className={twMerge(
                  'w-full rounded-md border border-[#6D6D6D] px-3 py-2 shadow-input',
                  addressErrors?.[index + 8] && 'border-red-500',
                )}
                {...register(`addresses.${index + 8}`)}
              />
              {addressErrors?.[index + 8] && (
                <p className="text-sm text-red-500">{String(addressErrors[index + 8]?.message)}</p>
              )}
            </div>
          ))}
        </div>
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
    </ScrollWrapper>
  );
};
