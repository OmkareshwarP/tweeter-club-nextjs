'use client';

import React, { useEffect, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { isValidEmail } from '@/lib/constants';
import { fbAuth } from '@/lib/firebase';
import { Divider } from '../common';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const ForgotPasswordScreen: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPasswordResetEmailSent, setIsPasswordResetEmailSent] = useState(false);
  const router = useRouter();

  const _inputClassName =
    'text-black w-full bg-[#efefef] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

  const resetPasswordClickHandler = async () => {
    toast.loading('please wait...');
    const actionCodeSettings = {
      url: process.env.NEXT_PUBLIC_AUTH_DOMAIN_URL as string,
      handleCodeInApp: true
    };
    try {
      await sendPasswordResetEmail(fbAuth, email, actionCodeSettings);
      setIsPasswordResetEmailSent(true);
      toast.dismiss();
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (e) {
      toast.dismiss();
      console.log('resetPasswordError::', e);
      toast.error('something went wrong while sending password reset email. please try again later.');
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
          <h1 className={`text-2xl font-semibold text-center mb-4 text-white`}>Reset Your Password</h1>
          <div className={`w-[90%] flex flex-col justify-start items-center space-y-4`}>
            {isPasswordResetEmailSent ? (
              <div className='w-full max-w-md mx-auto p-6 bg-[#3b3c3e] text-white rounded-lg shadow-xl flex items-center space-x-4'>
                <EnvelopeIcon className='w-8 h-8 text-white' />
                <div className='flex-1'>
                  <p className='font-semibold text-lg'>Password Reset Email Sent!</p>
                  <p className='text-sm mt-1'>
                    {"We've sent a password reset link to your email address"}
                    {email.length > 0 && <span className='font-semibold'>{` (${email})`}</span>}.{' '}
                  </p>
                  <p className='text-sm mt-1'>
                    Please check your inbox, and if you {"don't"} see it, be sure to check your spam folder.
                  </p>
                  <p className='text-sm text-gray-200 mt-2'>
                    Click the link in the email to reset your password, then log in with your new credentials.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <input
                  autoFocus={true}
                  className={_inputClassName}
                  type='email'
                  value={email}
                  onChange={(e) => handleChange(e, 'email')}
                  placeholder='Email'
                />
                <>
                  {errorMessage && (
                    <div className='mt-2 text-red-500 text-sm text-center'>
                      <p>{errorMessage}</p>
                    </div>
                  )}
                </>
                <button
                  className={`w-[120px] mt-4 px-4 py-2 font-semibold rounded-lg text-black ${errorMessage === '' && email.length > 0 ? 'shadow-lg bg-white cursor-pointer' : 'bg-[#b5bdbd] cursor-default'}`}
                  onClick={() => {
                    if (errorMessage === '' && email.length > 0) {
                      resetPasswordClickHandler();
                    }
                  }}
                >
                  Submit
                </button>
              </>
            )}
            <Divider />
            <button
              className={`w-[120px] mt-4 px-4 py-2 font-semibold rounded-lg text-white shadow-lg bg-[#0f48bb] cursor-pointer`}
              onClick={() => router.replace('/sign-in')}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ForgotPasswordScreen;
