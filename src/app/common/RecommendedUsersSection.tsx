'use client';

import { useState, useEffect } from 'react';
import { IResponseData } from '@/interfaces';
import { useQuery } from '@apollo/client';
import { GET_RECOMMENDED_USERS } from '@/graphql/queries';
import { userManageClient } from '@/lib/apollo-client';
import Avatar from 'react-avatar';
import FollowBtn from './FollowBtn';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';

interface IRecommendedUserData {
  userId: string;
  username: string;
  name: string;
  profilePictureMediaId: string;
}

interface IRecommendedUsersSectionProps {
  sectionId: string;
  pageSize: number;
}

const RecommendedUsersSection: React.FC<IRecommendedUsersSectionProps> = ({ sectionId, pageSize = 2 }) => {
  const { authUserInfo } = useSelector((state: RootState) => state.auth);
  const [usersData, setUsersData] = useState<IRecommendedUserData[]>([]);
  const [sectionTitle, setSectionTitle] = useState<string>('Suggested Users');
  const router = useRouter();

  const { data, error } = useQuery(GET_RECOMMENDED_USERS, {
    client: userManageClient,
    skip: !sectionId,
    variables: {
      sectionId,
      pageSize
    }
  });

  useEffect(() => {
    if (data && data?.getRecommendedUsers) {
      const result: IResponseData = data.getRecommendedUsers;
      if (!result?.error) {
        const _recommendedUsersData = result.data;
        setSectionTitle(_recommendedUsersData.sectionTitle);
        setUsersData(_recommendedUsersData.users || []);
      }
    }
    if (error) {
      console.log('GetRecommendedUsers Error::' + error?.message.toString());
    }
  }, [data, error]);

  return (
    <>
      {usersData && usersData?.length > 0 && (
        <div className='m-2 p-2 border rounded-2xl border-gray-500'>
          <div className='font-semibold text-xl'>{sectionTitle}</div>
          <div className='flex flex-col gap-4 mt-2'>
            {usersData.map((user, i) => {
              if (authUserInfo?.userId == user.userId) {
                return <></>;
              }
              return (
                <div key={i} className='flex flex-row justify-between items-center space-x-4'>
                  <div className='flex flex-row justify-start items-center space-x-2'>
                    <Avatar
                      name={user.name || user.username}
                      src={user.profilePictureMediaId}
                      size='40'
                      round={true}
                      className='cursor-pointer'
                      onClick={() => router.push('/' + user.username)}
                    />
                    <div className='flex flex-col'>
                      <h3 className='font-bold text-[15px] overflow-hidden whitespace-nowrap text-ellipsis max-w-full'>
                        {user.name?.slice(0, 20)}
                      </h3>
                      <p className='text-[15px] text-gray-500'>@{user.username}</p>
                    </div>
                  </div>
                  <FollowBtn followeeUserId={user.userId} followeeName={user.name} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendedUsersSection;
