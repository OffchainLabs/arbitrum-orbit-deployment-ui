// chainTypeForm.tsx
import { useStep } from '@/hooks/useStep';
import { ChainType, useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { ForwardedRef, forwardRef, useState } from 'react';

export const ChainTypeForm = forwardRef(({}, ref: ForwardedRef<HTMLFormElement>) => {
  const [, dispatch] = useDeploymentPageContext();
  const { nextStep } = useStep();
  const [{ chainType }] = useDeploymentPageContext();
  const [isChecked, setIsChecked] = useState<boolean>(chainType === ChainType.AnyTrust);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'set_chain_type',
      payload: isChecked ? ChainType.AnyTrust : ChainType.Rollup,
    });
    nextStep();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dapibus tellus id diam
        placerat, in pharetra orci efficitur.
      </p>
      <div className="flex gap-2 align-bottom">
        <label htmlFor="chainType" className="font-bold">
          Add AnyTrust Support
        </label>
        <input
          type="checkbox"
          name="chainType"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className={`mr-2 inline-block h-6 w-6 rounded border border-[#243145] ${
            isChecked && ' accent-[#243145]'
          }`}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white"
      >
        Next
      </button>
    </form>
  );
});
