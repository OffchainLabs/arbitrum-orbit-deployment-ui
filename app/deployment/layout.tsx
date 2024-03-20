'use client';
import { DeploymentPageContextProvider } from '@/components/DeploymentPageContext';
import { useIsMounted } from '@/hooks/useIsMounted';
import { PropsWithChildren } from 'react';

export default function DeploymentPageWithContext({ children }: PropsWithChildren) {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <DeploymentPageContextProvider>
      <div className="mx-auto mb-8 flex max-w-screen-xl flex-col gap-5 p-2">{children}</div>
    </DeploymentPageContextProvider>
  );
}
