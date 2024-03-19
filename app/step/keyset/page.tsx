'use client';

import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { setValidKeyset } from '@arbitrum/orbit-sdk';

import { useStep } from '@/hooks/useStep';
import { assertIsAddress } from '@/utils/validators';
import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { InfoCircleWithTooltip } from '@/components/InfoCircleWithTooltip';
import { StepTitle } from '@/components/StepTitle';

const DEFAULT_KEYSET_STRING =
  '0x00000000000000010000000000000001012160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

export default function KeysetPage() {
  const { nextStep, keysetFormRef } = useStep();
  const [{ rollupContracts }, dispatch] = useDeploymentPageContext();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch({ type: 'set_is_loading', payload: true });
      if (!walletClient || !address) return;

      const upgradeExecutor = rollupContracts?.upgradeExecutor;
      const sequencerInbox = rollupContracts?.sequencerInbox;

      assertIsAddress(upgradeExecutor);
      assertIsAddress(sequencerInbox);

      await setValidKeyset({
        coreContracts: { upgradeExecutor, sequencerInbox },
        keyset: DEFAULT_KEYSET_STRING,
        walletClient,
        publicClient,
      });
      nextStep();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: 'set_is_loading', payload: false });
    }
  };

  return (
    <div className="border-px flex flex-col gap-4 rounded-md border border-grey p-8">
      <StepTitle>Configure Keyset</StepTitle>
      <p>
        A Keyset specifies the public keys of Committee members and the number of signatures
        required for a Data Availability Certificate to be valid. Keysets make Committee membership
        changes possible and provide Committee members the ability to change their keys.
      </p>
      <h3 className="underline">Default Keyset</h3>
      <div>
        <pre className="whitespace-pre-wrap break-all rounded bg-[#DADADA] p-2 text-[#6D6D6D]">
          {DEFAULT_KEYSET_STRING}
        </pre>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={keysetFormRef}></form>
    </div>
  );
}
