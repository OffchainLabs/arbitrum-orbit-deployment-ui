import { RaasProviderGrid } from '@/components/RaasProviderGrid';
import { StepTitle } from '@/components/StepTitle';
import Link from 'next/link';

export default function RaasProvidersPage() {
  return (
    <div className="rounded-md border border-solid border-grey p-8">
      <div className="flex flex-col gap-6">
        <StepTitle>Chain Management & Next Steps</StepTitle>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-light">Manage Your Chain</h3>
          <p className="text-sm font-light">
            Now that your testnet Orbit chain is deployed and running, you can access the Orbit
            Admin UI to manage your chain. The admin interface provides tools for configuring chain
            parameters.
          </p>
          <Link
            href="https://orbit.arbitrum.io/admin"
            target="_blank"
            className="w-fit rounded-sm bg-white px-6 py-2 text-lg text-black"
          >
            Go to Orbit Admin
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-light">Rollup-as-a-Service Providers</h3>
          <p className="text-sm font-light">
            As an optional next step, if you'd like to deploy to mainnet, we suggest using a
            Rollup-as-a-Service Provider. They have the context and experience to help with
            deploying contracts, protocol modifications, and maintaining infrastructure.
          </p>
          <RaasProviderGrid />
        </div>
      </div>
    </div>
  );
}
