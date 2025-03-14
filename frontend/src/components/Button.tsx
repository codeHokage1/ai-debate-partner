import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'primary' | 'secondary';
  variant?: 'button' | 'link';
}

export default function Button({
  children,
  href,
  onClick,
  type = 'primary',
  variant = 'button',
}: ButtonProps) {
  const className = `${
    type === 'primary' ? 'bg-[#369FFF] text-white' : 'bg-white text-[#1E232C] '
  } rounded-lg py-3 px-6 text-base font-medium cursor-pointer`;

  if (variant === 'link') {
    return (
      <Link href={href || '#'} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
