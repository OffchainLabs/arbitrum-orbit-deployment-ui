import React, { useState } from 'react';
import { InternalFieldName, UseFormRegisterReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface EditableInputProps extends React.HTMLProps<HTMLInputElement> {
  register?: () => UseFormRegisterReturn<InternalFieldName>;
  name?: string;
  error?: string;
}

export const EditableInput = ({ register, ...props }: EditableInputProps) => {
  const getRegister = () => {
    if (register) return register();
    return [];
  };

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative">
      <input
        id={props.name}
        disabled={!isEditing || props.disabled}
        className={twMerge(
          'w-full rounded-md border border-[#6D6D6D] bg-[#DADADA] px-3 py-2 pr-10 shadow-input',
          props.error && 'border-red-500',
          isEditing && 'bg-white',
          !isEditing && 'cursor-not-allowed',
        )}
        {...props}
        {...getRegister()}
      />
      {!props.disabled && !isEditing && (
        <div
          className="absolute right-1 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full px-3 py-1 text-black hover:bg-[#CCCCCC]"
          onClick={() => setIsEditing(true)}
        >
          <i className="pi pi-pencil text-xs" />
        </div>
      )}
    </div>
  );
};
