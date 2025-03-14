import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { Aclonica } from 'next/font/google';
import background from '@/../public/img.png';
import Button from '@/components/Button';

const aclonica = Aclonica({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Welcome',
};

export default function Page() {
  return (
    <div className='h-screen w-screen'>
      <Image
        src={background}
        alt='Image of a human brain'
        quality={80}
        placeholder='blur'
        fill
        className='object-cover object-top brightness-50'
      />
      <div className='relative z-10 text-center flex flex-col gap-5 px-10 justify-center h-screen max-w-lg mx-auto'>
        <h1 className={`${aclonica.className} text-5xl text-white`}>
          AI Partner
        </h1>
        <Button variant='link' href='/login'>
          Login
        </Button>
        <Button variant='link' href='/' type='secondary'>
          Continue
        </Button>
        <Link href='/about' className='text-[#35C2C1]'>
          Contine as guest
        </Link>
      </div>
    </div>
  );
}
