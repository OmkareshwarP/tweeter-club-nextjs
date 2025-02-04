'use client';

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './UpdateProfileScreen.module.scss';
import { useMutation, useQuery } from '@apollo/client';
import { userManageClient } from '@/lib/apollo-client';
import { IResponseData, IUserInfo } from '@/interfaces';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { GET_USER_INFO } from '@/graphql/queries';
import { UPDATE_USER } from '@/graphql/mutations';
import { updateUserInfoState } from '@/redux/slices/userSlice';

interface UserUpdateFormProps {
  initialData: {
    name: string;
    profilePictureMediaId: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    dob: string | null;
  };
  onSubmit: (data: FormData) => void;
}

const UpdateProfileScreen: React.FC = () => {
  const [defaultUserInfo, setDefaultUserInfo] = useState<IUserInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    dob: ''
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const userAuthInfoStore = useSelector((state: RootState) => state.user.userAuthInfo);

  const { error, data, loading } = useQuery(GET_USER_INFO, {
    fetchPolicy: 'network-only',
    skip: !userAuthInfoStore?.userId,
    client: userManageClient
  });

  useEffect(() => {
    if (loading) {
      toast.loading('Please wait....');
    }
    if (error) {
      toast.dismiss();
      console.log('something went wrong.');
    }
    if (data) {
      toast.dismiss();
      const _data: any = data?.getUserInfo?.data;
      if (_data) {
        const _userInfo = _data as IUserInfo;
        console.log({ _userInfo });

        if (_userInfo?.userId) {
          setDefaultUserInfo(_userInfo);
          console.log({ userAuthInfoStore, _userInfo });
        }
      } else {
        setDefaultUserInfo(null);
        console.log(`Error:: No data found for user`);
      }
    }
  }, [error, data, loading]);
  //
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    data.append('location', formData.location);
    data.append('website', formData.website);
    data.append('dob', formData.dob);
    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }
    const { name, bio, location, website, dob } = formData;
    const _updateData: Partial<any> = {
      ...(name && name.length > 0 && name.trim() != defaultUserInfo?.name && { name }),
      ...(bio && bio.length > 0 && bio.trim() != defaultUserInfo?.bio && { bio }),
      ...(location && location.length > 0 && location.trim() != defaultUserInfo?.location && { location }),
      ...(website && website.length > 0 && website.trim() != defaultUserInfo?.website && { website }),
      ...(dob && dob.length > 0 && dob.trim() != defaultUserInfo?.dob && { dob })
    };
    console.log({ formData, _updateData });
    if (Object.keys(_updateData)?.length > 0) {
      console.log('entered');
      await updateUserInfo(_updateData);
    }
  };

  const setDefaultUserData = (_data: IUserInfo) => {
    if (_data?.username) {
      setFormData({
        name: _data?.name || '',
        bio: _data?.bio || '',
        location: _data?.location || '',
        website: _data?.website || '',
        dob: _data?.dob || ''
      });
    }
  };

  useEffect(() => {
    setDefaultUserData(defaultUserInfo as any);
  }, [defaultUserInfo]);

  const [updateUserMutation] = useMutation(UPDATE_USER);

  const updateUserInfo = async (inputData: any) => {
    try {
      toast.loading('Please wait...');
      const response = await updateUserMutation({
        variables: {
          ...inputData
        }
      });
      toast.dismiss();
      const result = response.data.updateUser as IResponseData;
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        const { name } = inputData;
        if (name && name.length > 0) {
          dispatch(updateUserInfoState({ name }));
        }
        const _username = userAuthInfoStore?.username;
        if (_username) {
          router.push(_username);
        }
      }
    } catch (e) {
      console.log('updateUserInfoError', e);
    }
  };

  return (
    <>
      {defaultUserInfo && defaultUserInfo?.userId?.length > 0 ? (
        <>
          <div className='w-[100%] flex flex-col justify-start items-start space-y-2 m-2'>
            <div className='w-[100%] flex flex-row justify-between items-center space-x-2 space-y-2'>
              <div className='max-w-[250px] flex flex-row justify-start items-center space-x-2 space-y-2'>
                <div className='w-[60px]'>
                  {defaultUserInfo?.profilePictureMediaId && (
                    <Image
                      style={{ borderRadius: '50%' }}
                      src={defaultUserInfo?.profilePictureMediaId || ''}
                      alt='image'
                      width={60}
                      height={60}
                    />
                  )}
                </div>
                <div className='max-w-[190px] flex flex-col justify-center items-start bg-red-400'>
                  <div className='w-[100%] overflow-hidden text-ellipsis'>{defaultUserInfo?.name}</div>
                  <div className='w-[100%] overflow-hidden text-ellipsis font-semibold'>
                    @{defaultUserInfo?.username}
                  </div>
                </div>
              </div>
            </div>
            <form className='w-[100%] flex flex-col justify-start items-center space-y-2' onSubmit={handleSubmit}>
              <div className='flex flex-row space-x-2'>
                <label>Name</label>
                <input
                  className='text-black'
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex flex-row space-x-2'>
                <label>Bio</label>
                <textarea
                  className='text-black'
                  name='bio'
                  value={formData.bio}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className='flex flex-row space-x-2'>
                <label>Location</label>
                <input
                  className='text-black'
                  type='text'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex flex-row space-x-2'>
                <label>Website</label>
                <input
                  className='text-black'
                  type='text'
                  name='website'
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex flex-row space-x-2'>
                <label>Date of Birth</label>
                <input
                  className='text-black'
                  type='date'
                  name='dob'
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div>
                  <label>Profile Picture</label>
                  <input type='file' accept='image/*' onChange={handleFileChange} />
                </div> */}
              <div className='w-[100%] flex flex-row justify-center items-center space-x-4'>
                <button
                  type='submit'
                  // onClick={() => {

                  // }}
                  className={`${styles.followBtn} px-4 py-1 rounded-lg cursor-pointer`}
                >
                  Save
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setDefaultUserData(defaultUserInfo as any);
                  }}
                  style={{ backgroundColor: '#dd300b', color: 'white' }}
                  className={`${styles.followBtn} px-4 py-1 rounded-lg cursor-pointer`}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div>User not found</div>
      )}
    </>
  );
};

export default UpdateProfileScreen;
