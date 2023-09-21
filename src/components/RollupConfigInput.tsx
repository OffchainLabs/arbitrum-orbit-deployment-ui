import { useStep } from '@/hooks/useStep';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { ChainType } from '@/types/ChainType';
import { SelectInputWithInfoLink } from './SelectInputWithInfoLink';
import { StepTitle } from './StepTitle';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { AddressSchema } from '@/utils/schemas';

const rollupConfigSchema = z.object({
  chainId: z.number().gt(0),
  chainName: z.string().nonempty(),
  confirmPeriodBlocks: z.number().gt(0),
  stakeToken: z.string(),
  baseStake: z.number().gt(0),
  owner: AddressSchema,
  nativeToken: AddressSchema,
});

export type RollupConfigFormValues = z.infer<typeof rollupConfigSchema>;

export const RollupConfigInput = () => {
  const [{ rollupConfig, chainType }, dispatch] = useDeploymentPageContext();
  const { nextStep, rollupConfigFormRef } = useStep();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof rollupConfigSchema>>({
    defaultValues: rollupConfig,
    mode: 'onBlur',
    resolver: zodResolver(rollupConfigSchema),
  });

  const onSubmit = (updatedRollupConfig: RollupConfigFormValues) => {
    dispatch({
      type: 'set_rollup_config',
      payload: { ...rollupConfig, ...updatedRollupConfig, stakeToken: rollupConfig.stakeToken },
    });
    nextStep();
  };

  const titleContent = chainType === ChainType.Rollup ? 'Configure Rollup' : 'Configure AnyTrust';

  const commonDocLink = `${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration`;

  return (
    <>
      <StepTitle>{titleContent}</StepTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-0 grid grid-cols-2 gap-4 py-4"
        ref={rollupConfigFormRef}
      >
        <TextInputWithInfoLink
          label="Chain ID"
          href={`${commonDocLink}#chain-id`}
          type="number"
          placeholder="12345678"
          infoText="Read about Chain ID in the docs"
          defaultValue={rollupConfig?.chainId || ''}
          register={() =>
            register('chainId', {
              setValueAs: (value) => Number(value),
            })
          }
          error={errors.chainId?.message}
        />
        <TextInputWithInfoLink
          label="Chain Name"
          href={`${commonDocLink}#chain-name`}
          infoText="Read about Chain Name in the docs"
          defaultValue={rollupConfig?.chainName || ''}
          error={errors.chainName?.message}
          register={() => register('chainName')}
        />

        <TextInputWithInfoLink
          label="Challenge Period Blocks"
          href={`${commonDocLink}#challenge-period-blocks`}
          type="number"
          infoText="Read about Challenge Period Blocks in the docs"
          error={errors.confirmPeriodBlocks?.message}
          defaultValue={rollupConfig?.confirmPeriodBlocks || ''}
          register={() =>
            register('confirmPeriodBlocks', {
              setValueAs: (value) => Number(value),
            })
          }
        />

        <SelectInputWithInfoLink
          label="Stake Token"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#stake-token`}
          infoText="Read about Stake Token in the docs"
          options={['ETH', 'Custom']}
          defaultValue={'ETH'}
          disabled
        />

        <TextInputWithInfoLink
          label="Base Stake (in Ether)"
          href={`${commonDocLink}#base-stake`}
          type="number"
          step="any"
          infoText="Read about Base Stake in the docs"
          defaultValue={rollupConfig?.baseStake || 0}
          error={errors.baseStake?.message}
          register={() =>
            register('baseStake', {
              setValueAs: (value) => Number(value),
            })
          }
        />

        <TextInputWithInfoLink
          label="Owner"
          href={`${commonDocLink}#owner`}
          infoText="Read about Owner in the docs"
          defaultValue={rollupConfig?.owner || ''}
          register={() => register('owner')}
          error={errors.owner?.message}
        />

        <TextInputWithInfoLink
          label="Native Token"
          href={`${commonDocLink}#owner`} // todo: update link
          infoText={
            <>
              <p>Read about Native Token in the docs.</p> <br />
              <p>
                <strong>Only</strong> AnyTrust chains support custom Native Tokens.
              </p>
            </>
          }
          defaultValue={rollupConfig?.nativeToken || ''}
          register={() => register('nativeToken')}
          disabled={chainType === ChainType.Rollup}
          error={errors.nativeToken?.message}
        />
      </form>
    </>
  );
};
