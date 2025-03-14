'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import PasswordInput from '@/components/PasswordInput';
import Link from 'next/link';

export default function LoginForm() {
  return (
    <form className='flex flex-col gap-4'>
      <Input placeholder='Enter your email' variant='email' />
      <PasswordInput id='password' placeholder='Enter your password' />
      <Link href='/forget-password' className='self-end'>
        Forget password?
      </Link>
      <Button>Log in</Button>
    </form>
  );
}
