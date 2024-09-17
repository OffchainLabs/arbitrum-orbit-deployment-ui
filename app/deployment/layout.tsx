'use client';
import { DeploymentPageContextProvider } from '@/components/DeploymentPageContext';
import { useIsMounted } from '@/hooks/useIsMounted';
import { PropsWithChildren } from 'react';

export default function DeploymentPageWithContext({ children }: PropsWithChildren) {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <DeploymentPageContextProvider>
      <div className="mx-auto mb-8 flex max-w-screen-xl flex-col gap-5">
        <div className="flex items-center rounded-md bg-yellow px-4 py-2 text-xs">
          <i className="pi pi-exclamation-triangle mr-1" />
          <p>This is currently intended only for local devnet development</p>
        </div>
        {children}
      </div>
    </DeploymentPageContextProvider>
  );
}
