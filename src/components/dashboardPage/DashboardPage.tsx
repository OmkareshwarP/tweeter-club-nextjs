'use client';

import React, { useEffect, useState } from 'react';
import styles from './DashboardPage.module.scss';
import { useRouter } from 'next/navigation';
import DashboardMobileLayout from './dashboardMobile/DashboardMobile';
import DashboardLaptopLayout from './dashboardLaptop/DashboardLaptop';
import { useDispatch, useSelector } from 'react-redux';
import { setDeviceSize } from '@/redux/slices/deviceSlice';
import { GET_USER_AUTH_INFO, GET_USER_SETTINGS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { userManageClient } from '@/lib/apollo-client';
import { RootState } from '@/redux/store';
import { IUserAuthInfo, IUserSettings } from '@/interfaces';
import { logOutHandler } from '@/lib/firebase/auth';
import { setUserAuthInfo, updateUserSettingsState } from '@/redux/slices/userSlice';

interface DashboardPageProps {
  children: React.ReactNode;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ children }) => {
  const router = useRouter();
  const userAuthStore = useSelector((state: RootState) => state.auth.userAuth);
  const dispatch = useDispatch();
  const fbUserEmail = userAuthStore?.email;
  //
  const { data, error, loading } = useQuery(GET_USER_AUTH_INFO, {
    client: userManageClient,
    skip: !fbUserEmail || fbUserEmail.length <= 0
  });

  useEffect(() => {
    if (data && data?.getUserAuthInfo && data.getUserAuthInfo?.data?.userId) {
      console.log({ dataLo: data.getUserAuthInfo.data });
      const _userInfo = data.getUserAuthInfo.data as IUserAuthInfo;
      if (_userInfo?.email !== fbUserEmail) {
        logOutHandler();
        return;
      }
      dispatch(setUserAuthInfo({ data: _userInfo }));
    }
  }, [data, error, loading]);

  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1080px)'); // Adjust as needed

    const handleResize = () => {
      const _isLaptop = mediaQuery.matches;
      setIsLaptop(_isLaptop);
      dispatch(setDeviceSize({ isLaptop: _isLaptop }));
    };
    handleResize(); // Initialize on mount

    mediaQuery.addEventListener('change', handleResize);
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);
  //
  const { refetch: userSettingsRefetch } = useQuery(GET_USER_SETTINGS, {
    fetchPolicy: 'network-only',
    skip: true,
    client: userManageClient
  });

  const userAuthInfoStore = useSelector((state: RootState) => state.user.userAuthInfo);
  const userSettingsStore = useSelector((state: RootState) => state.user.userSettings);

  const fetchSettings = async (_userId: string) => {
    try {
      const result: any = await userSettingsRefetch({
        userId: _userId
      });
      const _data: any = result?.data?.getUserSettings?.data;
      if (_data) {
        const _userSettings = _data as IUserSettings;
        dispatch(updateUserSettingsState({ theme: _userSettings.theme }));
      }
    } catch (err) {
      console.log('Fetch User settings Error::', err);
    }
  };

  useEffect(() => {
    if (userAuthInfoStore?.userId && userAuthInfoStore?.userId?.length > 0) {
      fetchSettings(userAuthInfoStore?.userId);
    }
  }, [userAuthInfoStore?.userId]);

  useEffect(() => {
    if (userSettingsStore.theme) {
      const isDarkTheme = userSettingsStore.theme == 'dark';
      document.body.classList.toggle('dark-theme', isDarkTheme);
    }
  }, [userSettingsStore.theme]);
  //
  return (
    <>
      <div className={`${styles.container}`}>
        {isLaptop ? (
          <div className={`${styles.laptopContainer}`}>
            <DashboardLaptopLayout>{children}</DashboardLaptopLayout>
          </div>
        ) : (
          <div className={`${styles.mobileContainer}`}>
            <DashboardMobileLayout>{children}</DashboardMobileLayout>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
