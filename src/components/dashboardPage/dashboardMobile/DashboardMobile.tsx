'use client';

import React, { useEffect, useState } from 'react';
import styles from './DashboardMobile.module.scss';
import { useRouter } from 'next/navigation';
import LogoutBtn from '@/components/LogoutBtn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';

interface DashboardMobileLayoutProps {
  children: React.ReactNode;
}

const DashboardMobileLayout: React.FC<DashboardMobileLayoutProps> = ({ children }) => {
  const userAuthInfoStore = useSelector((state: RootState) => state.user.userAuthInfo);
  const userIdStore = userAuthInfoStore?.userId;
  const router = useRouter();
  // const [theme, setTheme] = useState<any>(_isDarkThemeCache === 'false' ? lightTheme : darkTheme);
  const [isShowMobileSideNavBar, setIsShowMobileSideNavBar] = useState<boolean>(false);
  const _userSettings = useSelector((state: RootState) => state.user.userSettings);
  const _isDarkThemeStore = _userSettings.theme == 'dark';
  const dispatch = useDispatch();
  const [menuImgSrc, setMenuImgSrc] = useState<string>('/assets/images/menu-dark.png');

  // useEffect(() => {
  //   const _isDarkTheme = theme === darkTheme;
  //   // Set body class based on the current theme
  //   document.body.classList.toggle('dark-theme', _isDarkTheme);
  //   localStorage.setItem('isDarkTheme', _isDarkTheme?.toString());
  //   dispatch(setDeviceTheme({ isDarkTheme: _isDarkTheme }));
  // }, [theme]);

  useEffect(() => {
    if (_isDarkThemeStore) {
      setMenuImgSrc(`/assets/images/${isShowMobileSideNavBar ? 'close-dark' : 'menu-dark'}.png`);
    } else {
      setMenuImgSrc(`/assets/images/${isShowMobileSideNavBar ? 'close-light' : 'menu-light'}.png`);
    }
  }, [_isDarkThemeStore, isShowMobileSideNavBar]);

  const navBtnClassname = 'ml-6 font-semibold text-2xl cursor-pointer max-w-fit';
  //
  return (
    <>
      <div className={`${styles.container}`}>
        <div className={`${styles.topContainer} border-b-2`}>
          <div className='cursor-pointer px-4'>
            <Image
              onClick={() => {
                setIsShowMobileSideNavBar(!isShowMobileSideNavBar);
              }}
              src={menuImgSrc}
              alt='menu'
              width={28}
              height={28}
            />
          </div>
          <div className='font-bold text-2xl text-center py-1 w-[100%]'>Tweeter Club</div>
        </div>
        {/* <OutsideClickHandler
          onOutsideClick={() => {
            if (isShowMobileSideNavBar) {
              setIsShowMobileSideNavBar(false);
            }
          }}
        > */}
        <div
          className={`relative ${styles.sideNavContainer} ${isShowMobileSideNavBar ? styles.sideNavContainerActive : styles.sideNavContainerInactive}`}
        >
          <div className='mt-2 flex flex-col space-y-3'>
            <div
              className={navBtnClassname}
              onClick={() => {
                setIsShowMobileSideNavBar(false);
                router.push('/');
              }}
            >
              Home
            </div>
            {/* <div>Explore</div>*/}
            <div
              className={navBtnClassname}
              onClick={() => {
                setIsShowMobileSideNavBar(false);
                router.push('/bookmarks');
              }}
            >
              Bookmarks
            </div>
            <div
              className={navBtnClassname}
              onClick={() => {
                setIsShowMobileSideNavBar(false);
                const _username = userAuthInfoStore?.username;
                if (_username && _username?.length > 0) router.push(_username);
              }}
            >
              Profile
            </div>
            {/* <div>Notifications</div>
            <div>Messages</div> */}
            <div
              className={navBtnClassname}
              onClick={() => {
                setIsShowMobileSideNavBar(false);
                router.push('/settings');
              }}
            >
              Settings
            </div>
            <div
              className={navBtnClassname}
              onClick={() => {
                setIsShowMobileSideNavBar(false);
                router.push('/create');
              }}
            >
              Create
            </div>
          </div>
          {userIdStore && userIdStore?.length > 0 && (
            <div className='w-[100%] mb-4 absolute bottom-0'>
              <LogoutBtn setIsShowMobileSideNavBar={setIsShowMobileSideNavBar} />
            </div>
          )}
        </div>
        {/* </OutsideClickHandler> */}
        <div className={`${styles.bodyContainer} ${isShowMobileSideNavBar ? 'opacity-60' : ''}`}>{children}</div>
      </div>
    </>
  );
};

export default DashboardMobileLayout;
