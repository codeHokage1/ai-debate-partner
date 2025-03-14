// components/Providers.tsx
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

interface ProviderProps {
  children: ReactNode;
}

export const Providers: React.FC<ProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position='top-right' />
    </>
  );
};
