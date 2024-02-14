export const ChainTypeInfoPanel = ({
  header,
  description,
  dataAvailabilityLayer,
  gasFee,
  exampleChain,
  logo,
}: {
  header: string;
  description: string;
  dataAvailabilityLayer: string | JSX.Element;
  gasFee: string;
  exampleChain: string | JSX.Element;
  logo: JSX.Element;
}) => {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-2xl">{header}</h3>
      <p>{description}</p>
      <div className="border-px w-full rounded border border-grey bg-[#191919] p-6">
        <h4 className="mb-4 text-2xl">Data Availability Layer</h4>
        <p>{dataAvailabilityLayer}</p>
      </div>
      <div className="flex w-full gap-5">
        <div className="border-px w-full rounded border border-grey bg-[#191919] p-6">
          <h4 className="mb-4 text-2xl">Gas Fee</h4>
          <p>{gasFee}</p>
        </div>
        <div className="border-px w-full rounded border border-grey bg-[#191919] p-6">
          <h4 className="mb-4 text-2xl">Example Chain</h4>
          <div className="flex items-center gap-2">
            {logo}
            {exampleChain}
          </div>
        </div>
      </div>
    </div>
  );
};
