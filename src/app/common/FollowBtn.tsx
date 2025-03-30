'use client';

import { useState, useEffect } from 'react';
import { IResponseData } from '@/interfaces';
import { useMutation, useQuery } from '@apollo/client';
import { CHECK_USER_FOLLOW_STATUS } from '@/graphql/queries';
import { userManageClient } from '@/lib/apollo-client';
import toast from 'react-hot-toast';
import { FOLLOW_USER, UNFOLLOW_USER } from '@/graphql/mutations';
import ConfirmDialog from './dialogs/ConfirmDialog';

interface IFollowBtnProps {
  followeeUserId: string;
  followeeName: string;
}

const FollowBtn: React.FC<IFollowBtnProps> = ({ followeeUserId, followeeName }) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isActionSpinnerVisible, setIsActionSpinnerVisible] = useState(false);

  const { data, error } = useQuery(CHECK_USER_FOLLOW_STATUS, {
    client: userManageClient,
    skip: !followeeUserId || followeeUserId?.length == 0,
    variables: {
      followeeUserId
    }
  });

  useEffect(() => {
    if (data && data?.checkUserFollowStatus) {
      const result: IResponseData = data.checkUserFollowStatus;
      if (!result?.error) {
        const _userData = result.data;
        setIsFollowed(_userData.isFollowed);
      }
    }
    if (error) {
      console.log(error);
    }
  }, [data, error]);

  const [followUser] = useMutation(FOLLOW_USER, { client: userManageClient });

  const followUserBtnHandler = async (followeeUserId: string) => {
    toast.loading('please wait...');

    if (!followeeUserId) {
      return;
    }

    try {
      const response = await followUser({
        variables: {
          followeeUserId
        }
      });

      const result: IResponseData = response.data?.followUser;
      toast.dismiss();
      if (!result.error) {
        setIsFollowed(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error('something went wrong');
    }
  };

  const [unFollowUser] = useMutation(UNFOLLOW_USER, { client: userManageClient });

  const unFollowUserBtnHandler = async (followeeUserId: string) => {
    toast.loading('please wait...');

    if (!followeeUserId) {
      setIsActionSpinnerVisible(false);
      setIsConfirmDialogVisible(false);
      return;
    }

    try {
      const response = await unFollowUser({
        variables: {
          followeeUserId
        }
      });

      const result: IResponseData = response.data?.unFollowUser;
      toast.dismiss();
      if (!result.error) {
        setIsFollowed(false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setIsActionSpinnerVisible(false);
      setIsConfirmDialogVisible(false);
    } catch (err) {
      console.log(err);
      setIsActionSpinnerVisible(false);
      setIsConfirmDialogVisible(false);
      toast.dismiss();
      toast.error('something went wrong');
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (isFollowed) {
            setIsConfirmDialogVisible(true);
          } else {
            followUserBtnHandler(followeeUserId);
          }
        }}
        className={`bg-gray-100 text-black ${isFollowed ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} px-3 py-1 rounded-2xl`}
      >
        {isFollowed ? 'Following' : 'Follow'}
      </button>
      <ConfirmDialog
        isDialogVisible={isConfirmDialogVisible}
        setIsDialogVisible={setIsConfirmDialogVisible}
        isActionSpinnerVisible={isActionSpinnerVisible}
        description={`Are you sure you want to unfollow ${followeeName}?`}
        descriptionClassName='text-gray-500 text-lg font-semibold'
        primaryBtnText={'No'}
        primaryBtnClassName={
          'px-3 py-2 text-lg font-semibold tracking-wide text-white bg-gray-400 rounded-lg hover:bg-gray-700'
        }
        primaryBtnOnClickHandler={() => setIsConfirmDialogVisible(false)}
        secondaryBtnText={'Yes'}
        secondaryBtnClassName={`px-3 py-2 text-lg font-semibold tracking-wide text-white bg-red-400 rounded-lg hover:bg-red-500`}
        secondaryBtnOnClickHandler={async () => {
          setIsActionSpinnerVisible(true);
          await unFollowUserBtnHandler(followeeUserId);
        }}
      />
    </>
  );
};

export default FollowBtn;
