import { useFormContext } from 'react-hook-form';
import { TextInputWithInfoLink } from './TextInputWithInfoLink';

export const SetBatchPoster = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <TextInputWithInfoLink
        label="Batch Poster Address"
        href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart#step-5-configure-your-chains-batch-poster`}
        placeholder="Enter address"
        infoText="Read about Batch Poster in the docs"
        disabled
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
