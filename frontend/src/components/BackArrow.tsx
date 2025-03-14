import Image from 'next/image';
import Link from 'next/link';
import Arrow from '@/../public/back_arrow.svg';

export default function BackArrow({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className='border-1 border-[#1876f2a9] py-3 px-4 rounded-lg cursor-pointer self-start'>
      <Image src={Arrow} alt='Back Arrow' />
    </Link>
  );
}
