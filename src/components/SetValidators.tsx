import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { z } from 'zod';

import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { AddressSchema } from '@/utils/schemas';
import { twJoin } from 'tailwind-merge';
import { useDeploymentPageContext } from './DeploymentPageContext';

const validatorsSchema = z.array(AddressSchema);
type ValidatorsFormValues = z.infer<typeof validatorsSchema>;

export const SetValidators = forwardRef(({ errors, register, setValue }: any, ref: any) => {
  const [{ validators: savedWallets }, dispatch] = useDeploymentPageContext();

  const [walletCount, setWalletCount] = useState<number>(savedWallets?.length || 1);
  const [wallets, setWallets] = useState<Wallet[]>(
    savedWallets || Array.from({ length: walletCount }, getRandomWallet),
  );

  const handleAddValidator = () => {
    setWalletCount((walletCount) => walletCount + 1);
  };

  useEffect(() => {
    const newWallets =
      wallets.length < walletCount
        ? [...wallets, ...Array.from({ length: walletCount - wallets.length }, getRandomWallet)] // Add new wallets
        : wallets.slice(0, walletCount); // Remove wallets

    setWallets(newWallets);
    setValue(
      'addresses',
      newWallets.map((wallet) => wallet.address),
    );
  }, [walletCount]);

  const onSubmit = (data: ValidatorsFormValues) => {
    // Remove the private key if the user entered a custom address
    const compareWallets = (wallets: Wallet[], addresses: string[]): Wallet[] => {
      return addresses
        .map((address) => {
          const wallet = wallets.find((w) => w.address === address);
          return {
            privateKey: wallet ? wallet.privateKey : undefined,
            address,
          };
        })
        .filter(Boolean);
    };
    const payload = compareWallets(wallets, data);

    dispatch({ type: 'set_validators', payload });
  };

  useImperativeHandle(ref, () => {
    return { onSubmit };
  });

  return (
    <div ref={ref}>
      <label className="font-bold">Validators</label>

      <div className="mx-1 grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {wallets.slice(0, 8).map((wallet, index) => (
            <div key={wallet.address + index}>
              <input
                type="text"
                placeholder={`Validator Address ${index + 1}`}
                className={twJoin(
                  'w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input',
                  index === 0 && 'cursor-not-allowed bg-gray-200 opacity-50',
                )}
                readOnly={index === 0}
                {...register(`addresses.${index}`, {
                  value: wallet.address,
                })}
              />
              {errors.addresses?.[index] && (
                <p className="text-sm text-red-500">{String(errors.addresses[index]?.message)}</p>
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
                className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
                {...register(`addresses.${index + 8}`, {
                  value: wallet.address,
                })}
              />
              {errors.addresses?.[index + 8] && (
                <p className="text-sm text-red-500">
                  {String(errors.addresses[index + 8]?.message)}
                </p>
              )}
            </div>
          ))}
        </div>
        <span className="cursor-pointer text-xs hover:underline" onClick={handleAddValidator}>
          <i className="pi pi-plus-circle mr-1 text-xs" />
          Add Validator
        </span>
      </div>
    </div>
  );
});
