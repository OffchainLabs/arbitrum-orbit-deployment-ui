'use client';

import { ExternalLink } from '@/components/ExternalLink';
import { NextButton } from '@/components/NextButton';
import { FIRST_STEP, useStep } from '@/hooks/useStep';

export default function InfoPage() {
  const { goToStep } = useStep();
  return (
    <>
      <div className="border-px s flex flex-col gap-4 border border-[#5D5D5D] p-8 text-left font-light leading-tight">
        <div className="flex items-center rounded-md bg-yellow px-4 py-2 text-xs">
          <i className="pi pi-exclamation-triangle mr-1" />
          <p>This is currently intended only for local devnet development</p>
        </div>
        <p className="text-xl leading-tight">
          All parameters are prefilled with defaults. This includes some randomly generated
          addresses.
          <br />
          We recommend using the defaults for testing purposes.
        </p>
        <p>
          More information around parameter customization and guidance can be found in the{' '}
          <ExternalLink
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
            className="underline"
          >
            documentation
          </ExternalLink>
          . We recommend opening the documentation in a side window to follow along.
          <br />
        </p>
        <p>
          Please ensure you have at least <strong>1.0 Arbitrum Sepolia ETH</strong> before getting
          started.
        </p>
        <div className="flex w-full flex-col items-baseline justify-between gap-2 bg-[#1A1A1A] p-4">
          <p>If you don't have enough Sepolia ETH, you can use these faucets:</p>
          <ul className="list-disc pl-4">
            <li>
              <ExternalLink href="https://sepoliafaucet.com/" className="underline">
                https://sepoliafaucet.com/
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.infura.io/faucet/sepolia" className="underline">
                https://www.infura.io/faucet/sepolia
              </ExternalLink>
            </li>
          </ul>
          <p>
            After you use the faucet you&apos;ll have to{' '}
            <ExternalLink
              href="https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia"
              className="underline"
            >
              bridge
            </ExternalLink>{' '}
            it over from Sepolia to Arbitrum Sepolia
          </p>
        </div>
      </div>
      <div className="flex justify-end py-4">
        <NextButton onClick={() => goToStep(FIRST_STEP)} />
      </div>
    </>
  );
}
