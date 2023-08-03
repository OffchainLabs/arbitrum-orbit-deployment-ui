import { FC, SelectHTMLAttributes } from 'react';
import { InfoCircleWithTooltip } from './InfoCircleWithTooltip';

interface SelectInputWithInfoLinkProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  href: string;
  infoText: string;
  options: string[];
}

export const SelectInputWithInfoLink: FC<SelectInputWithInfoLinkProps> = ({
  label,
  href,
  name,
  infoText,
  options,
  onChange,
  ...rest
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline gap-2">
      <label htmlFor={name} className="font-bold">
        {label}
      </label>
      <InfoCircleWithTooltip href={href} infoText={infoText} />
    </div>
    <div className="select-wrapper relative">
      <select
        id={name}
        name={name}
        onChange={onChange}
        className={
          `w-full appearance-none rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input` +
          ' ' +
          (rest.disabled ? 'cursor-not-allowed bg-gray-200 opacity-50' : '')
        }
        {...rest}
      >
        {options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
    </div>
  </div>
);
