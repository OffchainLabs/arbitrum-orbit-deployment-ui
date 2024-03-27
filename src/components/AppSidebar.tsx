'use client';
import { Sidebar } from '@offchainlabs/cobalt';
import { usePostHog } from 'posthog-js/react';

export const AppSidebar = () => {
  const posthog = usePostHog();
  return (
    <>
      <Sidebar logger={posthog} />
    </>
  );
};
