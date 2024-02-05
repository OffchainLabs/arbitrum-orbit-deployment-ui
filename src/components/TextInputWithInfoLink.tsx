import { UseFormRegisterReturn, InternalFieldName } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';
import { twJoin } from 'tailwind-merge';
import { AnchorLabel } from './AnchorLabel';

interface TextInputWithInfoLinkProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  explainerText?: string;
  href: string;
  infoText: string | JSX.Element;
  error?: string;
  anchor?: string;
  register?: () => UseFormRegisterReturn<InternalFieldName>;
}

export const TextInputWithInfoLink = ({
  label,
  explainerText,
  href,
  error,
  register,
  anchor,
  ...props
}: TextInputWithInfoLinkProps) => {
  const getRegister = () => {
    if (register) return register();
    return [];
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <AnchorLabel anchor={anchor} label={label} inputId={props.name} />
      </div>
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
      {explainerText && <span className="text-sm text-zinc-500">{explainerText}</span>}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
