'use client';
import { MobileSidebar } from '@offchainlabs/cobalt';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePostHog } from 'posthog-js/react';
import { CustomConnectButton } from './ConnectMenuItem';

export const MobileAppSidebar = () => {
  const posthog = usePostHog();
  return (
    <>
      <header className="mx-auto flex max-w-screen-lg justify-end py-6">
        <div className="hidden sm:flex">
          <ConnectButton />
        </div>
        <div className="flex sm:hidden">
          <MobileSidebar logger={posthog} activeMenu="Launch Chain">
            <CustomConnectButton />
          </MobileSidebar>
        </div>
      </header>
    </>
  );
};
