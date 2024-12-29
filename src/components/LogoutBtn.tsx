'use client';

import React from 'react';
import { LOGOUT } from '@/graphql/mutations';
import { logOutHandler } from '@/lib/firebase/auth';
import { RootState } from '@/redux/store';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

interface LogoutBtnProps {
  setIsShowMobileSideNavBar?: (value: boolean) => void;
}
const LogoutBtn: React.FC<LogoutBtnProps> = ({ setIsShowMobileSideNavBar = () => {} }) => {
  const basicUserInfoStore = useSelector((state: RootState) => state.user.basicUserInfo);
  const router = useRouter();

  const [logoutMutation] = useMutation(LOGOUT);

  const logoutUser = async () => {
    const _userId = basicUserInfoStore?.userId;
    if (_userId && _userId?.length >= 5) {
      const _userId = basicUserInfoStore?.userId;
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

  return (
    <>
      <div className='flex flex-col justify-start items-center bg-red-500'>
        <div
          className='flex flex-row justify-between items-center'
          onClick={() => {
            setIsShowMobileSideNavBar(false);
            const _username = basicUserInfoStore?.username;
            if (_username && _username?.length > 0) {
              router.push(_username);
            }
          }}
        >
          {basicUserInfoStore?.profilePictureMediaId && (
            <Image src={basicUserInfoStore?.profilePictureMediaId || ''} alt='profile' width={100} height={100} />
          )}
          <div className='flex flex-col justify-between items-center'>
            <div>{basicUserInfoStore?.firstname + ' ' + basicUserInfoStore?.lastname}</div>
            <p>@{basicUserInfoStore?.username}</p>
          </div>
        </div>
        <button
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
    </>
  );
};

export default LogoutBtn;
