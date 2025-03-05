import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  onShowPassword?: () => void
}

const InputField: React.FC<Props> = ({ startIcon, endIcon, onShowPassword, ...inputProps }) => {
  return (
    <div className="relative w-full">
      <input
        {...inputProps}
        className={`w-full h-[44px] pr-4 py-2 rounded-lg border border-solid border-[#DBDBDB] text-black ${startIcon ? 'pl-10' : 'pl-2'}`}
      />
      {startIcon}
      {
        <button className="absolute right-3 top-1/3 text-gray-400" type='button'
        onClick={onShowPassword}
      >
        {endIcon}
      </button>
      }
    </div> 
  );
};

export default InputField;
