import { UseFormRegisterReturn, InternalFieldName } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';
import { EditableInput } from './EditableInput';
import { ScrollWrapper } from './ScrollWrapper';

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
    <ScrollWrapper anchor={anchor} className="mt-2 flex flex-col gap-1">
      <label htmlFor={name} className={'cursor-pointer underline'}>
        <span>
          {label}
          {' #'}
        </span>
      </label>
      <EditableInput {...props} />
      {explainerText && <span className="text-sm text-zinc-500">{explainerText}</span>}
      {error && <span className="text-red-500">{error}</span>}
    </ScrollWrapper>
  );
};
