import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { BatchPoster } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useState, useEffect } from 'react';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { StepTitle } from './StepTitle';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const batchPosterSchema = z.object({
  batchPosterAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, 'Must be a valid address'),
  privateKey: z.string().nonempty('Must be a valid private key'),
});

export type BatchPosterFormValues = z.infer<typeof batchPosterSchema>;

export const SetBatchPoster = () => {
  const [{ batchPoster: currentBatchPoster }, dispatch] = useDeploymentPageContext();
  const { nextStep, batchPosterFormRef } = useStep();
  const batchPoster = currentBatchPoster || getRandomWallet();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BatchPosterFormValues>({
    resolver: zodResolver(batchPosterSchema),
    values: {
      batchPosterAddress: batchPoster.address,
      privateKey: batchPoster.privateKey,
    },
  });

  useEffect(() => {
    if (batchPoster) {
      setValue('batchPosterAddress', batchPoster.address);
      setValue('privateKey', batchPoster.privateKey);
    }
  }, [batchPoster, setValue]);

  const onSubmit = () => {
    dispatch({
      type: 'set_batch_poster',
      payload: batchPoster,
    });
    nextStep();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-1/2 flex-col gap-4"
      ref={batchPosterFormRef}
    >
      <StepTitle>Configure Batch Poster</StepTitle>
      <TextInputWithInfoLink
        label="Batch Poster Address"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-5-configure-your-chains-batch-poster`}
        placeholder="Enter address"
        infoText="Read about Batch Poster in the docs"
        {...register('batchPosterAddress', {
          onChange: (e) => setValue('batchPosterAddress', e.target.value),
        })}
        error={errors.batchPosterAddress?.message}
      />
      <TextInputWithInfoLink
        label="Private Key"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-5-configure-your-chains-batch-poster`}
        placeholder="Private Key"
        infoText="Private key for the Batch Poster"
        {...register('privateKey')}
        error={errors.privateKey?.message}
      />
    </form>
  );
};
