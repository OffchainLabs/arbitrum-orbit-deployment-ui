import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { ConfigWallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useEffect, useState } from 'react';
import { StepTitle } from './StepTitle';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Address } from 'abitype/zod';

const validatorsSchema = z.object({
  numberOfValidators: z.number().min(1).max(16),
  addresses: z.array(Address),
});
type ValidatorsFormValues = z.infer<typeof validatorsSchema>;

export const SetValidators = () => {
  const [{ validators: savedWallets }, dispatch] = useDeploymentPageContext();
  const { nextStep, validatorFormRef } = useStep();

  const [walletCount, setWalletCount] = useState<number>(savedWallets?.length || 1);
  const [wallets, setWallets] = useState<ConfigWallet[]>(
    savedWallets || Array.from({ length: walletCount }, getRandomWallet),
  );

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validatorsSchema),
    defaultValues: {
      numberOfValidators: walletCount,
      addresses: wallets.map((wallet) => wallet.address),
    },
  });

  useEffect(() => {
    setWallets((prev) => {
      if (prev.length < walletCount) {
        return [...prev, ...Array.from({ length: walletCount - prev.length }, getRandomWallet)];
      } else {
        return prev.slice(0, walletCount);
      }
    });
    setValue(
      'addresses',
      wallets.slice(0, walletCount).map((wallet) => wallet.address),
    );
  }, [walletCount]);

  const onSubmit = (data: ValidatorsFormValues) => {
    // Remove the private key if the user entered a custom address
    const compareWallets = (
      wallets: ConfigWallet[],
      addresses: `0x${string}`[],
    ): ConfigWallet[] => {
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
    const payload = compareWallets(wallets, data.addresses);

    dispatch({ type: 'set_validators', payload });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" ref={validatorFormRef}>
      <StepTitle>Configure Validators</StepTitle>
      <div className="w-1/2">
        <TextInputWithInfoLink
          label="Number of Validators"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-4-configure-your-chains-validators`}
          name="numberOfValidators"
          placeholder="Number of validators"
          infoText="Read about Validators in the docs"
          type="number"
          {...(register('numberOfValidators'),
          {
            min: 1,
            max: 16,
            value: walletCount,
            onChange: (e) => {
              setWalletCount(Math.max(1, Math.min(16, Number(e.target.value))));
            },
          })}
        />
        {errors.numberOfValidators && (
          <p className="text-sm text-red-500">
            {JSON.stringify(errors.numberOfValidators?.message)}
          </p>
        )}
      </div>

      <label className="font-bold">Validators</label>
      <div className="mx-1 grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {wallets.slice(0, 8).map((wallet, index) => (
            <div key={wallet.address + index}>
              <input
                type="text"
                placeholder={`Validator Address ${index + 1}`}
                className={
                  'w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input ' +
                  (index === 0 && 'bg-gray-100')
                }
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
      </div>
    </form>
  );
};
