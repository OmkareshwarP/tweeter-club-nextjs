'use client';

import React, { useEffect, useState } from 'react';
import styles from './SettingsScreen.module.scss';
import { useMutation, useQuery } from '@apollo/client';
import { userManageClient } from '@/lib/apollo-client';
import { IResponseData, IUserSettings } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { GET_USER_SETTINGS } from '@/graphql/queries';
import { UPDATE_SETTINGS } from '@/graphql/mutations';
import { updateUserSettingsState } from '@/redux/slices/userSlice';

const SettingsScreen: React.FC = () => {
  const [defaultSettingsData, setDefaultSettingsData] = useState<IUserSettings | null>(null);
  const [settingsData, setSettingsData] = useState<IUserSettings | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const userAuthInfoStore = useSelector((state: RootState) => state.user.userAuthInfo);
  const userSettingsStore = useSelector((state: RootState) => state.user.userSettings);
  const _isDarkThemeStore = userSettingsStore.theme == 'dark';

  const { error, data, loading } = useQuery(GET_USER_SETTINGS, {
    fetchPolicy: 'network-only',
    skip: !userAuthInfoStore?.userId || !userSettingsStore,
    client: userManageClient
  });

  useEffect(() => {
    if (loading) {
      toast.loading('Please wait....');
    }
    if (error) {
      toast.dismiss();
      console.log('something went wrong.');
    }
    if (data) {
      toast.dismiss();
      const _data: any = data?.getUserSettings?.data;
      if (_data) {
        const _userSettings = _data as IUserSettings;
        console.log({ _userSettings });
        setSettingsData(_userSettings);
      } else {
        setSettingsData(null);
        console.log(`Error:: No data found for user`);
      }
    }
  }, [error, data, loading]);
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
      <div className='w-[100%] flex flex-col justify-start items-start space-y-2 m-2'>
        <div className='w-[100%] flex flex-row justify-between pl-2 pr-6'>
          <div>Enable dark theme</div>
          <button
            onClick={() => {
              const theme = userSettingsStore.theme;
              const _uTheme = theme == 'dark' ? 'light' : 'dark';
              updateUserSettings({ theme: _uTheme });
            }}
            className={`w-16 h-8 rounded-full border-2 border-gray-500 p-1 
        ${_isDarkThemeStore ? 'bg-gray-800' : 'bg-gray-200'}`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform 
          transition-transform duration-300 ease-in-out
          ${_isDarkThemeStore ? 'translate-x-8' : 'translate-x-0'}`}
            ></div>
          </button>
        </div>
        <div className='w-[100%] flex flex-row justify-between pl-2 pr-6'>
          <div className='w-[100%] flex flex-col justify-center items-start pl-2 pr-6'>
            <div>Username</div>
            <div>{userAuthInfoStore?.username}</div>
          </div>

          <button
            onClick={() => {
              router.push('/update-username');
            }}
            className={`${styles.followBtn} px-4 py-1 rounded-lg cursor-pointer`}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsScreen;
