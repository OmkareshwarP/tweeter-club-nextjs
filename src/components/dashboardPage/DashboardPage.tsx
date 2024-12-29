'use client';

import React, { useEffect, useState } from 'react';
import styles from './DashboardPage.module.scss';
import { darkTheme, lightTheme } from '@/styles/themes';
import { useRouter } from 'next/navigation';
import DashboardMobileLayout from './dashboardMobile/DashboardMobile';
import DashboardLaptopLayout from './dashboardLaptop/DashboardLaptop';
import { useDispatch, useSelector } from 'react-redux';
import { setDeviceInfo } from '@/redux/slices/deviceSlice';
import { GET_BASIC_USER_INFO } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { userManageClient } from '@/lib/apollo-client';
import { RootState } from '@/redux/store';
import { IBasicUserInfo } from '@/interfaces';
import { logOutHandler } from '@/lib/firebase/auth';
import { setBasicUserInfo } from '@/redux/slices/userSlice';

interface DashboardPageProps {
  children: React.ReactNode;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ children }) => {
  const router = useRouter();
  const [theme, setTheme] = useState<any>(lightTheme);
  const userAuthStore = useSelector((state: RootState) => state.auth.userAuth);
  const dispatch = useDispatch();
  const userEmail = userAuthStore?.email;
  //
  const { data, error, loading } = useQuery(GET_BASIC_USER_INFO, {
    client: userManageClient,
    skip: !userEmail || userEmail.length <= 0
  });

  useEffect(() => {
    if (data && data?.getBasicUserInfo && data.getBasicUserInfo?.data?.userId) {
      console.log({ dataLo: data.getBasicUserInfo.data });
      const basicUserInfo = data.getBasicUserInfo.data as IBasicUserInfo;
      if (basicUserInfo?.email !== userEmail) {
        logOutHandler();
        return;
      }
      dispatch(setBasicUserInfo({ data: basicUserInfo }));
    }
  }, [data, error, loading]);

  useEffect(() => {
    // Set body class based on the current theme
    document.body.classList.toggle('dark-theme', theme === darkTheme);
  }, [theme]);

  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1080px)'); // Adjust as needed

    const handleResize = () => {
      const _isLaptop = mediaQuery.matches;
      setIsLaptop(_isLaptop);
      dispatch(setDeviceInfo({ data: { isLaptop: _isLaptop } }));
    };
    handleResize(); // Initialize on mount

    mediaQuery.addEventListener('change', handleResize);
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);
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
