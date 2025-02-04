'use client';

import React, { useState } from 'react';
import styles from './LogoutBtn.module.scss';
import { LOGOUT, UPDATE_SETTINGS } from '@/graphql/mutations';
import { logOutHandler } from '@/lib/firebase/auth';
import { RootState } from '@/redux/store';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import OutsideClickHandler from 'react-outside-click-handler';
import { IResponseData } from '@/interfaces';
import { updateUserSettingsState } from '@/redux/slices/userSlice';

interface LogoutBtnProps {
  setIsShowMobileSideNavBar?: (value: boolean) => void;
}

const LogoutBtn: React.FC<LogoutBtnProps> = ({ setIsShowMobileSideNavBar = () => {} }) => {
  const userAuthInfoStore = useSelector((state: RootState) => state.user.userAuthInfo);
  const router = useRouter();
  const [isShowPopup, setIsShowPopup] = useState<boolean>(false);
  const theme = useSelector((state: RootState) => state.user.userSettings.theme);
  const _isDarkThemeStore = theme == 'dark';
  const dispatch = useDispatch();

  const [logoutMutation] = useMutation(LOGOUT);

  const logoutUser = async () => {
    const _userId = userAuthInfoStore?.userId;
    if (_userId && _userId?.length >= 5) {
      const _userId = userAuthInfoStore?.userId;
      try {
        //logout-api
        await logoutMutation({
          variables: {
            userId: _userId
          }
        });
      } catch (e) {
        //not required
      }
    }
  };
  //
  const [updateUserSettingsMutation] = useMutation(UPDATE_SETTINGS);

  const updateUserSettings = async (inputData: any) => {
    try {
      toast.loading('Please wait...');
      const response = await updateUserSettingsMutation({
        variables: {
          ...inputData
        }
      });
      toast.dismiss();
      const result = response.data.updateSettings as IResponseData;
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        const { theme } = inputData;
        if (theme && theme.length > 0) {
          dispatch(updateUserSettingsState({ theme }));
        }
      }
    } catch (e) {
      console.log('updateUserSettingsError', e);
    }
  };

  return (
    <>
      <div className='relative flex flex-col justify-start items-start space-y-2'>
        <div className='w-[100%] pl-6 pr-2 flex flex-row justify-between items-center space-x-2'>
          <div
            className='w-[85%] flex flex-row justify-start items-center space-x-2 space-y-2 cursor-pointer'
            onClick={() => {
              setIsShowMobileSideNavBar(false);
              const _username = userAuthInfoStore?.username;
              if (_username && _username?.length > 0) {
                router.push(_username);
              }
            }}
          >
            {userAuthInfoStore?.profilePictureMediaId && (
              <Image
                style={{ borderRadius: '50%' }}
                src={userAuthInfoStore?.profilePictureMediaId || ''}
                alt='image'
                width={60}
                height={60}
              />
            )}
            <div className='w-[72%] flex flex-col justify-center items-start'>
              <div className='w-[100%] overflow-hidden text-ellipsis'>{userAuthInfoStore?.name}</div>
              <div className='w-[100%] overflow-hidden text-ellipsis font-semibold'>@{userAuthInfoStore?.username}</div>
            </div>
          </div>
          <div className='w-[15%]'>
            <OutsideClickHandler
              onOutsideClick={() => {
                if (isShowPopup) {
                  setIsShowPopup(false);
                }
              }}
            >
              <Image
                onClick={() => {
                  setIsShowPopup(true);
                }}
                className='cursor-pointer'
                src={`/assets/images/more-options-${_isDarkThemeStore ? 'dark' : 'light'}.png`}
                alt='image'
                width={36}
                height={36}
              />
            </OutsideClickHandler>
          </div>
        </div>
        <div
          className={`${styles.popupContainer} ${isShowPopup ? 'visible' : 'hidden'} absolute bottom-0 left-0 flex flex-col space-y-3 w-[100%]`}
        >
          <div className='w-[100%] flex flex-row justify-end pr-6'>
            <Image
              className='cursor-pointer'
              src={`/assets/images/${_isDarkThemeStore ? 'close-dark' : 'close-light'}.png`}
              alt='image'
              width={20}
              height={20}
            />
          </div>
          <div className='px-6 w-[100%]'>
            <button
              className='w-[100%] text-2xl px-6 py-1 bg-red-600 rounded-lg'
              onClick={async () => {
                toast.loading('please wait...');
                await logoutUser();
                await logOutHandler();
                setIsShowMobileSideNavBar(false);
                toast.dismiss();
                toast.success('loggedout successfully');
                router.refresh();
              }}
            >
              Logout
            </button>
          </div>
          <div className='px-6 w-[100%] flex flex-row justify-center items-center space-x-6 py-1'>
            {_isDarkThemeStore ? (
              <div className={`cursor-pointer ${!_isDarkThemeStore ? 'rounded-full border-4 border-sky-500 p-2' : ''}`}>
                <Image
                  onClick={async () => {
                    await updateUserSettings({ theme: 'light' });
                  }}
                  src={'/assets/images/light-theme.png'}
                  alt='menu'
                  width={45}
                  height={45}
                />
              </div>
            ) : (
              <div className={`cursor-pointer ${_isDarkThemeStore ? 'rounded-full border-4 border-sky-500 p-2' : ''}`}>
                <Image
                  onClick={async () => {
                    await updateUserSettings({ theme: 'dark' });
                  }}
                  src={'/assets/images/dark-theme.png'}
                  alt='menu'
                  width={45}
                  height={45}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutBtn;
