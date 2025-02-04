'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './UpdateProfileScreen.module.scss';
import { useMutation } from '@apollo/client';
import { IResponseData } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { UPDATE_USERNAME } from '@/graphql/mutations';
import { updateUserInfoState } from '@/redux/slices/userSlice';

const UpdateUsernameScreen: React.FC = () => {
  const userAuthInfoStore = useSelector((state: RootState) => state.user.userAuthInfo);
  const [username, setUsername] = useState<string>('');
  const router = useRouter();
  const dispatch = useDispatch();
  //
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name == 'username') {
      setUsername(value);
    }
    // setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [updateUsernameMutation] = useMutation(UPDATE_USERNAME);

  const updateUsername = async () => {
    try {
      toast.loading('Please wait...');
      const response = await updateUsernameMutation({
        variables: {
          userId: userAuthInfoStore?.userId,
          username
        }
      });
      toast.dismiss();
      const result = response.data.updateUsername as IResponseData;
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        if (username && username.length > 0) {
          dispatch(updateUserInfoState({ username }));
        }
        router.back();
      }
    } catch (e) {
      console.log('updateUsernameError', e);
    }
  };

  useEffect(() => {
    if (userAuthInfoStore?.username && userAuthInfoStore?.username?.length > 0) {
      setUsername(userAuthInfoStore?.username);
    }
  }, [userAuthInfoStore?.username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    const validUsername = inputValue.replace(/[^a-zA-Z0-9_]/g, ''); // Allows only letters, numbers, and underscores
    if (validUsername.length > 0) {
      setUsername(validUsername);
    } else {
      setUsername('');
    }
  };

  return (
    <>
      <div className='w-[100%] flex flex-col justify-start items-start space-y-2 m-2'>
        <div className='w-[80%] text-black'>
          <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
            Username
          </label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={handleUsernameChange}
            placeholder='Enter your username'
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          />
          <p className='text-sm text-gray-500 mt-1'>Only letters, numbers, and underscores (_) are allowed.</p>
        </div>
        {userAuthInfoStore?.username !== username && username?.length > 0 && (
          <div className='w-[100%] flex flex-row justify-center items-center space-x-4'>
            <div
              onClick={() => {
                updateUsername();
              }}
              className={`${styles.followBtn} px-4 py-1 rounded-lg cursor-pointer`}
            >
              Update
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateUsernameScreen;
