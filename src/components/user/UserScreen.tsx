'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './UserScreen.module.scss';
import { useQuery } from '@apollo/client';
import { GET_BASIC_USER_INFO_BY_USERNAME } from '@/graphql/queries';
import { userManageClient } from '@/lib/apollo-client';
import { IBasicUserInfo } from '@/interfaces';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const UserScreen: React.FC = () => {
  const [basicUserInfo, setBasicUserInfo] = useState<IBasicUserInfo | null>(null);
  // const searchParams = useSearchParams();
  const params = useParams();
  const usernameParam = params.username;
  const username = useMemo(() => usernameParam, [usernameParam]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { refetch: basicUserRefetch } = useQuery(GET_BASIC_USER_INFO_BY_USERNAME, {
    skip: true,
    client: userManageClient
    // onCompleted: (data) => {
    //   console.log('Query completed:', data);
    // }
  });

  const getUserData = async () => {
    if (!username || username.length <= 0) {
      return;
    }
    setIsLoading(true);
    try {
      const result: any = await basicUserRefetch({
        username
      });
      const _data: any = result?.data?.getBasicUserInfoByUsername?.data;
      if (_data) {
        const basicUserInfo = _data as IBasicUserInfo;
        console.log({ basicUserInfo });

        if (basicUserInfo?.userId) {
          setBasicUserInfo(basicUserInfo);
        }
      } else {
        setBasicUserInfo(null);
        console.log(`Error:: No data found for user:: ${username}`);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log('Fetch User Data Error::', err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <div>UserScreen</div>
      {basicUserInfo && basicUserInfo?.userId?.length > 0 ? (
        <div>
          <h1>Basic User Info</h1>
          <p>{basicUserInfo?.firstname}</p>
          <p>{basicUserInfo?.lastname}</p>
          <p>{basicUserInfo?.email}</p>
          <p>{basicUserInfo?.username}</p>
          {basicUserInfo?.profilePictureMediaId && (
            <Image src={basicUserInfo?.profilePictureMediaId || ''} alt='profile' width={100} height={100} />
          )}
        </div>
      ) : (
        <div>User not found</div>
      )}
    </>
  );
};

export default UserScreen;
