'use client';

interface PasswordProps {
  placeholder?: string;
  id: string;
}

import { useState, forwardRef } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const PasswordInput = forwardRef<HTMLInputElement, PasswordProps>(
  ({ placeholder, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className='relative flex w-full items-center'>
        <input
          autoComplete='true'
          id={id}
          ref={ref}
          className='bg-[#F7F8F9] rounded-lg border-[#E8ECF4] w-full py-3 px-4 outline-none flex-1'
          placeholder={placeholder}
          type={showPassword ? 'text' : 'password'}
          {...props}
        />
        <span
          className='absolute right-2 cursor-pointer'
          onClick={() => setShowPassword(prevState => !prevState)}>
          {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
        </span>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
