'use client';

import React, { useEffect, useState } from 'react';
import styles from './LoginSection.module.scss';
import { fbAuth } from '@/lib/firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { isValidEmail } from '@/lib/constants';

type section = 'register' | 'login' | 'forgot-password';

const LoginSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<section>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPasswordResetEmailSent, setIsPasswordResetEmailSent] = useState(false);

  const router = useRouter();

  const _inputClassName =
    'w-full bg-[#efefef] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

  const resetDefault = () => {
    setEmail('');
    setPassword('');
    setName('');
    setUsername('');
    setIsChecked(false);
    setErrorMessage('');
    setIsPasswordResetEmailSent(false);
  };

  useEffect(() => {
    resetDefault();
  }, [activeSection]);

  const googleLoginClickHandler = async () => {
    toast.success('google');
    return;
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
      //create user in the data - user::verified,name,email,username,profilepicturemediaId,provider
      //login
      //getToken
      //getuser preferences
      //update user logged in info
      router.refresh();
    } catch (error: any) {
      console.log({ handleGoogleLoginError: error });
      toast.error('Something went wrong while login with google');
    }
  };

  const passwordLoginClickHandler = async () => {
    toast.success('password');
    toast.loading('please wait...');
    try {
      const userCredential = await signInWithEmailAndPassword(fbAuth, email, password);
      const user = userCredential.user;
      console.log({ userCredential, user });
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      toast.dismiss();
      toast.success('user successfully logged in.');
      //login
      //getToken
      //getuser preferences
      //update user logged in info
      router.refresh();
    } catch (e) {
      toast.dismiss();
      console.log('passwordLoginError::', e);
      toast.error('something went wrong while logging in. please try again later.');
    }
  };

  const getStartedClickHandler = async () => {
    toast.success('register');
    toast.loading('please wait...');
    try {
      const userCredential = await createUserWithEmailAndPassword(fbAuth, email, password);
      if (!userCredential || !userCredential?.user?.uid) {
        toast.dismiss();
        console.log('create user user credential error::', userCredential);
        toast.error('something went wrong while registering account. please try again later.');
      } else {
        toast.dismiss();
        await signOut(fbAuth);
        //create user in the data - user::not-verified,name,email,username,provider
        setActiveSection('login');
        toast.success('user successfully registered.');
      }
    } catch (e) {
      toast.dismiss();
      console.log('getStartedError::', e);
      toast.error('something went wrong while registering account. please try again later.');
    }
  };

  const resetPasswordClickHandler = async () => {
    toast.success('forgot password');
    toast.loading('please wait...');
    const actionCodeSettings = {
      url: 'http://localhost:3000', //TODO:: replace with original url
      handleCodeInApp: true
    };
    try {
      await sendPasswordResetEmail(fbAuth, email, actionCodeSettings);
      setIsPasswordResetEmailSent(true);
      toast.dismiss();
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (e) {
      toast.dismiss();
      console.log('getStartedError::', e);
      toast.error('something went wrong while sending reset email. please try again later.');
    }
  };

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return `${name} cannot be empty.`;
    }
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
    let error = validateField(field, value);
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'name':
        setName(value);
        break;
      default:
        break;
    }
    setErrorMessage(error);
  };
  //
  return (
    <div className={`pt-[20px] w-[100%] h-[100%] flex flex-col items-center justify-start ${styles.container}`}>
      {activeSection === 'login' && (
        <div
          className={`w-[100%] h-fit max-w-[425px] flex flex-col justify-start items-center space-y-8 ${styles.subContainer}`}
        >
          <h1 className={`text-2xl font-semibold text-center mb-4 ${styles.title}`}>Sign in to Tweeter Club</h1>
          <div
            className='flex flex-row justify-center items-center space-x-2 bg-white border-b-2 border-gray-200 rounded-lg shadow-lg px-2 py-1 cursor-pointer'
            onClick={googleLoginClickHandler}
          >
            <Image src={`/assets/images/google.png`} alt='google-login' width={20} height={20} />
            <div className='text-[#1d1c1c] font-semibold text-[20px]'>Google</div>
          </div>
          <div className={`${styles.divider}`} />
          <div className={`w-[90%] flex flex-col justify-start items-center space-y-4  ${styles.bottomContainer}`}>
            <input
              autoFocus={true}
              className={_inputClassName}
              type='email'
              value={email}
              onChange={(e) => handleChange(e, 'email')}
              placeholder='Email'
            />
            <PasswordComponent pass={password} handleChange={handleChange} />
            <div className='w-[100%] flex flex-row justify-end items-center'>
              <div
                onClick={() => setActiveSection('register')}
                className='w-[100%] text-white italic hover:cursor-pointer hover:underline'
              >
                Register
              </div>
              <div
                onClick={() => setActiveSection('forgot-password')}
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
              Login
            </button>
          </div>
        </div>
      )}
      {activeSection === 'forgot-password' && (
        <div
          className={`w-[100%] h-fit max-w-[425px] flex flex-col justify-start items-center space-y-8 ${styles.subContainer}`}
        >
          <h1 className={`text-2xl font-semibold text-center mb-4 ${styles.title}`}>Reset Your Password</h1>
          <div className={`w-[90%] flex flex-col justify-start items-center space-y-4  ${styles.bottomContainer}`}>
            {isPasswordResetEmailSent ? (
              <div className='w-full max-w-md mx-auto p-6 bg-[#3b3c3e] text-white rounded-lg shadow-xl flex items-center space-x-4'>
                <EnvelopeIcon className='w-8 h-8 text-white' />
                <div className='flex-1'>
                  <p className='font-semibold text-lg'>Password Reset Email Sent!</p>
                  <p className='text-sm mt-1'>
                    We've sent a password reset link to your email address
                    {email.length > 0 && <span className='text-lg font-semibold'>{` :: (${email})`}</span>}.{' '}
                  </p>
                  <p className='text-sm mt-1'>
                    Please check your inbox, and if you don't see it, be sure to check your spam folder.
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
            <div className={`${styles.divider}`} />
            <button
              className={`w-[120px] mt-4 px-4 py-2 font-semibold rounded-lg text-white shadow-lg bg-[#0f48bb] cursor-pointer`}
              onClick={() => setActiveSection('login')}
            >
              Login
            </button>
          </div>
        </div>
      )}
      {activeSection === 'register' && (
        <div
          className={`w-[100%] h-fit max-w-[425px] flex flex-col justify-start items-center space-y-8 ${styles.subContainer}`}
        >
          <h1 className={`text-2xl font-semibold text-center mb-4 ${styles.title}`}>Sign up to Tweeter Club</h1>
          <input
            autoFocus={true}
            className={_inputClassName}
            type='text'
            value={name}
            onChange={(e) => handleChange(e, 'name')}
            placeholder='Full Name'
          />
          <input
            className={_inputClassName}
            type='email'
            value={email}
            onChange={(e) => handleChange(e, 'email')}
            placeholder='Email'
          />
          <input
            className={_inputClassName}
            type='username'
            value={username}
            onChange={(e) => handleChange(e, 'username')}
            placeholder='Username'
          />
          <PasswordComponent pass={password} handleChange={handleChange} />
          <label className='flex items-center space-x-2 cursor-pointer'>
            <input
              type='checkbox'
              className='w-5 h-5 accent-blue-500 cursor-pointer'
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e.target.checked);
              }}
            />
            <span className='text-gray-700 text-sm'>
              I agree to the{' '}
              <a href='#' className='text-blue-500 hover:underline'>
                Terms and Conditions
              </a>
            </span>
          </label>
          {errorMessage && (
            <div className='mt-2 text-red-500 text-sm text-center'>
              <p>{errorMessage}</p>
            </div>
          )}
          <button
            className={`mt-4 px-4 py-2 font-semibold rounded-lg text-black ${
              errorMessage === '' &&
              name.length > 0 &&
              email.length > 0 &&
              username.length > 0 &&
              password.length > 0 &&
              isChecked
                ? 'shadow-lg bg-white cursor-pointer'
                : 'bg-[#b5bdbd] cursor-default'
            }`}
            onClick={() => {
              if (
                errorMessage === '' &&
                name.length > 0 &&
                email.length > 0 &&
                username.length > 0 &&
                password.length > 0 &&
                isChecked
              ) {
                getStartedClickHandler();
              }
            }}
          >
            Get Started
          </button>
          <div className={`${styles.divider}`} />
          <div className='flex flex-col items-center'>
            <div className='font-semibold text-white italic'>Already have an account?</div>
            <button
              className={`w-[120px] mt-4 px-4 py-2 font-semibold rounded-lg text-white shadow-lg bg-[#0f48bb] cursor-pointer`}
              onClick={() => setActiveSection('login')}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSection;

interface IPasswordComponentProps {
  pass: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const PasswordComponent: React.FC<IPasswordComponentProps> = ({ pass, handleChange }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className='relative w-full'>
      <input
        className='w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        type={isShowPassword ? 'text' : 'password'}
        value={pass}
        onChange={(e) => handleChange(e, 'password')}
        placeholder='Password'
      />
      <button
        type='button'
        className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent p-1'
        onClick={handleClick}
      >
        {isShowPassword ? (
          <EyeSlashIcon className='w-5 h-5 bg-transparent' />
        ) : (
          <EyeIcon className='w-5 h-5 bg-transparent' />
        )}
      </button>
    </div>
  );
};
