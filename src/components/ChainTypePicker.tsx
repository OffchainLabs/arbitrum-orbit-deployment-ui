import { ChainType } from '@/pages/deployment/DeploymentPageContext';

type ChainTypePickerProps = {
  selectedChainType?: string;
  onClick: (chainType: ChainType) => void;
  chainType?: ChainType;
  label: string;
  description: string;
};

export const ChainTypePicker: React.FC<ChainTypePickerProps> = ({
  selectedChainType,
  onClick,
  chainType,
  label,
  description,
}) => {
  return (
    <div
      className={
        ' grid cursor-pointer grid-cols-12 items-center justify-center rounded-lg border border-[#243145] p-2  accent-[#243145] hover:bg-[#f2f7ff]	' +
        (selectedChainType === chainType ? ' bg-[#f2f7ff]' : '')
      }
      onClick={() => {
        if (!chainType) return;
        onClick(chainType);
      }}
    >
      <div className="col-span-1 text-center">
        <input
          type="radio"
          id="rollup"
          name="chainType"
          value={chainType}
          checked={selectedChainType === chainType}
          className="h-6 w-6 cursor-pointer"
          readOnly
        />
      </div>
      <div className="col-span-11 cursor-pointer justify-center">
        <label htmlFor="rollup" className="cursor-pointer font-bold">
          {label}
        </label>
        <p>{description}</p>
      </div>
    </div>
  );
};
