import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { Validator } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useEffect, useState } from 'react';
import { StepTitle } from './StepTitle';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { z } from 'zod';

const addressSchema = z.string().regex(/^0x[0-9a-fA-F]+$/, 'Must be a valid address');
const validatorsSchema = z.object({
  numberOfValidators: z.number().min(1).max(16),
  validators: z.array(addressSchema),
});

export type ValidatorsFormValues = z.infer<typeof validatorsSchema>;

export const SetValidators = () => {
  const [{ validators: currentValidators }, dispatch] = useDeploymentPageContext();
  const { nextStep } = useStep();
  const [validatorCount, setValidatorCount] = useState<number>(currentValidators?.length || 1);

  const { handleSubmit, control, setValue } = useForm<ValidatorsFormValues>({
    resolver: zodResolver(validatorsSchema),
  });

  const initialValidators =
    currentValidators || Array.from({ length: validatorCount }, getRandomWallet);

  useEffect(() => {
    setValue('validators', Array.from({ length: validatorCount }, getRandomWallet));
  }, [validatorCount]);

  const onSubmit = (data: ValidatorsFormValues) => {
    dispatch({ type: 'set_validators', payload: data.validators.filter(Boolean) });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <StepTitle>Configure Validators</StepTitle>
      <div className="w-1/2">
        <Controller
          name="numberOfValidators"
          control={control}
          defaultValue={validatorCount}
          render={({ field }) => (
            <TextInputWithInfoLink
              label="Number of Validators"
              href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-4-configure-your-chains-validators`}
              placeholder="Number of validators"
              infoText="Read about Validators in the docs"
              type="number"
              min={1}
              max={16}
              {...field}
              onChange={(e) => {
                setValidatorCount(Math.max(1, Math.min(16, Number(e.target.value))));
                field.onChange(e);
              }}
            />
          )}
        />
      </div>
      <label className="font-bold">Validators</label>
      <div className="mx-1 grid grid-cols-2 gap-2">
        {Array.from({ length: 16 }, (_, index) => (
          <div key={index}>
            <Controller
              name={`validators.${index}`}
              control={control}
              defaultValue={initialValidators[index]?.address || ''} // Set the default value here
              render={({ field }) => (
                <input
                  type="text"
                  placeholder={`Validator ${index + 1}`}
                  className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
                  disabled={index === 0}
                  {...field}
                />
              )}
            />
          </div>
        ))}
      </div>
    </form>
  );
};
