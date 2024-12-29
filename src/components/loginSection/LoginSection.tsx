'use client';

import React, { useEffect, useState } from 'react';
import styles from './LoginSection.module.scss';
import { fbAuth } from '@/lib/firebase/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const LoginSection: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(fbAuth, googleProvider);
      if (!userCredential || !userCredential?.user?.uid) {
        console.log('userCredential error', { userCredential });
        return;
      }
      const user = userCredential.user;
      console.log({ user });
      router.refresh();
    } catch (error: any) {
      console.log({ handleGoogleLoginError: error });
      toast.error('Something went wrong while login with google');
    }
  };

  return (
    <div>
      {/* <div>
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        <input type='text' value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder='Firstname' />
        <input type='text' value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder='Lastname' />
        <button type='submit' onClick={handleEmailLogin}>
          Login
        </button>
      </div> */}
      <div className='max-w-lg mx-auto mt-16 p-6 border rounded shadow-lg'>
        <h1 className='text-2xl font-semibold text-center mb-4'>Sign in to Tweeter Club</h1>
        <div
          className='font-semibold block mb-2 bg-blue-600 text-white border border-b-2 rounded px-2 py-1 text-center hover:bg-blue-700 hover:cursor-pointer hover:shadow-lg'
          onClick={handleGoogleLogin}
        >
          Sign in With Google
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
