'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './UserScreen.module.scss';
import { useQuery } from '@apollo/client';
import { GET_USER_INFO_BY_USERNAME } from '@/graphql/queries';
import { userManageClient } from '@/lib/apollo-client';
import { IUserInfo } from '@/interfaces';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';

const UserScreen: React.FC = () => {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const router = useRouter();
  const params = useParams();
  const usernameParam = params.username;
  const username = useMemo(() => usernameParam, [usernameParam]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSameUser, setIsSameUser] = useState<boolean>(false);
  const userAuthInfoStore = useSelector((state: RootState) => state.user.userAuthInfo);

  const { refetch: userInfoByUsernameRefetch } = useQuery(GET_USER_INFO_BY_USERNAME, {
    skip: true,
    client: userManageClient
  });

  const getUserData = async (_username: string) => {
    setIsLoading(true);
    try {
      const result: any = await userInfoByUsernameRefetch({
        username: _username
      });
      const _data: any = result?.data?.getUserInfoByUsername?.data;
      if (_data) {
        const _userInfo = _data as IUserInfo;
        console.log({ _userInfo });

        if (_userInfo?.userId) {
          setUserInfo(_userInfo);
          console.log({ userAuthInfoStore, _userInfo });

          if (userAuthInfoStore && userAuthInfoStore?.userId === _userInfo?.userId) {
            setIsSameUser(true);
          }
        }
      } else {
        setUserInfo(null);
        console.log(`Error:: No data found for user:: ${_username}`);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log('Fetch User Data Error::', err);
    }
  };

  useEffect(() => {
    const _username = username as string;
    if (_username && _username?.length > 0 && userAuthInfoStore) {
      getUserData(_username);
    }
  }, [username, userAuthInfoStore]);

  return (
    <>
      {userInfo && userInfo?.userId?.length > 0 ? (
        <>
          <div className='w-[100%] flex flex-col justify-start items-start space-y-2 m-2'>
            <div className='w-[100%] flex flex-row justify-between items-center space-x-2 space-y-2'>
              <div className='max-w-[250px] flex flex-row justify-start items-center space-x-2 space-y-2'>
                <div className='w-[60px]'>
                  {userInfo?.profilePictureMediaId && (
                    <Image
                      style={{ borderRadius: '50%' }}
                      src={userInfo?.profilePictureMediaId || ''}
                      alt='image'
                      width={60}
                      height={60}
                    />
                  )}
                </div>
                <div className='max-w-[190px] flex flex-col justify-center items-start'>
                  <div className='w-[100%] overflow-hidden text-ellipsis'>{userInfo?.name}</div>
                  <div className='w-[100%] overflow-hidden text-ellipsis font-semibold'>@{userInfo?.username}</div>
                </div>
              </div>
              <div className={`pr-4`}>
                <div
                  onClick={() => {
                    if (isSameUser) {
                      //update
                      router.push('update-profile');
                      toast.success('update');
                    } else {
                      //follow
                      toast.success('follow');
                    }
                  }}
                  className={`${styles.followBtn} px-4 py-1 rounded-lg cursor-pointer`}
                >
                  {isSameUser ? 'Update' : 'Follow'}
                </div>
              </div>
            </div>
            <div>{userInfo?.bio}</div>
          </div>
        </>
      ) : (
        <div>User not found</div>
      )}
    </>
  );
};

export default UserScreen;
