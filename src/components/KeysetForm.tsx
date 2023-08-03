import { useStep } from '@/hooks/useStep';
import { DeploymentSummary } from '@/pages/deployment/DeploymentSummary';
import { ChainId } from '@/types/ChainId';
import { setValidKeyset } from '@/utils/setValidKeyset';
import React, { ForwardedRef, forwardRef } from 'react';
import { useNetwork, useSigner } from 'wagmi';
import { InfoCircleWithTooltip } from './InfoCircleWithTooltip';
import { StepTitle } from './StepTitle';

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
      <div className="mx-0 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <StepTitle>Configure Keyset</StepTitle>
            <InfoCircleWithTooltip
              href="https://developer.arbitrum.io/inside-anytrust#keysets"
              infoText="Read about Keyset in the docs"
            />
          </div>
          <p>
            A Keyset specifies the public keys of Committee members and the number of signatures
            required for a Data Availability Certificate to be valid. Keysets make Committee
            membership changes possible and provide Committee members the ability to change their
            keys.
          </p>
          <h3 className="font-bold">Default Keyset</h3>
          <div>
            <pre className="whitespace-pre-wrap break-all rounded bg-[#f6f6f6] p-2 text-[#6D6D6D]">
              {DEFAULT_KEYSET_STRING}
            </pre>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}></form>
        </div>
        <div>
          <StepTitle>Deployment Summary</StepTitle>
          <DeploymentSummary />
        </div>
      </div>
    );
  },
);
