import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { EditableInput } from './EditableInput';
import { RemovableInput } from './RemovableInput';
import { useDeploymentPageContext } from './DeploymentPageContext';

type WalletAddressManagerProps = {
  fieldName: 'validators' | 'batch_posters';
  label: string;
  maxAddresses?: number;
};

/**
 * Manages a user-editable list of wallets with addresses and generated private keys.
 *
 * This component allows users to:
 * - Add new wallets
 * - Edit existing addresses
 * - Remove wallets (except the first one)
 *
 * @note Editing an address removes the associated private key data.
 */
export const WalletAddressManager = ({
  fieldName,
  label,
  maxAddresses = 16,
}: WalletAddressManagerProps) => {
  const [{ [fieldName]: savedWallets }, dispatch] = useDeploymentPageContext();
  const { register, setValue, formState, getValues } = useFormContext();
  const { errors } = formState;

  const wallets = useMemo(() => {
    return savedWallets || [getRandomWallet()];
  }, [savedWallets]);

  const addresses = useMemo(() => {
    return wallets?.map((wallet: Wallet) => wallet.address);
  }, [wallets]);

  const walletCount = addresses.length;
  const isMaxAddressCount = walletCount >= maxAddresses;

  const saveWallets = (newWallets: Wallet[]) => {
    dispatch({
      type: `set_${fieldName}` as const,
      payload: newWallets,
    });
  };

  const addWallet = () => {
    if (!isMaxAddressCount) {
      const newWallet = getRandomWallet();
      saveWallets([...wallets, newWallet]);
    }
  };

  const removeWallet = (index: number) => {
    if (walletCount > 1 && index !== 0) {
      const newWallets = wallets.filter((w: Wallet, i: number) => i !== index);
      saveWallets(newWallets);
      // Update form values
      const currentAddresses = getValues(fieldName);
      currentAddresses.splice(index, 1);
      setValue(fieldName, currentAddresses);
    }
  };

  useEffect(() => {
    setValue(fieldName, addresses);
  }, [addresses, fieldName, setValue]);

  useEffect(() => {
    addresses.forEach((address: string, index: number) => {
      setValue(`${fieldName}.${index}`, address);
    });
  }, []);

  // @ts-expect-error - react-hook-form doesn't handle the array properly
  const addressErrors = errors[fieldName] as { message: string }[];

  return (
    <div className="flex flex-col gap-2">
      {addresses.map((address: string, index: number) => (
        <div key={address + index}>
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
              onRemove={() => removeWallet(index)}
              error={addressErrors?.[index]?.message}
            />
          )}
        </div>
      ))}
      <button
        className={twMerge(
          'text-xs',
          !isMaxAddressCount && 'hover:underline',
          isMaxAddressCount && 'opacity-50',
        )}
        type="button"
        onClick={addWallet}
        disabled={isMaxAddressCount}
      >
        {isMaxAddressCount ? (
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
