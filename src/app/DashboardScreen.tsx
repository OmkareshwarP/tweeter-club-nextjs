'use client';

import React from 'react';
import { SignInBtn } from './common';
import { Home, Bell, Mail, Hash, User, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  text,
  onClickHandler
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  isActive: boolean;
  label: string;
  text?: string;
  onClickHandler: () => void;
}) => (
  <div
    className={`flex items-center gap-3 p-3 hover:bg-gray-100 hover:text-black ${isActive && 'bg-gray-100 text-black'} rounded-2xl cursor-pointer`}
    onClick={onClickHandler}
  >
    <Icon className='w-6 h-6' />
    <span className='hidden laptop:block'>
      <p className={label === 'Developed By' ? 'text-gray-500 hover:text-gray-600' : ''}>{label}</p>
      <p>{text}</p>
    </span>
  </div>
);

interface IDashboardScreenProps {
  children: React.ReactNode;
}

const DashboardScreen: React.FC<IDashboardScreenProps> = ({ children }) => {
  const { authUserInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className='w-[100%] h-[100%] bg-gray-950 flex'>
      <aside className='w-[90px] laptop:w-[225px] p-5 border-r laptop:flex flex-col gap-5'>
        <SidebarItem
          icon={Home}
          label='Home'
          isActive={pathname == '/home' || pathname == '/'}
          onClickHandler={() => router.push('/')}
        />
        <SidebarItem
          icon={Hash}
          label='Explore'
          isActive={pathname == '/explore'}
          onClickHandler={() => router.push('/explore')}
        />
        <SidebarItem
          icon={Bell}
          label='Notifications'
          isActive={pathname == '/notifications'}
          onClickHandler={() => router.push('/notifications')}
        />
        <SidebarItem
          icon={Mail}
          label='Messages'
          isActive={pathname == '/messages'}
          onClickHandler={() => router.push('/messages')}
        />
        <SidebarItem
          icon={User}
          label='Profile'
          isActive={pathname == '/' + authUserInfo?.username}
          onClickHandler={() => router.push('/' + authUserInfo?.username)}
        />
        <SidebarItem
          icon={Settings}
          label='Settings'
          isActive={pathname == '/settings'}
          onClickHandler={() => router.push('/settings')}
        />
        <SignInBtn />
        {/* <SidebarItem
          icon={Github}
          label='Developed By'
          text={'OmkareshwarP'}
          isActive={false}
          onClickHandler={() => window.open('https://github.com/OmkareshwarP', '_blank')}
        /> */}
      </aside>
      <main className='h-[100%] flex-1'>{children}</main>
    </div>
  );
};

export default DashboardScreen;
