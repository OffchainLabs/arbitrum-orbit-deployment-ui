import { useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { Validator } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { ForwardedRef, forwardRef, useState, useEffect } from 'react';

export const SetValidators = forwardRef(({}, ref: ForwardedRef<HTMLFormElement>) => {
  const [{ validators: currentValidators }, dispatch] = useDeploymentPageContext();
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
    dispatch({ type: 'next_step' });
  };

  return (
    <div className="flex flex-col gap-4">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
        className="text-lg font-bold uppercase text-[#1366C1] underline"
      >
        Open supporting documentation for this flow
      </a>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
        <label htmlFor="numberOfValidators" className="font-bold">
          Number of Validators
        </label>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-4-configure-your-chains-validators`}
          className="font-light text-[#6D6D6D] underline"
        >
          Read about Validators in the docs
        </a>
        <input
          name="numberOfValidators"
          type="number"
          placeholder="Number of validators"
          min={1}
          max={16}
          value={validatorCount}
          onChange={(e) => setValidatorCount(Math.max(1, Math.min(16, Number(e.target.value))))}
          className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
        />

        <label className="font-bold">Validators</label>
        {validators.map((validator, index) => (
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
        <button
          type="submit"
          className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
        >
          Next
        </button>
      </form>
    </div>
  );
});
