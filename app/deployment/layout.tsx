'use client';
import { DeploymentPageContextProvider } from '@/components/DeploymentPageContext';
import { Stepper } from '@/components/Stepper';
import { WrongChainAlert } from '@/components/WrongChainAlert';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useStep } from '@/hooks/useStep';
import { ChainId } from '@/types/ChainId';
import { RaasProviders } from '@/types/Steps';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';

function DeploymentLayout({ children }: any) {
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { currentStep } = useStep();

  const isWrongChain = chain?.id !== ChainId.ArbitrumSepolia;

  const shouldShowStepper = currentStep !== RaasProviders;

  return (
    <div className="mx-auto mb-8 flex max-w-screen-xl flex-col gap-5 p-2">
      <div className="mt-4 w-full">{shouldShowStepper && <Stepper />}</div>
      {(!isConnected || !address) && (
        <div className="border-px flex w-full items-center justify-center border border-[#5D5D5D] ">
          <div className="my-10 flex flex-col items-center gap-4">
            <p className="text-lg font-light">Please connect your wallet to continue.</p>
            <ConnectButton />
          </div>
        </div>
      )}
      {isConnected && isWrongChain && <WrongChainAlert />}
      {isConnected && !isWrongChain && children}
    </div>
  );
}

export default function DeploymentPageWithContext({ children }: { children: any }) {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <DeploymentPageContextProvider>
      <DeploymentLayout children={children} />
    </DeploymentPageContextProvider>
  );
}
