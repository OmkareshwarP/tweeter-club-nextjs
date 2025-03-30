'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Edit, Globe, MapPin, User, X } from 'lucide-react';
import { IResponseData, IUserInfo } from '@/interfaces';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_INFO_BY_USERNAME } from '@/graphql/queries';
import { userManageClient } from '@/lib/apollo-client';
import toast from 'react-hot-toast';
import FollowBtn from '../common/FollowBtn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Avatar from 'react-avatar';
import Modal from 'react-modal';
import { CustomButtonLoader, Footer, ImageViewModal } from '../common';
import { UPDATE_USER } from '@/graphql/mutations';
import { setAuthUserInfoState } from '@/redux/slices/authSlice';
import { CustomLoaderColors } from '@/lib/constants';
import RecommendedUsersSection from '../common/RecommendedUsersSection';

interface IUpdatedUserInfo {
  name: string;
  profilePictureMediaId: string;
  headerPictureMediaId: string;
  bio: string;
  location: string;
  website: string;
}

const UserInfoScreen: React.FC = () => {
  const { authUserInfo } = useSelector((state: RootState) => state.auth);
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [isActionSpinnerVisible, setIsActionSpinnerVisible] = useState<boolean>(false);
  const [isShowUpdateProfileDialog, setIsShowUpdateProfileDialog] = useState<boolean>(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState<IUpdatedUserInfo | null>(null);
  const [isShowProfilePhoto, setIsShowProfilePhoto] = useState<boolean>(false);
  const [isShowProfileHeaderPhoto, setIsShowProfileHeaderPhoto] = useState<boolean>(false);

  const { data, loading, error } = useQuery(GET_USER_INFO_BY_USERNAME, {
    client: userManageClient,
    skip: !username || username?.length == 0,
    variables: {
      username
    }
  });

  useEffect(() => {
    if (data && data?.getUserInfoByUsername) {
      const result: IResponseData = data.getUserInfoByUsername;
      if (!result?.error) {
        const _userData = result.data;
        setUserInfo(_userData);
        if (_userData) {
          setUpdatedUserInfo(_userData);
        }
      }
    }
    if (error) {
      toast.error('something went wrong.');
    }
  }, [data, error]);

  const updateUserModalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '0rem',
      borderRadius: '0.8rem'
    },
    overlay: { zIndex: 20 }
  };

  const maxLengthMap: Record<keyof IUpdatedUserInfo, number> = {
    name: 50,
    bio: 160,
    location: 30,
    website: 100,
    headerPictureMediaId: 0,
    profilePictureMediaId: 0
  };

  const handleChange = (field: keyof IUpdatedUserInfo, value: string) => {
    const maxLength = maxLengthMap[field];

    setUpdatedUserInfo(
      (prev) =>
        ({
          ...(prev || {}),
          [field]: value.slice(0, maxLength)
        }) as IUpdatedUserInfo
    );
  };

  const closeDialog = () => {
    setIsShowUpdateProfileDialog(false);
    setIsActionSpinnerVisible(false);
    setUpdatedUserInfo(userInfo);
  };

  const [updateUser] = useMutation(UPDATE_USER, { client: userManageClient });

  const saveBtnOnClickHandler = async () => {
    toast.loading('please wait...');

    if (!userInfo?.userId) {
      return;
    }
    setIsActionSpinnerVisible(true);

    try {
      const response = await updateUser({
        variables: {
          userId: userInfo.userId,
          name: updatedUserInfo?.name,
          profilePictureMediaId: userInfo.profilePictureMediaId,
          headerPictureMediaId: userInfo.headerPictureMediaId,
          bio: updatedUserInfo?.bio,
          dob: userInfo.dob,
          location: updatedUserInfo?.location,
          website: updatedUserInfo?.website,
          socialLinks: userInfo.socialLinks
        }
      });

      const result: IResponseData = response.data?.updateUser;
      toast.dismiss();
      if (!result.error) {
        if (userInfo && updatedUserInfo && authUserInfo) {
          setUserInfo((prev) => ({
            ...prev!,
            ...updatedUserInfo
          }));
          dispatch(
            setAuthUserInfoState({
              authUserInfo: {
                ...authUserInfo,
                name: updatedUserInfo.name,
                profilePictureMediaId: authUserInfo.profilePictureMediaId
              }
            })
          );
        }
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setIsActionSpinnerVisible(false);
      setIsShowUpdateProfileDialog(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.dismiss();
      toast.error('something went wrong');
      setIsActionSpinnerVisible(false);
      setIsShowUpdateProfileDialog(false);
    }
  };

  if (!userInfo || loading) {
    return (
      <div className='h-[100%] flex flex-row justify-start items-start'>
        <div className='h-[100%] w-full max-w-2xl p-2 px-4 overflow-y-scroll'>
          <div className='sticky -top-4 z-10 flex flex-col justify-start items-start bg-gray-950'>
            <div className='flex flex-row justify-start items-center space-x-4 py-4'>
              <ArrowLeft size={32} className='cursor-pointer' onClick={() => router.back()} />
              <div className='font-semibold text-2xl'>@{username}</div>
            </div>
            {loading ? (
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
        <div className='sticky -top-4 z-10 flex flex-row justify-start items-center space-x-4 py-4 bg-gray-950'>
          <ArrowLeft size={32} className='cursor-pointer' onClick={() => router.back()} />
          <div className='font-semibold text-2xl'>{userInfo.name}</div>
        </div>
        <div
          className='relative h-40 w-full bg-gray-800 rounded-lg'
          style={{ backgroundImage: `url(${userInfo.headerPictureMediaId || ''})`, backgroundSize: 'cover' }}
          onClick={() => {
            if (userInfo.headerPictureMediaId) {
              setIsShowProfileHeaderPhoto(true);
            }
          }}
        >
          {/* <button className='absolute right-3 top-3 p-2 bg-white rounded-full shadow-md'>
            <Camera className='w-5 h-5' />
          </button> */}
        </div>
        <div className='relative -mt-12 ml-5'>
          <div
            className='w-[95px] h-[95px] rounded-full border-4 border-white object-cover'
            onClick={() => {
              if (userInfo.profilePictureMediaId) {
                setIsShowProfilePhoto(true);
              }
            }}
          >
            <Avatar
              name={userInfo.name || userInfo.username}
              src={userInfo.profilePictureMediaId}
              size='87'
              round={true}
            />
          </div>
          {/* <button className='absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md'>
            <Camera className='w-4 h-4' />
          </button> */}
          <div className='absolute top-14 right-0 flex flex-row justify-end items-center space-x-2'>
            <div>
              {authUserInfo?.userId !== userInfo.userId ? (
                <FollowBtn followeeUserId={userInfo.userId} followeeName={userInfo.name} />
              ) : (
                <button
                  onClick={() => setIsShowUpdateProfileDialog(true)}
                  className='flex items-center gap-2 text-white hover:bg-gray-800 px-4 py-2 rounded-full border border-gray-600'
                >
                  <Edit className='w-4 h-4' /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        <div className='mt-4 ml-5'>
          <h1 className='text-2xl font-bold'>{userInfo.name}</h1>
          <p className='mb-2 text-gray-500'>@{userInfo.username}</p>
          {userInfo?.bio && (
            <div className='mb-1 flex items-center gap-2'>
              <User className='w-5 h-5 text-gray-500' />
              <span>{userInfo.bio}</span>
            </div>
          )}
          <div className='mb-1 flex flex-wrap space-x-4'>
            {userInfo?.location && (
              <div className='flex items-center gap-2 text-gray-500'>
                <MapPin className='w-5 h-5' />
                <span>{userInfo.location}</span>
              </div>
            )}
            {userInfo?.createdAt && (
              <div className='flex items-center gap-2 text-gray-500'>
                <CalendarDays className='w-5 h-5 ' />
                <span>
                  Joined{' '}
                  {new Date(Number(userInfo.createdAt)).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
          {userInfo?.website && (
            <div className='flex items-center gap-2'>
              <Globe className='w-5 h-5 text-gray-500' />
              <a
                href={userInfo.website}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:underline'
              >
                {userInfo.website}
              </a>
            </div>
          )}
          <div className='flex gap-8 mt-2'>
            <span
              className='hover:underline cursor-pointer'
              onClick={() => {
                router.push('/' + username + '/followers');
              }}
            >
              {userInfo.followersCount} <span className='text-gray-400'>Followers</span>
            </span>
            <span
              className='hover:underline cursor-pointer'
              onClick={() => {
                router.push('/' + username + '/following');
              }}
            >
              {userInfo.followingCount} <span className='text-gray-400'>Following</span>
            </span>
          </div>
        </div>
      </div>
      <div className='min-h-screen w-[1px] bg-white' />
      <div className='h-[100%] w-[400px] py-5'>
        <div className='h-[100%] w-[100%] overflow-y-scroll'>
          <RecommendedUsersSection sectionId='suggestedUsers' pageSize={5} />
          <Footer />
        </div>
      </div>
      <>
        {updatedUserInfo && (
          <Modal
            isOpen={isShowUpdateProfileDialog}
            onRequestClose={closeDialog}
            style={updateUserModalStyle}
            contentLabel='Update User Dialog'
            ariaHideApp={false}
            className={
              'w-[100%] min-w-[200px] max-w-[600px] h-[100%] max-h-[750px] relative top-0 left-0 right-0 flex flex-row justify-center items-center'
            }
          >
            <div className={`m-2 w-[100%] h-[100%] overflow-y-scroll rounded-lg bg-[#030712] text-white`}>
              <div className='sticky top-0 z-[10] p-6 h-[50px] w-[100%] text-white flex flex-row justify-between items-center bg-[#030712]'>
                <div className='flex flex-row justify-start items-center space-x-2'>
                  <div className='flex justify-end cursor-pointer' onClick={closeDialog}>
                    <X className='w-[25px] h-[25px] text-white' />
                  </div>
                  <div className='font-semibold text-lg'>Edit Profile</div>
                </div>
                <button
                  type='button'
                  onClick={saveBtnOnClickHandler}
                  className={`${'bg-white text-black h-[30px] w-[60px] rounded-xl font-bold'} ${isActionSpinnerVisible ? 'pointer-events-none' : 'cursor-pointer'}`}
                >
                  {isActionSpinnerVisible ? <CustomButtonLoader color={CustomLoaderColors.SECONDARY} /> : 'Save'}
                </button>
              </div>
              <div className={`p-6 flex flex-col justify-center text-[1.4rem] text-center space-y-1`}>
                <div
                  className='relative h-40 w-full bg-gray-200 rounded-lg'
                  style={{
                    backgroundImage: `url(${updatedUserInfo.headerPictureMediaId || ''})`,
                    backgroundSize: 'cover'
                  }}
                ></div>
                <div className='relative -top-12 left-5'>
                  <div className='w-[95px] h-[95px] rounded-full border-4 border-white object-cover'>
                    <Avatar
                      name={updatedUserInfo.name}
                      src={updatedUserInfo.profilePictureMediaId || ''}
                      size='87'
                      round={true}
                    />
                  </div>
                </div>
                <div className='relative -top-4 left-0 flex flex-col justify-start items-start space-y-4'>
                  <div className='relative w-full group'>
                    <label className='absolute left-2 top-1 text-sm text-gray-400 pointer-events-none'>Name</label>
                    <input
                      maxLength={50}
                      className='text-lg w-full p-4 pt-6 bg-[#030712] border-2 border-gray-800 focus:border-blue-600 rounded-md outline-none'
                      value={updatedUserInfo.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <span className='absolute right-2 bottom-1 text-xs text-gray-500 opacity-0 group-focus-within:opacity-100 transition-opacity'>
                      {updatedUserInfo.name?.length}/50
                    </span>
                  </div>
                  <div className='relative w-full mt-4 group'>
                    <label className='absolute left-2 top-[2px] pt-1 right-1 text-left text-sm text-gray-400 bg-[#030712] pointer-events-none'>
                      Bio
                    </label>
                    <textarea
                      maxLength={160}
                      className='text-lg w-full p-4 pt-8 bg-[#030712] border-2 border-gray-800 focus:border-blue-600 rounded-md outline-none resize-none scroll-p-4 overflow-y-auto'
                      value={updatedUserInfo.bio || ''}
                      onChange={(e) => handleChange('bio', e.target.value)}
                    />
                    <span className='absolute right-2 bottom-1 text-xs text-gray-500 opacity-0 group-focus-within:opacity-100 transition-opacity'>
                      {updatedUserInfo.bio?.length}/160
                    </span>
                  </div>
                  <div className='relative w-full mt-4 group'>
                    <label className='absolute left-2 top-1 text-sm text-gray-400 pointer-events-none'>Location</label>
                    <input
                      maxLength={30}
                      className='text-lg w-full p-4 pt-6 bg-[#030712] border-2 border-gray-800 focus:border-blue-600 rounded-md outline-none'
                      value={updatedUserInfo.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                    />
                    <span className='absolute right-2 bottom-1 text-xs text-gray-500 opacity-0 group-focus-within:opacity-100 transition-opacity'>
                      {updatedUserInfo.location?.length}/30
                    </span>
                  </div>
                  <div className='relative w-full mt-4 group'>
                    <label className='absolute left-2 top-1 text-sm text-gray-400 pointer-events-none'>Website</label>
                    <input
                      maxLength={100}
                      className='text-lg w-full p-4 pt-6 bg-[#030712] border-2 border-gray-800 focus:border-blue-600 rounded-md outline-none'
                      value={updatedUserInfo.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                    />
                    <span className='absolute right-2 bottom-1 text-xs text-gray-500 opacity-0 group-focus-within:opacity-100 transition-opacity'>
                      {updatedUserInfo.website?.length}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </>
      {userInfo && (
        <>
          <ImageViewModal
            isDialogVisible={isShowProfilePhoto}
            setIsDialogVisible={setIsShowProfilePhoto}
            imageUrl={userInfo.profilePictureMediaId}
          />
          <ImageViewModal
            isDialogVisible={isShowProfileHeaderPhoto}
            setIsDialogVisible={setIsShowProfileHeaderPhoto}
            imageUrl={userInfo.headerPictureMediaId}
          />
        </>
      )}
    </div>
  );
};

export default UserInfoScreen;
