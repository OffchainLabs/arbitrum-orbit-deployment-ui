import { ChainType } from '@/types/ChainType';

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
        ' grid cursor-pointer grid-cols-9 items-center justify-center rounded border border-[#243145] py-6 pr-6 accent-[#243145] hover:bg-[#f2f7ff]	' +
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
      <div className="col-span-8 cursor-pointer justify-center text-left">
        <label htmlFor="rollup" className="cursor-pointer text-lg font-bold">
          {label}
        </label>
        <p className="text-sm text-slate-700">{description}</p>
      </div>
    </div>
  );
};
