import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import Link from 'next/link';
import LoginForm from './LoginForm';
import { BiLogoFacebook } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import BackArrow from '@/components/BackArrow';

const urbanist = Urbanist({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <div
      className={`${urbanist.className} min-h-screen mx-auto max-w-lg flex flex-col gap-6 py-6 px-6 `}>
      <BackArrow href='/' />
      <h3 className='text-3xl font-bold text-[#1E232C]'>
        Welcome back! Glad to see you, Again!
      </h3>
      <LoginForm />
      <div className='flex flex-col gap-4'>
        <div className='flex items-center'>
          <div className='flex-grow h-px bg-gray-300'></div>

          <span className='px-4 text-gray-600'>Or Login With</span>

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
        <span>Don&apos;t have an account?</span>
        <Link href='register' className='text-[#1877F2] font-semibold'>
          Register Now
        </Link>
      </p>
    </div>
  );
}
