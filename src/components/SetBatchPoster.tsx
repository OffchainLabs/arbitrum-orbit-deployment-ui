import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { Wallet } from '@/types/RollupContracts';
import { getRandomWallet } from '@/utils/getRandomWallet';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';

export const SetBatchPoster = () => {
  const [{ batchPoster: currentBatchPoster }] = useDeploymentPageContext();
  const [batchPoster] = useState<Wallet>(currentBatchPoster ?? getRandomWallet());
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  useEffect(() => {
    setValue('batchPoster', batchPoster);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <TextInputWithInfoLink
        label="Batch Poster Address"
        defaultValue={batchPoster.address}
        register={() => register('batchPoster.address')}
        anchor="batch-poster"
      />
      <input type="hidden" disabled {...register('batchPoster.privateKey')} />
      {errors.batchPoster && (
        <p className="text-sm text-red-500">{String(errors.batchPoster?.message)}</p>
      )}
    </div>
  );
};
