import { UseFormRegisterReturn, InternalFieldName } from 'react-hook-form';
import { InfoCircleWithTooltip } from './InfoCircleWithTooltip';
import { InputHTMLAttributes } from 'react';

interface TextInputWithInfoLinkProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  href: string;
  infoText: string | JSX.Element;
  error?: string;
  register?: () => UseFormRegisterReturn<InternalFieldName>;
}

export const TextInputWithInfoLink = ({
  label,
  href,
  infoText,
  error,
  register,
  ...props
}: TextInputWithInfoLinkProps) => {
  const getRegister = () => {
    if (register) return register();
    return [];
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label htmlFor={props.name} className="font-bold">
          {label}
        </label>
        <InfoCircleWithTooltip href={href} infoText={infoText} />
      </div>
      <input
        id={props.name}
        className={
          `w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input ` +
          (error && 'border-red-500')
        }
        {...props}
        {...getRegister()}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
