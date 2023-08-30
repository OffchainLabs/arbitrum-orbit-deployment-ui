import { useStep } from '@/hooks/useStep';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useState } from 'react';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { StepTitle } from './StepTitle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet } from '@/types/RollupContracts';
import { AddressSchema } from '@/utils/schemas';

const batchPosterSchema = z.object({
  batchPosterAddress: AddressSchema,
});
type BatchPosterFormValues = z.infer<typeof batchPosterSchema>;

export const SetBatchPoster = () => {
  const [{ batchPoster: currentBatchPoster }, dispatch] = useDeploymentPageContext();
  const { nextStep, batchPosterFormRef } = useStep();
  const [batchPoster] = useState<Wallet>(currentBatchPoster || getRandomWallet());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(batchPosterSchema),
    defaultValues: { batchPosterAddress: batchPoster.address },
  });

  const onSubmit = (data: BatchPosterFormValues) => {
    const payload = {
      address: data.batchPosterAddress,
      privateKey:
        // Remove the private key if the user entered a custom address
        currentBatchPoster?.address === data.batchPosterAddress
          ? currentBatchPoster.privateKey
          : undefined,
    };

    dispatch({
      type: 'set_batch_poster',
      payload,
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
        defaultValue={batchPoster.address}
        register={() => register('batchPosterAddress')}
      />
      {errors.batchPosterAddress && (
        <p className="text-sm text-red-500">{String(errors.batchPosterAddress?.message)}</p>
      )}
    </form>
  );
};
