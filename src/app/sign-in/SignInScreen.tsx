'use client';

import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { isValidEmail } from '@/lib/constants';
import { fbAuth } from '@/lib/firebase';
import { Divider, PasswordInputText } from '../common';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SignInScreen: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const _inputClassName =
    'text-black w-full bg-[#efefef] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

  const googleLoginClickHandler = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(fbAuth, googleProvider);
      if (!userCredential || !userCredential?.user?.uid) {
        console.log('userCredential error', { userCredential });
        toast.error('Something went wrong while login with google');
        return;
      }
      const user = userCredential.user;
      console.log({ user });
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      toast.dismiss();
      toast.success('user successfully logged in.');
    } catch (error: unknown) {
      console.log({ googleLoginError: error });
      toast.error('something went wrong while login with google. please try again later.');
    }
  };

  const passwordLoginClickHandler = async () => {
    toast.loading('please wait...');
    try {
      const userCredential = await signInWithEmailAndPassword(fbAuth, email, password);
      const user = userCredential.user;
      console.log({ userCredential, user });
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      toast.dismiss();
      toast.success('user successfully logged in.');
    } catch (e) {
      toast.dismiss();
      console.log('passwordLoginError::', e);
      toast.error('something went wrong while logging in. please try again later.');
    }
  };

  const validateField = (name: string, value: string) => {
    if (name === 'email' && !value.includes('@')) {
      return "Email must contain '@'.";
    }
    if (name === 'email' && !value.includes('.', value.indexOf('@'))) {
      return "Email must contain a '.' after '@'.";
    }
    if (name === 'email' && !isValidEmail(value)) {
      return 'Email valid email';
    }
    if (name === 'password' && value.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    const error = validateField(field, value);
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
    setErrorMessage(error);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return <div>User is already logged in. Redirecting to home…</div>;
  } else {
    return (
      <div className={`pt-[20px] w-[100%] h-[100%] flex flex-col items-center justify-start bg-[#181818]`}>
        <div
          className={`w-[100%] h-fit max-w-[425px] flex flex-col justify-start items-center space-y-8 p-5 border-2 rounded-xl shadow-md scale-[0.86] transition-all duration-300 ease-in-out hover:scale-90 hover:bg-[#1b1b1b] border-[#1e1d1f] hover:border-[#313132] hover:shadow-lg`}
        >
          <h1 className={`text-2xl font-semibold text-white text-center mb-4`}>Sign in to Tweeter Club</h1>
          <div
            className='flex flex-row justify-center items-center space-x-2 bg-white border-b-2 border-gray-200 rounded-lg shadow-lg px-2 py-1 cursor-pointer'
            onClick={googleLoginClickHandler}
          >
            <Image src={`/assets/images/google.png`} alt='google-login' width={20} height={20} />
            <div className='text-[#1d1c1c] font-semibold text-[20px]'>Google</div>
          </div>
          <Divider />
          <div className={`w-[90%] flex flex-col justify-start items-center space-y-4`}>
            <input
              autoFocus={true}
              className={_inputClassName}
              type='email'
              value={email}
              onChange={(e) => handleChange(e, 'email')}
              placeholder='Email'
            />
            <PasswordInputText pass={password} handleChange={handleChange} />
            <div className='w-[100%] flex flex-row justify-end items-center'>
              <div
                onClick={() => router.replace('/sign-up')}
                className='w-[100%] text-white italic hover:cursor-pointer hover:underline'
              >
                Register
              </div>
              <div
                onClick={() => router.replace('/forgot-password')}
                className='w-[100%] text-white italic text-end hover:cursor-pointer hover:underline'
              >
                Forgot Password
              </div>
            </div>
            {errorMessage && (
              <div className='mt-2 text-red-500 text-sm text-center'>
                <p>{errorMessage}</p>
              </div>
            )}
            <button
              className={`mt-4 px-4 py-2 font-semibold rounded-lg text-black ${errorMessage === '' && email.length > 0 && password.length > 0 ? 'shadow-lg bg-white cursor-pointer' : 'bg-[#b5bdbd] cursor-default'}`}
              onClick={() => {
                if (errorMessage === '' && email.length > 0 && password.length > 0) {
                  passwordLoginClickHandler();
                }
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default SignInScreen;
