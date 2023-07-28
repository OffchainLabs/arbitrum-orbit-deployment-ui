import { useStep } from '@/hooks/useStep';
import { ChainType, useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { ForwardedRef, forwardRef, useState } from 'react';
import { OpenDocsLink } from './OpenDocsLink';

export const ChainTypeForm = forwardRef(({}, ref: ForwardedRef<HTMLFormElement>) => {
  const [, dispatch] = useDeploymentPageContext();
  const { nextStep } = useStep();
  const [{ chainType }] = useDeploymentPageContext();
  const [selectedChainType, setSelectedChainType] = useState<ChainType>(chainType);

  const handleChainTypeChange = (newChainType: ChainType) => {
    setSelectedChainType(newChainType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'set_chain_type',
      payload: selectedChainType,
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
      <OpenDocsLink />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dapibus tellus id diam
        placerat, in pharetra orci efficitur.
      </p>
      <div className="flex flex-col gap-2">
        <div
          className={
            'flex w-full cursor-pointer items-center rounded-lg border border-[#243145] p-2 accent-[#243145]  hover:bg-[#f2f7ff]' +
            (selectedChainType === ChainType.Rollup ? ' bg-[#f2f7ff]' : '')
          }
          onClick={() => {
            handleChainTypeChange(ChainType.Rollup);
          }}
        >
          <div className="flex w-1/3 justify-center">
            <input
              type="radio"
              id="rollup"
              name="chainType"
              value={ChainType.Rollup}
              checked={selectedChainType === ChainType.Rollup}
              className="h-6 w-6 cursor-pointer"
              readOnly
            />
          </div>
          <div className="m-2 flex cursor-pointer flex-col justify-center">
            <label htmlFor="rollup" className="cursor-pointer font-bold">
              Rollup
            </label>
            <span>
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
            </span>
          </div>
        </div>
        <div
          className={
            'flex cursor-pointer items-center rounded-lg border border-[#243145] p-2 accent-[#243145]  hover:bg-[#f2f7ff]' +
            (selectedChainType === ChainType.AnyTrust ? ' bg-[#f2f7ff]' : '')
          }
          onClick={() => {
            handleChainTypeChange(ChainType.AnyTrust);
          }}
        >
          <div className="flex w-1/3 justify-center">
            <input
              type="radio"
              id="anyTrust"
              name="chainType"
              value={ChainType.AnyTrust}
              checked={selectedChainType === ChainType.AnyTrust}
              className="ml-2 h-6 w-6 cursor-pointer"
              readOnly
            />
          </div>
          <div className="m-2 flex cursor-pointer flex-col justify-center">
            <label htmlFor="anyTrust" className="cursor-pointer font-bold">
              AnyTrust
            </label>
            <span>
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
            </span>
          </div>
        </div>
      </div>
    </form>
  );
});
