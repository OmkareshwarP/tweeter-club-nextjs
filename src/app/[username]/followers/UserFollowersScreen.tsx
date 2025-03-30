'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { IResponseData, IUserInfo } from '@/interfaces';
import { GET_FOLLOWERS_LIST_BY_USER_ID, GET_USER_INFO_BY_USERNAME } from '@/graphql/queries';
import { userManageClient } from '@/lib/apollo-client';
import toast from 'react-hot-toast';
import FollowBtn from '@/app/common/FollowBtn';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Avatar from 'react-avatar';
import RecommendedUsersSection from '@/app/common/RecommendedUsersSection';
import { ArrowLeft } from 'lucide-react';
import { CustomLoader, Footer } from '@/app/common';
import { CustomLoaderColors, CustomLoaderTypes } from '@/lib/constants';

interface Follower {
  userId: string;
  username: string;
  name: string;
  profilePictureMediaId: string;
  createdAt: number;
}

const FollowersListScreen: React.FC = () => {
  const { authUserInfo } = useSelector((state: RootState) => state.auth);
  const { username } = useParams() as { username: string };
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [lastCreatedAt, setLastCreatedAt] = useState<number>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();
  const pageSize = 10;

  const {
    data: userInfoData,
    loading: userInfoLoading,
    error: userInfoError
  } = useQuery(GET_USER_INFO_BY_USERNAME, {
    client: userManageClient,
    skip: !username,
    variables: { username }
  });

  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
    refetch: followersRefetch
  } = useQuery(GET_FOLLOWERS_LIST_BY_USER_ID, {
    skip: !userInfo?.userId,
    variables: {
      userId: userInfo?.userId,
      lastCreatedAt: null
    },
    fetchPolicy: 'network-only',
    client: userManageClient
  });

  useEffect(() => {
    if (userInfoData?.getUserInfoByUsername) {
      const response: IResponseData = userInfoData.getUserInfoByUsername;
      if (!response.error) {
        setUserInfo(response.data);
      }
    }
    if (userInfoError) {
      toast.error('Something went wrong.');
    }
  }, [userInfoData, userInfoError]);

  useEffect(() => {
    if (followersData?.getFollowersListByUserId) {
      const response: IResponseData = followersData.getFollowersListByUserId;
      if (!response.error) {
        const newFollowers = response.data;
        setFollowers((prev) => [...prev, ...newFollowers]);
        setFollowers((prev) => {
          const uniqueFollowersMap = new Map<string, Follower>();
          [...prev, ...newFollowers].forEach((follower) => {
            uniqueFollowersMap.set(follower.userId, follower);
          });
          return Array.from(uniqueFollowersMap.values());
        });
        setHasMore(newFollowers.length === pageSize);
        setLastCreatedAt(newFollowers[newFollowers.length - 1]?.createdAt || null);
      } else {
        toast.error(response.message);
      }
    }
    if (followersError) {
      toast.error('Failed to fetch followers');
    }
  }, [followersData, followersError]);

  if (!userInfo || userInfoLoading) {
    return (
      <div className='h-[100%] flex flex-row justify-start items-start'>
        <div className='h-[100%] w-full max-w-2xl p-2 px-4 overflow-y-scroll'>
          <div className='sticky -top-4 z-10 flex flex-col justify-start items-start bg-gray-950'>
            <div className='flex flex-row justify-start items-center space-x-4 py-4'>
              <ArrowLeft size={32} className='cursor-pointer' onClick={() => router.back()} />
              <div className='font-semibold text-2xl'>@{username}</div>
            </div>
            {userInfoLoading ? (
              <div className='flex flex-row justify-center'>Please wait...</div>
            ) : (
              <div>User with {`@${username}`} username does not exists.</div>
            )}
          </div>
        </div>
        <div className='min-h-screen w-[1px] bg-white' />
        <div className='h-[100%] w-[400px] py-5'>
          <div className='h-[100%] w-[100%] overflow-y-scroll'>
            <RecommendedUsersSection sectionId='suggestedUsers' pageSize={5} />
            <Footer />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-[100%] flex flex-row justify-start items-start'>
      <div className='h-[100%] w-full max-w-2xl p-2 px-4 overflow-y-scroll'>
        <div className='sticky -top-4 z-10 flex flex-col justify-start items-start bg-gray-950'>
          <div className='flex flex-row justify-start items-center space-x-4 py-4'>
            <ArrowLeft size={32} className='cursor-pointer' onClick={() => router.back()} />
            <div className=''>
              <div className='font-semibold text-2xl'>{userInfo.name}</div>
              <div className='text-sm text-gray-500'>@{userInfo.username}</div>
            </div>
          </div>
          <div className='w-[100%] flex flex-row justify-between items-center'>
            <div className='w-[50%] text-center pb-2 border-b-4 border-blue-500 cursor-default'>Followers</div>
            <div
              className='w-[50%] text-center pb-2 border-b border-gray-200 cursor-pointer'
              onClick={() => {
                router.push('/' + username + '/following');
              }}
            >
              Following
            </div>
          </div>
        </div>
        {followersLoading ? (
          <CustomLoader
            isTextVisible={false}
            type={CustomLoaderTypes.THREE_DOTS}
            color={CustomLoaderColors.SECONDARY}
          />
        ) : followers.length == 0 ? (
          <div className='text-center text-gray-500 py-2'>No Data</div>
        ) : (
          <>
            {followers.map((follower) => (
              <div key={follower.userId} className='flex items-center gap-4 p-4'>
                <Avatar
                  name={follower.name || follower.username}
                  src={follower.profilePictureMediaId}
                  size='50'
                  round={true}
                  className='cursor-pointer'
                  onClick={() => router.push('/' + follower.username)}
                />
                <div className='flex-1'>
                  <h3 className='font-bold'>{follower.name}</h3>
                  <p className='text-sm text-gray-500'>@{follower.username}</p>
                </div>
                {authUserInfo?.userId !== follower.userId && (
                  <FollowBtn followeeUserId={follower.userId} followeeName={follower.name} />
                )}
              </div>
            ))}
            {hasMore && lastCreatedAt ? (
              <button
                className='w-full py-2 text-center text-blue-500'
                onClick={() => {
                  if (lastCreatedAt) {
                    followersRefetch({
                      userId: userInfo.userId,
                      lastCreatedAt: lastCreatedAt.toString()
                    });
                  }
                }}
              >
                Load More
              </button>
            ) : (
              <div className='text-center text-gray-500 py-2'>You’ve reached the end!</div>
            )}
          </>
        )}
      </div>
      <div className='min-h-screen w-[1px] bg-white' />
      <div className='h-[100%] w-[400px] py-5'>
        <div className='h-[100%] w-[100%] overflow-y-scroll'>
          <RecommendedUsersSection sectionId='suggestedUsers' pageSize={5} />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default FollowersListScreen;
