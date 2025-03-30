'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { allowedSecondaryPaths, isValidEmail, pageReload } from '@/lib/constants';
import { fbAuth, FBUser, handleFirebaseError, logOutHandler } from '@/lib/firebase';
import { Divider, PasswordInputText } from '../common';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useMutation } from '@apollo/client';
import { CREATE_USER, LOGIN } from '@/graphql/mutations';
import { IResponseData } from '@/interfaces';
import { userManageClient } from '@/lib/apollo-client';

const SignInScreen: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/';

  const _inputClassName =
    'text-black w-full bg-[#efefef] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

  const [login] = useMutation(LOGIN, { client: userManageClient });
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

  const loginHandler = async (user: FBUser): Promise<IResponseData> => {
    const response = await login({
      variables: {
        userIdentifier: user?.email,
        provider: user?.providerData[0]?.providerId,
        deviceInfo: null,
        operatingSystem: null
      }
    });
    const result = response.data.login as IResponseData;
    return result;
  };

  const googleLoginClickHandler = async () => {
    toast.loading('please wait...');
    try {
      const googleProvider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(fbAuth, googleProvider);

      if (!userCredential || !userCredential?.user?.uid) {
        toast.dismiss();
        toast.error('Something went wrong while login with google');
        return;
      }

      const user = userCredential.user;
      const fbToken = await user.getIdToken();
      localStorage.setItem('authToken', fbToken);

      const _loginData = await loginHandler(user);
      if (_loginData?.data?.isNewUser) {
        toast.dismiss();
        setIsNewUser(true);
      } else if (_loginData?.data?.token?.length >= 4) {
        const token = _loginData?.data?.token || '';
        localStorage.setItem('authToken', token);
        toast.dismiss();
        toast.success('user successfully logged in.');
        resetFormData();
        router.replace(redirectUrl);
        pageReload();
      } else {
        toast.dismiss();
        toast.error('something went wrong while login with google. please try again later.');
        resetFormData();
        await logOutHandler();
        pageReload();
      }
    } catch (error: unknown) {
      toast.dismiss();
      const { isFirebaseError, message } = handleFirebaseError(error);
      if (isFirebaseError && message !== '') {
        toast.error(message);
        return;
      }
      console.log({ googleLoginError: error });
      toast.error('something went wrong while login with google. please try again later.');
    }
  };

  const googleNewUserLoginHandler = async () => {
    if (!fbAuth.currentUser?.uid) {
      toast.error('Something went wrong while login with google');
      setIsNewUser(false);
      resetFormData();
      await logOutHandler();
      return;
    }
    toast.loading('please wait...');
    try {
      const _createUserData = await createUserHandler();
      if (_createUserData?.error) {
        toast.dismiss();
        toast.error(_createUserData.message);
        setIsNewUser(false);
        resetFormData();
        await logOutHandler();
      } else {
        const _loginData = await loginHandler(fbAuth.currentUser);
        if (!_loginData?.data?.isNewUser && _loginData?.data?.token?.length >= 4) {
          const token = _loginData?.data?.token || '';
          localStorage.setItem('authToken', token);
          toast.dismiss();
          toast.success('user successfully logged in.');
          resetFormData();
          router.replace(redirectUrl);
          pageReload();
        } else {
          toast.dismiss();
          toast.error('something went wrong while login with google. please try again later.');
          await logOutHandler();
          resetFormData();
          setIsNewUser(false);
          pageReload();
        }
      }
    } catch (error: unknown) {
      toast.dismiss();
      await logOutHandler();
      setIsNewUser(false);
      const { isFirebaseError, message } = handleFirebaseError(error);
      if (isFirebaseError && message !== '') {
        toast.error(message);
        return;
      }
      console.log({ googleNewUserLoginError: error });
      toast.error('something went wrong while login with google. please try again later.');
    }
  };

  const passwordLoginClickHandler = async () => {
    toast.loading('please wait...');
    try {
      const userCredential = await signInWithEmailAndPassword(fbAuth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);

      const _loginData = await loginHandler(user);
      if (!_loginData?.data?.isNewUser && _loginData?.data?.token?.length >= 4) {
        const token = _loginData?.data?.token || '';
        localStorage.setItem('authToken', token);
        toast.dismiss();
        toast.success('user successfully logged in.');
        resetFormData();
        router.replace(redirectUrl);
        pageReload();
      } else {
        toast.dismiss();
        toast.error('something went wrong while logging in. please try again later.');
        resetFormData();
        await logOutHandler();
        pageReload();
      }
    } catch (e) {
      toast.dismiss();
      const { isFirebaseError, message } = handleFirebaseError(e);
      if (isFirebaseError && message !== '') {
        toast.error(message);
        return;
      }
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
      case 'name':
        setName(value);
        break;
      case 'username':
        setUsername(value);
        break;
      default:
        break;
    }
    setErrorMessage(error);
  };

  useEffect(() => {
    //TODO:: remove this code later
    let isValidRoute = true;
    const secondaryRoutes = pathname.split('/');
    if (secondaryRoutes.length > 3) {
      isValidRoute = false;
    } else if (secondaryRoutes.length > 2) {
      isValidRoute = allowedSecondaryPaths.includes(secondaryRoutes[2]);
    }

    if (isAuthenticated && isValidRoute) {
      if (pathname == '/sign-in') {
        router.replace('/');
      } else {
        router.replace(window.location.href);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const resetFormData = () => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setIsNewUser(false);
    setName('');
    setUsername('');
  };

  if (isAuthenticated) {
    return <div>User is already logged in. Redirecting to home…</div>;
  } else {
    return (
      <div className={`pt-[20px] w-[100%] h-[100%] flex flex-col items-center justify-start bg-[#181818]`}>
        <div
          className={`w-[100%] h-fit max-w-[425px] flex flex-col justify-start items-center space-y-8 p-5 border-2 rounded-xl shadow-md scale-[0.86] transition-all duration-300 ease-in-out hover:scale-90 hover:bg-[#1b1b1b] border-[#1e1d1f] hover:border-[#313132] hover:shadow-lg`}
        >
          {!isNewUser ? (
            <>
              <h1 className={`text-2xl font-semibold text-white text-center mb-4`}>Sign in to Tweeter Club</h1>
              <div
                className='flex flex-row justify-center items-center space-x-2 bg-white border-b-2 border-gray-200 rounded-lg shadow-lg px-2 py-1 cursor-pointer'
                onClick={googleLoginClickHandler}
              >
                <Image src={`/assets/images/google-icon.svg`} alt='google-login' width={20} height={20} />
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
            </>
          ) : (
            <>
              <h1 className={`text-lg font-semibold text-white text-center mb-4`}>
                Please enter below details to continue
              </h1>
              <Divider />
              <div className={`w-[90%] flex flex-col justify-start items-center space-y-4`}>
                <input
                  disabled={true}
                  autoFocus={true}
                  className={_inputClassName}
                  type='email'
                  value={email}
                  onChange={(e) => handleChange(e, 'email')}
                  placeholder='Email'
                />
                <input
                  autoFocus={true}
                  className={_inputClassName}
                  type='name'
                  value={name}
                  onChange={(e) => handleChange(e, 'name')}
                  placeholder='Full Name'
                />
                <input
                  autoFocus={true}
                  className={_inputClassName}
                  type='username'
                  value={username}
                  onChange={(e) => handleChange(e, 'username')}
                  placeholder='Username'
                />
                <button
                  className={`mt-4 px-4 py-2 font-semibold rounded-lg text-black ${email.length > 0 && name.length > 0 && username.length > 0 ? 'shadow-lg bg-white cursor-pointer' : 'bg-[#b5bdbd] cursor-default'}`}
                  onClick={() => {
                    if (email.length > 0 && name.length > 0 && username.length > 0) {
                      googleNewUserLoginHandler();
                    }
                  }}
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default function WrappedSignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInScreen />
    </Suspense>
  );
}

// export default SignInScreen;
