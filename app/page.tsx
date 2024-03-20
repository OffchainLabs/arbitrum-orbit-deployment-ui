import { Metadata } from 'next';
import Image from 'next/image';
import { Card } from '@/components/Card';
import { DISCORD_LINK, GET_HELP_LINK } from '@/common/constants';
import { RaasProviderGrid } from '@/components/RaasProviderGrid';

const metadataContent = {
  title: 'Launch your own Orbit Chain!',
  description: 'Launch your own Orbit Chain!',
};

// Generate server-side metadata for this page
export function generateMetadata(): Metadata {
  return {
    title: metadataContent.title,
    description: metadataContent.description,
    openGraph: {
      title: metadataContent.title,
      description: metadataContent.description,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadataContent.title,
      description: metadataContent.description,
    },
  };
}

type OptionalOrbitPageParams = {
  searchParams: {
    orbitChain?: string;
  };
};

export default function LaunchPage(params: OptionalOrbitPageParams) {
  return (
    <div className="relative mx-auto flex w-full flex-col gap-[40px]">
      {/* Banner Image */}
      <Card className="flex:col relative flex flex-col items-start gap-6 bg-[#12AAFF] p-4  lg:flex-row-reverse lg:items-end">
        <Image
          alt="Bridge"
          src="/illustration-orbit.webp"
          width={100}
          height={100}
          className="h-[100px] w-[100px] mix-blend-screen lg:h-[100px] lg:w-[100px]"
        />
        <div className="z-10 flex w-full flex-col gap-3">
          <div className="text-xl lg:text-3xl">Launch your own Orbit Chain!</div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        {/* Orbit Docs card */}
        <Card
          className="relative flex flex-col gap-6 p-4 hover:bg-blue active:bg-[#12AAFF]"
          cardType="externalLink"
          showExternalLinkArrow
          href="https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction"
        >
          <div className="z-10 flex w-full flex-col gap-3">
            <div className="text-xl lg:text-3xl">Orbit Docs</div>
            <div className="mb-8 w-full text-sm opacity-60">
              Dig into the details of how it all works
            </div>

            <div className="w-full text-base">Read the docs</div>
          </div>
        </Card>

        {/* Playground card */}
        <Card
          className="relative flex flex-col gap-6 p-4 hover:bg-blue active:bg-[#12AAFF]"
          cardType="link"
          showExternalLinkArrow={true}
          href="/deployment"
        >
          <div className="z-10 flex w-full flex-col gap-3">
            <div className="text-xl lg:text-3xl">Orbit Playground</div>
            <div className="mb-8 w-full text-sm opacity-60">
              Launch your own Layer 3 Orbit Chain
            </div>
            <div className="w-full text-base">Launch on testnet</div>
          </div>
        </Card>
      </div>

      {/* RaaS list */}
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4 bg-default-black text-sm">
          <div className="text-xl lg:text-3xl">Launch to Mainnet</div>
          <hr className="opacity-20" />
          <div className="mb-2 flex w-full flex-col gap-3 text-sm opacity-60">
            Use a third-party Rollup as a Service providers can help take your testnet orbit chain
            to mainnet
          </div>
          <RaasProviderGrid />
        </Card>
      </div>

      {/* Orbit SDK link */}
      <Card
        className="relative flex flex-col gap-6 p-4 hover:bg-blue active:bg-[#0C6DA3]"
        cardType="externalLink"
        href="https://github.com/OffchainLabs/arbitrum-orbit-sdk"
        showExternalLinkArrow
      >
        <div className="z-10 flex w-full flex-col gap-3">
          <div className="text-xl lg:text-3xl">Get started on your own</div>
          <hr className="opacity-20" />
          <div className="mb-8 flex w-full flex-col gap-3 text-sm opacity-60">
            <p>Use the Orbit SDK to launch your chain to Mainnet without any support.</p>
            <p>
              Keep in mind that running a chain has a lot of infrastructure needs and we highly
              recommend using a Rollup as a Service provider to increase chances of success.
            </p>
          </div>

          <div className="w-full text-base">Dive into the SDK</div>
        </div>
      </Card>

      {/* Other links */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        {/* Discord */}
        <Card
          className="relative flex flex-col gap-6 p-4 hover:bg-blue active:bg-[#12AAFF]"
          cardType="externalLink"
          showExternalLinkArrow
          href={DISCORD_LINK}
        >
          <div className="z-10 flex w-full flex-col gap-3">
            <div className="mb-8 w-full text-sm opacity-60">
              Join the <span className="mx-1 rounded-lg bg-white/20 p-1">#orbit-support</span>{' '}
              channel in Discord if you run into any issues
            </div>

            <div className="w-full text-base">Get support</div>
          </div>
        </Card>

        {/* Contact us */}
        <Card
          className="relative flex flex-col gap-6 p-4 hover:bg-blue active:bg-[#12AAFF]"
          cardType="externalLink"
          href={GET_HELP_LINK}
          showExternalLinkArrow
        >
          <div className="z-10 flex w-full flex-col gap-3">
            <div className="mb-8 w-full text-sm opacity-60">
              Connect with us to learn if an appchain makes sense for you
            </div>
            <div className="w-full text-base">Get in touch</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
