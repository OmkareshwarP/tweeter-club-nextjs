'use client';

import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { allowedSecondaryPaths, isValidEmail } from '@/lib/constants';
import { fbAuth, handleFirebaseError, logOutHandler } from '@/lib/firebase';
import { Divider, PasswordInputText } from '../common';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IResponseData } from '@/interfaces';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/graphql/mutations';
import { userManageClient } from '@/lib/apollo-client';

const SignUpScreen: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  const _inputClassName =
    'text-black w-full bg-[#efefef] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

  const [createUser] = useMutation(CREATE_USER, { client: userManageClient });

  const createUserHandler = async (): Promise<IResponseData | null> => {
    const res = await fetch('/api/ip');
    const data = await res.json();
    const _ipAddress = data?.ip || '';
    const _currentUser = fbAuth.currentUser;
    const _providerId = _currentUser?.providerData[0]?.providerId;
    const response = await createUser({
      variables: {
        userIdentifier: _currentUser?.email,
        provider: _providerId,
        name,
        username,
        profilePictureMediaId: _currentUser?.photoURL,
        signUpIpv4Address: _ipAddress
      }
    });
    const result = response.data.createUser as IResponseData;
    return result;
  };

  const signUpOnClickHandler = async () => {
    toast.loading('please wait...');
    try {
      const userCredential = await createUserWithEmailAndPassword(fbAuth, email, password);
      if (!userCredential || !userCredential?.user?.uid) {
        toast.dismiss();
        toast.error('something went wrong while registering account. please try again later.');
      } else {
        const fbToken = await userCredential.user.getIdToken();
        localStorage.setItem('authToken', fbToken);
        const _createUserData = await createUserHandler();
        toast.dismiss();
        if (!_createUserData?.error) {
          toast.success('user successfully registered.');
          resetFormData();
        } else {
          toast.error(_createUserData?.message);
        }
      }
      await signOut(fbAuth);
      await logOutHandler();
    } catch (e) {
      toast.dismiss();
      const { isFirebaseError, message } = handleFirebaseError(e);
      if (isFirebaseError) {
        toast.error(message);
        return;
      }
      console.log('signUpError::', e);
      toast.error('something went wrong while registering account. please try again later.');
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

  useEffect(() => {
    let isValidRoute = true;
    const secondaryRoutes = pathname.split('/');
    if (secondaryRoutes.length > 3) {
      isValidRoute = false;
    } else if (secondaryRoutes.length > 2) {
      isValidRoute = allowedSecondaryPaths.includes(secondaryRoutes[2]);
    }

    if (isAuthenticated && isValidRoute) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const resetFormData = () => {
    setEmail('');
    setPassword('');
    setName('');
    setUsername('');
    setIsChecked(false);
    setErrorMessage('');
  };

  if (isAuthenticated) {
    return <div>User is already logged in. Redirecting to home…</div>;
  } else {
    return (
      <div className={`pt-[20px] w-[100%] h-[100%] flex flex-col items-center justify-start bg-[#181818]`}>
        <div
          className={`w-[100%] h-fit max-w-[425px] flex flex-col justify-start items-center space-y-8 p-5 border-2 rounded-xl shadow-md scale-[0.86] transition-all duration-300 ease-in-out hover:scale-90 hover:bg-[#1b1b1b] border-[#1e1d1f] hover:border-[#313132] hover:shadow-lg`}
        >
          <h1 className={`text-2xl font-semibold text-center mb-4 text-white`}>Sign up to Tweeter Club</h1>
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
          <PasswordInputText pass={password} handleChange={handleChange} />
          <label className='flex items-center space-x-2 cursor-pointer'>
            <input
              type='checkbox'
              className='w-5 h-5 accent-blue-500 cursor-pointer'
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e.target.checked);
              }}
            />
            <span className='text-gray-400 text-sm'>
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
                signUpOnClickHandler();
              }
            }}
          >
            Register
          </button>
          <Divider />
          <div className='flex flex-col items-center'>
            <div className='font-semibold text-white italic'>Already have an account?</div>
            <button
              className={`w-[120px] mt-4 px-4 py-2 font-semibold rounded-lg text-white shadow-lg bg-[#2931d0] cursor-pointer`}
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

export default SignUpScreen;
