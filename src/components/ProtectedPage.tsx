'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { fbAuth, FBUser } from '@/lib/firebase/firebaseConfig';
import { IFBAuth, IUserAuth, resetAuth, setFbAuth, setUserAuth } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';
import { IResponseData } from '@/interfaces';
import { useMutation } from '@apollo/client';
import { CREATE_USER, LOGIN } from '@/graphql/mutations';
import { logOutHandler } from '@/lib/firebase/auth';
import LoginSection from './loginSection/LoginSection';

import styles from './ProtectedPage.module.scss';

interface ProtectedPageProps {
  children: React.ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const authStore = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const fbEmail = authStore.fbAuth?.email;
  const userEmail = authStore.userAuth?.email;
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [currentFbUser, setCurrentFbUser] = useState<FBUser>();

  const [login] = useMutation(LOGIN);
  const [createUser] = useMutation(CREATE_USER);

  const createUserHandler = async (user: FBUser): Promise<IResponseData | null> => {
    if (!name || name.length == 0 || !username || username.length == 0) {
      toast.error('please enter all required fields.');
      return null;
    } else if (name.length > 28) {
      toast.error('The name must not exceed 28 characters.');
      return null;
    } else if (username.length < 8 || username.length > 15) {
      toast.error('Username must be between 8 and 15 characters long');
      return null;
    } else {
      toast.loading('Please wait...');
      const res = await fetch('/api/ip');
      const data = await res.json();
      const _ipAddress = data?.ip || '';
      const _providerId = user?.providerData[0]?.providerId;
      const response = await createUser({
        variables: {
          email: user?.email,
          provider: _providerId,
          verificationStatus: user?.emailVerified ? 'verified' : 'notverified',
          name,
          username,
          profilePictureMediaId: user?.photoURL,
          signUpIpv4Address: _ipAddress
        }
      });
      toast.dismiss();
      const result = response.data.createUser as IResponseData;
      console.log({ result });
      return result;
    }
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
    console.log({ result });
    return result;
  };

  const loginActionHandler = async (user: FBUser) => {
    let _token = localStorage.getItem('authToken') || '';

    const _authUserData: IUserAuth = {
      email: user.email!,
      provider: user.providerData[0]?.providerId,
      token: _token
    };

    if (!_token || _token.length <= 5) {
      console.log('Token not found. Fetching token...');
      const _userData = await loginHandler(user);
      if (_userData && _userData.errorCodeForClient === 'userNotFound') {
        //TODO:: userFoundAndNotVerified
        const _isNewUser = _userData?.data?.isNewUser || false;
        setIsNewUser(_isNewUser);
      } else if (!_userData || _userData?.data?.token?.length <= 0) {
        await logOutHandler();
      } else {
        _token = _userData?.data.token || '';
        localStorage.setItem('authToken', _token);
        _authUserData.token = _token;
        dispatch(setUserAuth({ data: _authUserData }));
      }
    } else {
      console.log('Token found.');
      dispatch(setUserAuth({ data: _authUserData }));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fbAuth, async (user: FBUser | null) => {
      if (user) {
        if (user?.email) {
          // setCurrentFbUser(user);
          const _fbUserData: IFBAuth = {
            email: user.email,
            isEmailVerified: user.emailVerified,
            provider: user.providerData[0]?.providerId,
            accessToken: await user.getIdToken(),
            refreshToken: user.refreshToken
          };
          localStorage.setItem('fbToken', _fbUserData.accessToken || '');
          // dispatch(setFbAuth({ data: _fbUserData }));
          // await loginActionHandler(user);
        } else {
          console.log('Something went wrong while login with google');
        }
      } else {
        console.log('User logged out');
        // dispatch(resetAuth());
        // router.refresh();
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [dispatch, router]);

  useEffect(() => {
    toast.loading('Please wait...');
    setTimeout(() => {
      toast.dismiss();
    }, 1000);
  }, []);

  if (!fbEmail) {
    return <LoginSection />;
  } else {
    if (userEmail) {
      return <>{children}</>;
    } else if (isNewUser) {
      return (
        <>
          <div className={`${styles.container}`}>
            <h1 className='text-2xl font-semibold text-center mb-4'>Sign up for Tweeter Club</h1>
            <div className='flex flex-col space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Email</label>
              <input className='opacity-40' type='email' value={fbEmail} disabled={true} />
              <label className='block text-sm font-medium text-gray-700'>Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Please enter your name'
              />
              <label className='block text-sm font-medium text-gray-700'>Username</label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Please enter your username'
              />
              {/* //TODO:: check username available or not and also add profile picture id logic */}
              <button
                type='submit'
                onClick={async () => {
                  if (currentFbUser?.email) {
                    const _res = await createUserHandler(currentFbUser);
                    if (_res) {
                      if (_res?.error) {
                        toast.error(_res.message);
                      } else {
                        await loginActionHandler(currentFbUser);
                      }
                    }
                  }
                }}
              >
                Login
              </button>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h1>Redirecting....</h1>
        </>
      );
    }
  }
};

export default ProtectedPage;
