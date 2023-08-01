import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { Validator } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { StepTitle } from './StepTitle';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';

export const SetValidators = forwardRef(({}, ref: ForwardedRef<HTMLFormElement>) => {
  const [{ validators: currentValidators }, dispatch] = useDeploymentPageContext();
  const { nextStep } = useStep();
  const [validatorCount, setValidatorCount] = useState<number>(currentValidators?.length || 1);
  const [validators, setValidators] = useState<Validator[]>(
    currentValidators || Array.from({ length: validatorCount }, getRandomWallet),
  );

  useEffect(() => {
    setValidators((prev) => {
      if (prev.length < validatorCount) {
        return [...prev, ...Array.from({ length: validatorCount - prev.length }, getRandomWallet)];
      } else {
        return prev.slice(0, validatorCount);
      }
    });
  }, [validatorCount]);

  const handleAddressChange = (index: number, value: string) => {
    setValidators((prev) => {
      const newValidators = [...prev];
      newValidators[index] = { address: value, privateKey: undefined };
      return newValidators;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({ type: 'set_validators', payload: validators.filter(Boolean) });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
      <StepTitle>Configure Validators</StepTitle>
      <div className="w-1/2">
        <TextInputWithInfoLink
          label="Number of Validators"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-4-configure-your-chains-validators`}
          name="numberOfValidators"
          placeholder="Number of validators"
          infoText="Read about Validators in the docs"
          type="number"
          min={1}
          max={16}
          value={validatorCount.toString()}
          onChange={(e) => setValidatorCount(Math.max(1, Math.min(16, Number(e.target.value))))}
        />
      </div>

      <label className="font-bold">Validators</label>
      <div className="mx-1 grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {validators.slice(0, 8).map((validator, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Validator ${index + 1}`}
                value={validator.address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
                disabled={index === 0}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {validators.slice(8, 16).map((validator, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Validator ${index + 1}`}
                value={validator.address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
                disabled={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
});
