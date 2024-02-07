import { UseFormRegisterReturn, InternalFieldName } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';
import { twJoin } from 'tailwind-merge';
import { AnchorLabel } from './AnchorLabel';
import { EditableInput } from './EditableInput';

interface TextInputWithInfoLinkProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  explainerText?: string;
  error?: string;
  anchor?: string;
  register?: () => UseFormRegisterReturn<InternalFieldName>;
}

export const TextInputWithInfoLink = (props: TextInputWithInfoLinkProps) => {
  const { anchor, label, explainerText, error, name } = props;
  return (
    <div className="mt-2 flex flex-col gap-1">
      <AnchorLabel anchor={anchor} label={label} inputId={name} />
      <EditableInput {...props} />
      {explainerText && <span className="text-sm text-zinc-500">{explainerText}</span>}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
