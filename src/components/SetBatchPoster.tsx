import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';
import { useFormContext } from 'react-hook-form';

export const SetBatchPoster = forwardRef(({}, ref: any) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [{ batchPoster: currentBatchPoster }, dispatch] = useDeploymentPageContext();
  const [batchPoster] = useState<Wallet>(currentBatchPoster ?? getRandomWallet());

  useEffect(() => {
    setValue('batchPoster', batchPoster);
  }, []);

  const onSubmit = (data: Wallet) => {
    const payload = data;

    dispatch({
      type: 'set_batch_poster',
      payload,
    });
  };

  useImperativeHandle(ref, () => {
    return { onSubmit };
  });

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <TextInputWithInfoLink
        label="Batch Poster Address"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-5-configure-your-chains-batch-poster`}
        placeholder="Enter address"
        infoText="Read about Batch Poster in the docs"
        defaultValue={batchPoster.address}
        disabled
        register={() => register('batchPosterAddress')}
      />
      <input
        type="hidden"
        defaultValue={batchPoster.privateKey}
        disabled
        {...register('batchPosterPrivateKey')}
      />
      {errors.batchPosterAddress && (
        <p className="text-sm text-red-500">{String(errors.batchPosterAddress?.message)}</p>
      )}
    </div>
  );
});
