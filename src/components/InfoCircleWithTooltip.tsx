import { FC, useState } from 'react';

interface InfoCircleWithTooltipProps {
  href: string;
  infoText: string | JSX.Element;
}

export const InfoCircleWithTooltip: FC<InfoCircleWithTooltipProps> = ({ href, infoText }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleMouseEnter = () => setIsTooltipVisible(true);
  const handleMouseLeave = () => setIsTooltipVisible(false);

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer"
    >
      <a target="_blank" rel="noopener noreferrer" href={href}>
        <i className="pi pi-info-circle" />
      </a>
      {isTooltipVisible && (
        <div className="absolute bottom-0 left-full z-10 ml-2 w-max rounded-md bg-black px-2 py-1 text-xs text-white">
          {infoText}
        </div>
      )}
    </span>
  );
};
