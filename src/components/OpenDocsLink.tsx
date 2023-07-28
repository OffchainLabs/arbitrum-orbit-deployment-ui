import { ExternalLink } from './ExternalLink';

export const OpenDocsLink = () => {
  return (
    <ExternalLink
      href={`${process.env.NEXT_PUBLIC_ARBITRUM_DOCS_BASE_URL}/launch-orbit-chain/orbit-quickstart`}
      className="text-lg  text-[#1366C1] underline"
    >
      Open Supporting Documentation For This Flow
      <i className="pi pi-external-link mx-2"></i>
    </ExternalLink>
  );
};
