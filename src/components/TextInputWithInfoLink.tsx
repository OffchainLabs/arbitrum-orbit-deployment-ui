import { UseFormRegisterReturn, InternalFieldName } from 'react-hook-form';
import { InfoCircleWithTooltip } from './InfoCircleWithTooltip';
import { InputHTMLAttributes } from 'react';
import { twJoin } from 'tailwind-merge';

interface TextInputWithInfoLinkProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  explainerText?: string;
  href: string;
  infoText: string | JSX.Element;
  error?: string;
  isLoading?: boolean;
  register?: () => UseFormRegisterReturn<InternalFieldName>;
}

export const TextInputWithInfoLink = ({
  label,
  explainerText,
  href,
  infoText,
  error,
  isLoading,
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
      <div className="relative">
        <input
          id={props.name}
          className={twJoin(
            'w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input',
            error && 'border-red-500',
            props.disabled && 'cursor-not-allowed bg-gray-200 opacity-50',
          )}
          {...props}
          {...getRegister()}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="border-primary-500 h-4 w-4 animate-spin rounded-full border-b-2 border-t-2"></div>
          </div>
        )}
      </div>

      {explainerText && <span className="text-sm text-zinc-500">{explainerText}</span>}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
