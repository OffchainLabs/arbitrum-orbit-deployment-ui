'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { z } from 'zod';

import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { DocsPanel } from '@/components/DocsPanel';
import { GasTokenInput } from '@/components/GasTokenInput';
import { SetBatchPoster } from '@/components/SetBatchPoster';
import { SetValidators } from '@/components/SetValidators';
import { StepTitle } from '@/components/StepTitle';
import { TextInputWithInfoLink } from '@/components/TextInputWithInfoLink';
import { useStep } from '@/hooks/useStep';
import { Wallet } from '@/types/RollupContracts';
import { deployRollup } from '@/utils/deployRollup';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { AddressSchema, PrivateKeySchema } from '@/utils/schemas';
import { compareWallets } from '@/utils/wallets';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

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
  addresses: z.array(AddressSchema).superRefine((data, ctx) => {
    const seen = new Set();

    data.forEach((address, index) => {
      if (seen.has(address)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duplicate addresses are not allowed',
          path: [index],
        });
      } else {
        seen.add(address);
      }
    });
  }),
  batchPoster: WalletSchema,
});

export type RollupConfigFormValues = z.infer<typeof rollupConfigSchema>;

export default function RollupConfigPage() {
  const [{ rollupConfig, chainType, validators: savedWallets, batchPoster }, dispatch] =
    useDeploymentPageContext();
  const { nextStep, rollupConfigFormRef } = useStep();
  const [walletCount, setWalletCount] = useState<number>(savedWallets?.length || 1);
  const [wallets, setWallets] = useState<Wallet[]>(
    savedWallets || Array.from({ length: walletCount }, getRandomWallet),
  );
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // refines the schema to check if token decimals is 18
  // done here because zod schema must be synchronous
  const refinedRollupConfigSchema = rollupConfigSchema.refine(
    (data) => {
      return tokenDecimals && tokenDecimals === 18;
    },
    {
      message: 'Token decimals must be 18.',
      path: ['nativeToken'],
    },
  );

  const methods = useForm<z.infer<typeof rollupConfigSchema>>({
    defaultValues: {
      ...rollupConfig,
      addresses: wallets.map((wallet) => wallet.address),
      batchPoster: batchPoster || getRandomWallet(),
    },
    mode: 'onBlur',
    resolver: zodResolver(refinedRollupConfigSchema),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = async (updatedRollupConfig: RollupConfigFormValues) => {
    const updatedValidators = compareWallets(wallets, updatedRollupConfig.addresses);
    const updatedBatchPoster = updatedRollupConfig.batchPoster;

    try {
      dispatch({
        type: 'set_rollup_config',
        payload: { ...rollupConfig, ...updatedRollupConfig, stakeToken: rollupConfig.stakeToken },
      });
      dispatch({
        type: 'set_validators',
        payload: compareWallets(wallets, updatedRollupConfig.addresses),
      });
      dispatch({
        type: 'set_batch_poster',
        payload: updatedRollupConfig.batchPoster,
      });

      dispatch({ type: 'set_is_loading', payload: true });
      if (!walletClient || !address) return;
      const rollupArgs = {
        rollupConfig: {
          ...rollupConfig,
          ...updatedRollupConfig,
          stakeToken: rollupConfig.stakeToken,
        },
        validators: updatedValidators,
        batchPoster: updatedBatchPoster,
        chainType,
        account: address,
        publicClient,
        walletClient,
      };
      const rollupContracts = await deployRollup(rollupArgs);
      dispatch({ type: 'set_rollup_contracts', payload: rollupContracts });
      nextStep();
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        // Shorten the error message sent from MetaMask (or other wallets) by grabbing just the first sentence
        const periodIndex = e.message.indexOf('.');
        const message = e.message.substring(0, periodIndex ? periodIndex + 1 : undefined);
        toast(message, { type: 'error', pauseOnHover: true });
      }
    } finally {
      dispatch({ type: 'set_is_loading', payload: false });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} ref={rollupConfigFormRef}>
        <div className="border-px flex flex-wrap rounded-md border border-grey">
          <div className="hide-scrollbar flex w-full flex-col gap-2 overflow-y-scroll p-8 md:h-[80vh] md:w-1/2">
            <StepTitle className="mb-4">Review & Deploy</StepTitle>
            <TextInputWithInfoLink
              label="Chain ID"
              type="number"
              placeholder="12345678"
              defaultValue={rollupConfig?.chainId || ''}
              register={() =>
                register('chainId', {
                  setValueAs: (value) => Number(value),
                })
              }
              error={errors.chainId?.message}
              anchor={'chain-id'}
            />
            <TextInputWithInfoLink
              label="Chain Name"
              defaultValue={rollupConfig?.chainName || ''}
              error={errors.chainName?.message}
              register={() => register('chainName')}
              anchor={'chain-name'}
            />

            <TextInputWithInfoLink
              label="Challenge Period Blocks"
              type="number"
              error={errors.confirmPeriodBlocks?.message}
              defaultValue={rollupConfig?.confirmPeriodBlocks || ''}
              register={() =>
                register('confirmPeriodBlocks', {
                  setValueAs: (value) => Number(value),
                })
              }
              anchor={'challenge-period-blocks'}
            />

            <TextInputWithInfoLink
              label="Stake Token"
              defaultValue={'ETH'}
              disabled
              anchor={'stake-token'}
            />

            <TextInputWithInfoLink
              label="Base Stake (in Ether)"
              type="number"
              step="any"
              defaultValue={rollupConfig?.baseStake || 0}
              error={errors.baseStake?.message}
              register={() =>
                register('baseStake', {
                  setValueAs: (value) => Number(value),
                })
              }
              anchor={'base-stake'}
            />

            <TextInputWithInfoLink
              label="Owner"
              defaultValue={rollupConfig?.owner || ''}
              register={() => register('owner')}
              error={errors.owner?.message}
              anchor={'owner'}
            />
            <GasTokenInput setTokenDecimals={setTokenDecimals} />
            <SetValidators {...{ wallets, setWalletCount, walletCount, setWallets }} />
            <SetBatchPoster />
          </div>
          <div className="border-px h-[80vh] w-full  border-t border-grey p-8 md:w-1/2 md:border-l md:border-t-0">
            <DocsPanel />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
