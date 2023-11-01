import { zeroAddress } from 'viem';
import { z } from 'zod';
import { useStep } from '@/hooks/useStep';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { ChainType } from '@/types/ChainType';
import { StepTitle } from './StepTitle';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { AddressSchema } from '@/utils/schemas';
import { useToken } from 'wagmi';
import { useEffect } from 'react';

const rollupConfigSchema = z.object({
  chainId: z.number().gt(0),
  chainName: z.string().nonempty(),
  confirmPeriodBlocks: z.number().gt(0),
  stakeToken: AddressSchema,
  baseStake: z.number().gt(0),
  owner: AddressSchema,
  nativeToken: AddressSchema,
});

const ether = { name: 'Ether', symbol: 'ETH', decimals: 18 };
const commonDocLink = `${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration`;

export type RollupConfigFormValues = z.infer<typeof rollupConfigSchema>;

export const RollupConfigInput = () => {
  const [{ rollupConfig, chainType }, dispatch] = useDeploymentPageContext();
  const { nextStep, rollupConfigFormRef } = useStep();
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof rollupConfigSchema>>({
    defaultValues: rollupConfig,
    resolver: zodResolver(rollupConfigSchema),
  });
  const watchedNativeTokenAddress = watch('nativeToken', rollupConfig?.nativeToken || zeroAddress);

  const {
    data: nativeTokenData = ether,
    isLoading: isNativeTokenDataLoading,
    isError: nativeTokenDataHasError,
  } = useToken({
    address:
      watchedNativeTokenAddress === zeroAddress
        ? undefined
        : (watchedNativeTokenAddress as `0x${string}`),
  });

  const validateNativeToken = () => {
    if (watchedNativeTokenAddress === zeroAddress) {
      clearErrors('nativeToken');
      return true;
    } else if (nativeTokenDataHasError) {
      setError('nativeToken', {
        type: 'manual',
        message: 'Invalid token address',
      });
      return false;
    } else if (!nativeTokenData || !nativeTokenData.decimals) {
      setError('nativeToken', {
        type: 'manual',
        message: 'Invalid token address',
      });
      return false;
    } else if (nativeTokenData && nativeTokenData.decimals !== 18) {
      setError('nativeToken', {
        type: 'manual',
        message: 'Native token must have 18 decimals',
      });
      return false;
    } else {
      clearErrors('nativeToken');
      return true;
    }
  };

  useEffect(() => {
    validateNativeToken();
  }, [nativeTokenDataHasError, nativeTokenData]);

  const onSubmit = (updatedRollupConfig: RollupConfigFormValues) => {
    const isNativeTokenValid = validateNativeToken();

    // Don't proceed with submission if there's a validation error for nativeToken
    if (!isNativeTokenValid || isNativeTokenDataLoading || errors.nativeToken) {
      return;
    }

    dispatch({
      type: 'set_rollup_config',
      payload: { ...rollupConfig, ...updatedRollupConfig, stakeToken: rollupConfig.stakeToken },
    });
    nextStep();
  };

  const titleContent = chainType === ChainType.Rollup ? 'Configure Rollup' : 'Configure AnyTrust';

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

        <TextInputWithInfoLink
          label="Stake Token"
          href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration#stake-token`}
          infoText="Read about Stake Token in the docs"
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

        <div className="flex flex-col gap-2">
          <TextInputWithInfoLink
            label="Native Token"
            explainerText={
              chainType === ChainType.Rollup
                ? 'Only AnyTrust chains support custom Native Tokens'
                : ''
            }
            href={`${commonDocLink}#native-token`} // todo: update link
            infoText="Read about Native Token in the docs"
            defaultValue={rollupConfig?.nativeToken || zeroAddress}
            register={() => register('nativeToken')}
            disabled={chainType === ChainType.Rollup}
            isLoading={isNativeTokenDataLoading}
            error={errors.nativeToken?.message}
          />
          {chainType === ChainType.AnyTrust && (
            <>
              {!nativeTokenDataHasError && !isNativeTokenDataLoading && !errors.nativeToken && (
                <span>
                  The chain will use{' '}
                  <b>
                    {nativeTokenData?.name} ({nativeTokenData?.symbol})
                  </b>{' '}
                  as the native token for paying gas fees.
                </span>
              )}
            </>
          )}
        </div>
      </form>
    </>
  );
};
