import { useStep } from '@/hooks/useStep';
import { DeploymentSummary } from './DeploymentSummary';
import { setValidKeyset } from '@/utils/setValidKeyset';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { InfoCircleWithTooltip } from './InfoCircleWithTooltip';
import { StepTitle } from './StepTitle';
import { useDeploymentPageContext } from './DeploymentPageContext';

const DEFAULT_KEYSET_STRING =
  '0x00000000000000010000000000000001012160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

export const KeysetForm = () => {
  const { nextStep, keysetFormRef } = useStep();
  const [, dispatch] = useDeploymentPageContext();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch({ type: 'set_is_loading', payload: true });
      if (!walletClient || !address) return;

      const anyTrustConfigDataString = window.localStorage.getItem('rollupData');
      const anyTrustConfigData = anyTrustConfigDataString
        ? JSON.parse(anyTrustConfigDataString)
        : '';

      await setValidKeyset({
        anyTrustConfigData,
        keyset: DEFAULT_KEYSET_STRING,
        walletClient,
        publicClient,
        account: address,
      });
      nextStep();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: 'set_is_loading', payload: false });
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={keysetFormRef}></form>
      </div>
      <div>
        <StepTitle>Deployment Summary</StepTitle>
        <DeploymentSummary />
      </div>
    </div>
  );
};
