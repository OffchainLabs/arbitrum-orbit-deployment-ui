import { useToken } from 'wagmi';
import { zeroAddress } from 'viem';
import { z } from 'zod';
import { useStep } from '@/hooks/useStep';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { ChainType } from '@/types/ChainType';
import { StepTitle } from './StepTitle';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { AddressSchema, PrivateKeySchema } from '@/utils/schemas';
import { SetValidators } from './SetValidators';
import { SetBatchPoster } from './SetBatchPoster';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useState } from 'react';
import { Wallet } from '@/types/RollupContracts';

const WalletSchema = z.object({
  address: AddressSchema,
  privateKey: PrivateKeySchema,
});
const rollupConfigSchema = z.object({
  chainId: z.number().gt(0),
  chainName: z.string().nonempty(),
  confirmPeriodBlocks: z.number().gt(0),
  stakeToken: z.string(),
  baseStake: z.number().gt(0),
  owner: AddressSchema,
  nativeToken: AddressSchema,
  addresses: z.array(AddressSchema),
  batchPoster: WalletSchema,
});

const ether = { name: 'Ether', symbol: 'ETH' };
const commonDocLink = `${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/how-tos/customize-deployment-configuration`;

export type RollupConfigFormValues = z.infer<typeof rollupConfigSchema>;

export const RollupConfigInput = () => {
  const [{ rollupConfig, chainType, validators: savedWallets }, dispatch] =
    useDeploymentPageContext();
  const { nextStep, rollupConfigFormRef, validatorFormRef, batchPosterFormRef } = useStep();
  const [walletCount, setWalletCount] = useState<number>(savedWallets?.length || 1);
  const [wallets, setWallets] = useState<Wallet[]>(
    savedWallets || Array.from({ length: walletCount }, getRandomWallet),
  );

  const methods = useForm<z.infer<typeof rollupConfigSchema>>({
    defaultValues: {
      ...rollupConfig,
      addresses: wallets.map((wallet) => wallet.address),
    },
    mode: 'onBlur',
    resolver: zodResolver(rollupConfigSchema),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = methods;

  const onSubmit = (updatedRollupConfig: RollupConfigFormValues) => {
    dispatch({
      type: 'set_rollup_config',
      payload: { ...rollupConfig, ...updatedRollupConfig, stakeToken: rollupConfig.stakeToken },
    });
    validatorFormRef?.current?.onSubmit(updatedRollupConfig.addresses);
    batchPosterFormRef?.current?.onSubmit(updatedRollupConfig.batchPoster);
    nextStep();
  };

  const titleContent = chainType === ChainType.Rollup ? 'Configure Rollup' : 'Configure AnyTrust';

  // todo: debounce? though don't think anyone will actually type it character by character
  const nativeToken = watch('nativeToken');

  const { data: nativeTokenData = ether, isError: nativeTokenIsError } = useToken({
    address: nativeToken === zeroAddress ? undefined : (nativeToken as `0x${string}`),
  });

  return (
    <FormProvider {...methods}>
      <StepTitle>{titleContent}</StepTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-0 flex w-1/2 flex-col gap-4 py-4"
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
            href={`${commonDocLink}#native-fee-token`}
            infoText="Read about Native Token in the docs"
            defaultValue={rollupConfig?.nativeToken || ''}
            register={() => register('nativeToken')}
            disabled={chainType === ChainType.Rollup}
            error={errors.nativeToken?.message}
          />

          {chainType === ChainType.AnyTrust && (
            <>
              {nativeTokenIsError ? (
                <span className="text-yellow-600">
                  Failed to detect a valid ERC-20 contract at the given address.
                </span>
              ) : (
                <span>
                  The chain will use{' '}
                  <b>
                    {nativeTokenData.name} ({nativeTokenData.symbol})
                  </b>{' '}
                  as the native token for paying gas fees.
                </span>
              )}
            </>
          )}
        </div>
        <SetValidators
          {...{ wallets, setWalletCount, walletCount, setWallets }}
          ref={validatorFormRef}
        />
        <SetBatchPoster ref={batchPosterFormRef} />
      </form>
    </FormProvider>
  );
};
