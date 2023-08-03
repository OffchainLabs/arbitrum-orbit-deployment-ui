import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from '@/pages/deployment/DeploymentPageContext';
import { RollupConfig } from '@/types/rollupConfigDataType';
import { ForwardedRef, forwardRef } from 'react';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { SelectInputWithInfoLink } from './SelectInputWithInfoLink';
import { StepTitle } from './StepTitle';

type StakeTokenType = 'ETH' | 'Custom';

export const RollupConfigInput = forwardRef(({}, ref: ForwardedRef<HTMLFormElement>) => {
  const [{ rollupConfig }, dispatch] = useDeploymentPageContext();
  const { nextStep } = useStep();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedRollupConfig: Partial<RollupConfig> = {};
    for (const [key, defaultValue] of formData.entries()) {
      //@ts-expect-error - key is a string
      updatedRollupConfig[key] = defaultValue;
    }

    if (rollupConfig !== undefined) {
      dispatch({
        type: 'set_rollup_config',
        payload: { ...rollupConfig, ...updatedRollupConfig },
      });

      nextStep();
    }
  };

  const commonDocLink = `${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration`;

  return (
    <>
      <StepTitle>Configure Rollup</StepTitle>
      <form onSubmit={handleSubmit} className="mx-0 grid grid-cols-2 gap-4 py-4" ref={ref}>
        <TextInputWithInfoLink
          label="Chain ID"
          href={`${commonDocLink}#chain-id`}
          name="chainId"
          type="number"
          placeholder="12345678"
          infoText="Read about Chain ID in the docs"
          defaultValue={rollupConfig?.chainId || ''}
        />
        <TextInputWithInfoLink
          label="Chain Name"
          href={`${commonDocLink}#chain-name`}
          name="chainName"
          infoText="Read about Chain Name in the docs"
          defaultValue={rollupConfig?.chainName || ''}
        />
        <TextInputWithInfoLink
          label="Challenge Period Blocks"
          href={`${commonDocLink}#challenge-period-blocks`}
          name="confirmPeriodBlocks"
          type="number"
          infoText="Read about Challenge Period Blocks in the docs"
          defaultValue={rollupConfig?.confirmPeriodBlocks || ''}
        />
        <SelectInputWithInfoLink
          label="Stake Token"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#stake-token`}
          name="stakeToken"
          infoText="Read about Stake Token in the docs"
          options={['ETH', 'Custom']}
          disabled
        />
        <TextInputWithInfoLink
          label="Base Stake (in Ether)"
          href={`${commonDocLink}#base-stake`}
          name="baseStake"
          type="number"
          step="any"
          infoText="Read about Base Stake in the docs"
          defaultValue={rollupConfig?.baseStake || ''}
        />
        <TextInputWithInfoLink
          label="Owner"
          href={`${commonDocLink}#owner`}
          name="owner"
          infoText="Read about Owner in the docs"
          defaultValue={rollupConfig?.owner || ''}
        />
      </form>
    </>
  );
});
