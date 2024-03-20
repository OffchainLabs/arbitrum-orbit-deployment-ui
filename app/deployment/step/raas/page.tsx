import { RaasProviderGrid } from '@/components/RaasProviderGrid';
import { StepTitle } from '@/components/StepTitle';

export default function RaasProvidersPage() {
  return (
    <div className="border-grey rounded-md border border-solid p-8">
      <div className="flex flex-col gap-6">
        <StepTitle>Rollup-as-a-Service Providers</StepTitle>
        <p className="text-sm font-light">
          As an optional next step, if you’d like to deploy to mainnet , we suggest using a
          Rollup-as-a-Service Provider. They have the context and experience to help with deploying
          contracts, protocol modifications, and maintaining infrastructure.
        </p>
        {/* TODO: reactivate when page is ready */}
        {/* <button className={twMerge(` w-36 rounded-sm bg-white p-2 text-lg text-black`)}> 
          Get in touch
        </button> */}
        <h3 className="text-2xl font-light">Lean about the Providers</h3>
        {/* TODO: swap to 3 columns when adding 5th RaaS Provider */}
        <RaasProviderGrid />
      </div>
    </div>
  );
}
