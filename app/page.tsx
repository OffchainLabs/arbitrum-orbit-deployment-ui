import Image from 'next/image';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

interface ExternalLinkTileProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  title: string;
  children: ReactNode;
}

const cardClassNames = [
  'block [&>button]:text-left min-h-[120px] justify-start w-full h-full rounded-lg border border-gray-300 bg-black/5 px-4 py-5 text-left transition-colors',
  'lg:border-transparent lg:bg-transparent lg:min-h-[auto] lg:px-3 lg:py-4',
  'lg:hover:border-gray-300 lg:hover:bg-black/5 dark:lg:hover:border-neutral-700 dark:lg:hover:bg-neutral-800/30',
];

export default function Home() {
  const ExternalLinkTile: FC<ExternalLinkTileProps> = ({ href, title, children, ...rest }) => (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...rest}
      className={twMerge(twJoin(cardClassNames))}
    >
      <button>
        <p className={`font-regular mb-2 text-2xl`}>{title}</p>
        <p className={`font-regular m-0 max-w-[28ch] text-sm`}>{children}</p>
      </button>
    </a>
  );

  return (
    <main className="flex w-full justify-center">
      <div className="flex w-[1024px] flex-col items-start gap-16 pb-16 pl-4 pt-4 lg:mt-16 lg:pl-0">
        <Image src="/logo.svg" alt="Logo" width={192} height={192} />
        <div className="-ml-2 grid grid-flow-row gap-8 lg:max-w-[580px] lg:grid-cols-2 lg:grid-rows-[auto_1px_auto] lg:gap-16">
          <ExternalLinkTile
            href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-gentle-introduction`}
            title="Learn about Orbit"
          >
            Dig into the details of how this works
          </ExternalLinkTile>
          <Link href="/deployment/step/1" className={twMerge(twJoin(cardClassNames))}>
            <button>
              <p className={`font-regular mb-2 text-2xl`}>Deploy Orbit Chain</p>
              <p className={`font-regular m-0 max-w-[28ch] text-sm`}>
                Configure your Orbit chain here
              </p>
            </button>
          </Link>
          <div className="col-span-2 hidden h-[1px] w-full border border-zinc-300 lg:block" />
          <ExternalLinkTile
            href="https://docs.google.com/forms/d/e/1FAIpQLSe5YWxFbJ8DgWcDNbIW2YYuTRmegtx2FHObym00_sOt0kq4wA/viewform"
            title="Get in Touch"
          >
            Connect with us to learn if an Orbit chain makes sense for you
          </ExternalLinkTile>
          <ExternalLinkTile href="https://discord.gg/arbitrum" title="Get Support">
            Join the <span className="font-bold">#orbit-support</span> channel in Discord if you run
            into any issues
          </ExternalLinkTile>
        </div>
      </div>
    </main>
  );
}
