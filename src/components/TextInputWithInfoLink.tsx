import { ChangeEvent, FC, InputHTMLAttributes, useState } from 'react';
import { InfoCircleWithTooltip } from './InfoCircleWithTooltip';

interface TextInputWithInfoLinkProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  href: string;
  name: string;
  placeholder?: string;
  infoText: string;
  value?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const TextInputWithInfoLink: FC<TextInputWithInfoLinkProps> = ({
  label,
  href,
  name,
  placeholder,
  infoText,
  value,
  onChange = () => {},
  type = 'text',
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label htmlFor={name} className="font-bold">
          {label}
        </label>
        <InfoCircleWithTooltip href={href} infoText={infoText} />
      </div>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input"
        {...rest}
      />
    </div>
  );
};
