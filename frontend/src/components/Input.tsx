'use client';

interface InputProps {
  variant?: 'text' | 'email';
  placeholder?: string;
}

export default function Input({ variant = 'text', placeholder }: InputProps) {
  return (
    <input
      type={variant}
      placeholder={placeholder}
      className='bg-[#F7F8F9] rounded-lg border-[#E8ECF4] w-full py-3 px-4 outline-none'
    />
  );
}
