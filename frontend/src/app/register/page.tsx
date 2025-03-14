import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import Link from 'next/link';
import BackArrow from '@/components/BackArrow';
import { BiLogoFacebook } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import RegistrationForm from './RegistrationForm';

const urbanist = Urbanist({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Register',
};

export default function Page() {
  return (
    <div
      className={`${urbanist.className} min-h-screen max-w-lg mx-auto flex flex-col gap-6 py-6 px-6`}>
      <BackArrow href='/' />
      <h3 className='text-3xl font-bold text-[#1E232C]'>
        Hello! Register to get started
      </h3>
      <RegistrationForm />
      <div className='flex flex-col gap-4'>
        <div className='flex items-center'>
          <div className='flex-grow h-px bg-gray-300'></div>

          <span className='px-4 text-gray-600'>Or Register With</span>

          <div className='flex-grow h-px bg-gray-300'></div>
        </div>
        <div className='flex gap-4'>
          <button className='border-1 border-[#E8ECF4] py-2 flex-1 flex items-center justify-center rounded-lg cursor-pointer'>
            <BiLogoFacebook size={25} fill='#1877F2' />
          </button>
          <button className='border-1 border-[#E8ECF4] py-2 flex-1 flex items-center justify-center rounded-lg cursor-pointer'>
            <FcGoogle size={25} />
          </button>
          <button className='border-1 border-[#E8ECF4] py-2 flex-1 flex items-center justify-center rounded-lg cursor-pointer'>
            <FaApple size={25} />
          </button>
        </div>
      </div>
      <p className='text-center mt-auto flex gap-1 items-center justify-center'>
        <span>Already have an account?</span>
        <Link href='login' className='text-[#1877F2] font-semibold'>
          Login Now
        </Link>
      </p>
    </div>
  );
}
