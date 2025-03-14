'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import PasswordInput from '@/components/PasswordInput';

export default function RegitrationForm() {
  return (
    <form className='flex flex-col gap-4'>
      <Input placeholder='Username' variant='text' />
      <Input placeholder='Email' variant='email' />

      <PasswordInput id='password' placeholder='Password' />
      <PasswordInput id='confirmpassword' placeholder='Confirm Password' />

      <Button>Register</Button>
    </form>
  );
}
