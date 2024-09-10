import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { EditableInput } from './EditableInput';
import { RemovableInput } from './RemovableInput';

type AddressManagerProps = {
  addresses: string[];
  addWallet: () => void;
  removeWallet: (index: number) => void;
  fieldName: string;
  label: string;
  maxAddresses?: number;
};

export const WalletAddressManager = ({
  addresses,
  addWallet,
  removeWallet,
  fieldName,
  label,
  maxAddresses = 16,
}: AddressManagerProps) => {
  const { register, setValue, formState, getValues } = useFormContext();
  const { errors } = formState;

  const walletCount = addresses.length;

  const isMaxAddressCount = walletCount >= maxAddresses;

  useEffect(() => {
    addresses.forEach((address, index) => {
      setValue(`${fieldName}.${index}`, address);
    });
  }, []);

  const handleAddWallet = () => {
    if (!isMaxAddressCount) {
      addWallet();
    }
  };

  const handleRemoveWallet = (index: number) => {
    if (walletCount > 1 && index !== 0) {
      removeWallet(index);
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
      {addresses.map((address, index) => (
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
              onRemove={() => handleRemoveWallet(index)}
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
        onClick={handleAddWallet}
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
