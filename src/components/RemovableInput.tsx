import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface RemovableInputProps extends React.HTMLProps<HTMLInputElement> {
  placeholder: string;
  register: UseFormRegisterReturn;
  onRemove: () => void;
  error?: string;
}

export const RemovableInput: React.FC<RemovableInputProps> = ({
  placeholder,
  register,
  onRemove,
  error,
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className={twMerge(
          'w-full rounded-lg border border-[#6D6D6D] px-3 py-2 pr-10 shadow-input',
          error && 'border-red-500',
        )}
        {...register}
      />
      <button
        type="button"
        className="absolute right-1 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full px-3 py-1 text-red-500 hover:bg-[#CCCCCC] hover:text-red-700"
        onClick={onRemove}
      >
        <i className="pi pi-times-circle text-xs" />
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
