'use client';

import { CodeComponent } from '@/components/CodeComponent';
import { useDeploymentPageContext } from '@/components/DeploymentPageContext';
import { DeploymentSummary } from '@/components/DeploymentSummary';
import { StepTitle } from '@/components/StepTitle';
import { useConfigDownloads } from '@/hooks/useConfigDownloads';

export default function DownloadPage() {
  const { rollupConfigDownloadData, rollupConfigDisplayData, l3Config, downloadZippedConfigs } =
    useConfigDownloads();
  const [{}, dispatch] = useDeploymentPageContext();

  return (
    <div className="rounded-md border border-solid border-grey p-8">
      <div className="flex flex-col gap-3">
        <StepTitle>Download Config</StepTitle>
        <p className="my-1">Configuration files are required to deploy locally.</p>
        <button
          onClick={() => {
            downloadZippedConfigs();
            dispatch({ type: 'set_is_download_completed', payload: true });
          }}
          className="w-fit rounded-md border border-gray-300 bg-white px-5 py-2  text-lg text-black hover:bg-gray-50"
        >
          <i className="pi pi-download mr-2"></i> &nbsp; Download zip files
        </button>
        <p>
          You are able to configure even more settings.{' '}
          <a href="" className="underline">
            Read more in the SDK docs.
          </a>
        </p>
      </div>
      <div className="mx-0 my-2 flex flex-wrap justify-start gap-10 md:flex-nowrap">
        <div className="w-full md:w-1/2">
          <h4 className="mb-2 font-light">Rollup Config</h4>
          {!rollupConfigDownloadData ? (
            <div>No rollup data found.</div>
          ) : (
            <CodeComponent
              fileName="nodeConfig.json"
              dataToDownload={rollupConfigDownloadData}
              dataToDisplay={rollupConfigDisplayData}
            />
          )}
        </div>
        <div className="w-full md:w-1/2">
          <h4 className="mb-2 font-light">L3 Config</h4>
          {!l3Config ? (
            <div>No L3 configuration data found.</div>
          ) : (
            <CodeComponent
              fileName="orbitSetupScriptConfig.json"
              dataToDownload={l3Config}
              dataToDisplay={l3Config}
            />
          )}
        </div>
      </div>
      <DeploymentSummary />
    </div>
  );
}
