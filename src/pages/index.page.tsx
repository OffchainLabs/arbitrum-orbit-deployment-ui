import Image from 'next/image';
import { FC, ReactNode } from 'react';

interface ExternalLinkTileProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  title: string;
  children: ReactNode;
}

export default function Home() {
  const ExternalLinkTile: FC<ExternalLinkTileProps> = ({ href, title, children, ...rest }) => (
    <a target="_blank" rel="noopener noreferrer" href={href} {...rest}>
      <button className="w-full rounded-lg  border border-transparent px-2 py-3 text-left transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
        <h2 className={`mb-2 text-3xl font-regular`}>{title}</h2>
        <p className={`m-0 max-w-[28ch] text-sm font-regular`}>{children}</p>
      </button>
    </a>
  );

  return (
    <main className="flex h-[calc(100vh-120px)] w-full justify-center">
      <div className="mt-16 flex w-[1024px] flex-col items-start gap-16 pl-10 sm:pl-0">
        <Image src="/logo.svg" alt="Logo" width={192} height={192} />
        <div className="-ml-2 flex flex-wrap items-start justify-start gap-16">
          <ExternalLinkTile
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-gentle-introduction`}
            title="Learn about Orbit"
          >
            Dig into the details of how this works
          </ExternalLinkTile>
          <ExternalLinkTile href="/deployment" title="Deploy Orbit Chain">
            Configure your appchain here
          </ExternalLinkTile>
        </div>
        <div className="w-1/2 border border-zinc-300" />
        <div className="-ml-2 flex items-start justify-start gap-16">
          <ExternalLinkTile
            href="https://docs.google.com/forms/d/e/1FAIpQLSe5YWxFbJ8DgWcDNbIW2YYuTRmegtx2FHObym00_sOt0kq4wA/viewform"
            title="Get in Touch"
          >
            Connect with us to learn if an appchain makes sense for you
          </ExternalLinkTile>
          <ExternalLinkTile href="https://discord.gg/KsewXePB" title="Get Support">
            Join the <span className="font-bold">#orbit-support</span> channel in Discord if you run
            into any issues
          </ExternalLinkTile>
        </div>
      </div>
    </main>
  );
}
