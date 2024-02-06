import React, { useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

export const EditableInput = ({ register, ...props }: any) => {
  const getRegister = () => {
    if (register) return register();
    return [];
  };

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="relative">
      <input
        id={props.name}
        disabled={!isEditing}
        className={twMerge(
          'w-full rounded-md border border-[#6D6D6D] bg-[#DADADA] px-3 py-2 pr-10 shadow-input',
          props.error && 'border-red-500',
          isEditing && 'bg-white',
          !isEditing && 'cursor-not-allowed',
        )}
        {...props}
        {...getRegister()}
      />
      {!isEditing && (
        <div
          className="absolute right-1 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-full px-3 py-1 text-black hover:bg-[#CCCCCC]"
          onClick={toggleEditing}
        >
          <i className="pi pi-pencil text-xs" />
        </div>
      )}
    </div>
  );
};
