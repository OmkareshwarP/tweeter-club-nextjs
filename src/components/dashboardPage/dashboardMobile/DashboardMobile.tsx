'use client';

import React, { useEffect, useState } from 'react';
import styles from './DashboardMobile.module.scss';
import { darkTheme, lightTheme } from '@/styles/themes';
import { useRouter } from 'next/navigation';
import LogoutBtn from '@/components/LogoutBtn';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface DashboardMobileLayoutProps {
  children: React.ReactNode;
}

const DashboardMobileLayout: React.FC<DashboardMobileLayoutProps> = ({ children }) => {
  const basicUserInfoStore = useSelector((state: RootState) => state.user.basicUserInfo);
  const userIdStore = basicUserInfoStore?.userId;
  const router = useRouter();
  const [theme, setTheme] = useState<any>(lightTheme);
  const [isShowMobileSideNavBar, setIsShowMobileSideNavBar] = useState<boolean>(false);

  useEffect(() => {
    // Set body class based on the current theme
    document.body.classList.toggle('dark-theme', theme === darkTheme);
  }, [theme]);
  // //
  return (
    <>
      <div className={`${styles.container}`}>
        vdfvfd
        <div className={`${styles.topContainer} border-b-2`}>
          <div
            className='font-semibold text-center py-1 w-[100px] cursor-pointer'
            onClick={() => {
              if (!isShowMobileSideNavBar) {
                setIsShowMobileSideNavBar(true);
              }
            }}
          >
            Menu
          </div>
          <div className='font-bold text-2xl text-center py-1 w-[100%]'>Tweeter Club</div>
        </div>
        <OutsideClickHandler
          onOutsideClick={() => {
            if (isShowMobileSideNavBar) {
              setIsShowMobileSideNavBar(false);
            }
          }}
        >
          <div
            className={`${styles.sideNavContainer} ${isShowMobileSideNavBar ? styles.sideNavContainerActive : styles.sideNavContainerInactive}`}
          >
            <div
              className='px-2 py-2 font-semibold text-2xl cursor-pointer'
              onClick={() => {
                setIsShowMobileSideNavBar(false);
                router.push('/');
              }}
            >
              Home
            </div>
            {/* <div>Explore</div>
            <div>Bookmarks</div> */}
            <div
              className='px-2 py-2 font-semibold text-2xl cursor-pointer'
              onClick={() => {
                setIsShowMobileSideNavBar(false);
                const _username = basicUserInfoStore?.username;
                if (_username && _username?.length > 0) router.push(_username);
              }}
            >
              Profile
            </div>
            {/* <div>Notifications</div>
            <div>Messages</div> */}
            {userIdStore && userIdStore?.length > 0 && (
              <LogoutBtn setIsShowMobileSideNavBar={setIsShowMobileSideNavBar} />
            )}
            <button onClick={() => setTheme(theme === lightTheme ? darkTheme : lightTheme)}>Toggle Theme</button>
          </div>
        </OutsideClickHandler>
        <div className={`${styles.bodyContainer} ${isShowMobileSideNavBar ? 'opacity-60' : ''}`}>{children}</div>
      </div>
    </>
  );
};

export default DashboardMobileLayout;
