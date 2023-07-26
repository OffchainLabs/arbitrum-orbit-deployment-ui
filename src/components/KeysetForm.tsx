import { useStep } from '@/hooks/useStep';
import { ChainId } from '@/types/ChainId';
import { setValidKeyset } from '@/utils/setValidKeyset';
import React, { ForwardedRef, forwardRef } from 'react';
import { useNetwork, useSigner } from 'wagmi';

const DEFAULT_KEYSET_STRING =
  '0x00000000000000010000000000000001012160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

type KeysetFormProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const KeysetForm = forwardRef(
  ({ isLoading, setIsLoading }: KeysetFormProps, ref: ForwardedRef<HTMLFormElement>) => {
    const { data: signer } = useSigner();
    const { chain } = useNetwork();
    const { nextStep } = useStep();

    if (!signer) return <div>No signer found</div>;
    if (chain?.id !== ChainId.ArbitrumGoerli) {
      return (
        <div>
          <p>You are connected to the wrong network.</p>
          <p>Please make sure you are connected to Arbitrum Goerli.</p>
        </div>
      );
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const anyTrustConfigDataString = window.localStorage.getItem('rollupData');
      const anyTrustConfigData = anyTrustConfigDataString
        ? JSON.parse(anyTrustConfigDataString)
        : '';
      if (!anyTrustConfigData) {
        debugger;
        return;
      }
      try {
        setIsLoading(true);
        await setValidKeyset({
          anyTrustConfigData,
          keyset: DEFAULT_KEYSET_STRING,
          signer,
        });
        nextStep();
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="flex flex-col gap-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dapibus tellus id diam
          placerat, in pharetra orci efficitur.
        </p>
        <h3 className="font-bold">Keyset</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dapibus tellus id diam
          placerat, in pharetra orci efficitur.
        </p>
        <div>
          <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
            {DEFAULT_KEYSET_STRING}
          </pre>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
          <button
            type="submit"
            className={`w-full rounded-lg bg-[#243145] px-3 py-2 text-2xl text-white ${
              isLoading && 'cursor-not-allowed bg-gray-400'
            }`}
            disabled={isLoading}
          >
            Deploy
          </button>
        </form>
      </div>
    );
  },
);
