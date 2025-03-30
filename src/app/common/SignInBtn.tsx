'use client';

import { LOGOUT } from '@/graphql/mutations';
import { userManageClient } from '@/lib/apollo-client';
import { fbAuth, logOutHandler } from '@/lib/firebase';
import { setIsAuthenticatedState } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, LogOut } from 'lucide-react';
import ConfirmDialog from './dialogs/ConfirmDialog';
import { useState } from 'react';

const SignInBtn: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isActionSpinnerVisible, setIsActionSpinnerVisible] = useState(false);

  const [logout] = useMutation(LOGOUT, { client: userManageClient });

  const logoutBtnHandler = async () => {
    toast.loading('Logging out...');

    if (!fbAuth.currentUser?.uid) {
      await logOutHandler();
      toast.dismiss();
      toast.error('Something went wrong while logging out');
      setIsActionSpinnerVisible(false);
      setIsConfirmDialogVisible(false);
      return;
    }
    try {
      await logout({
        variables: {
          userId: fbAuth.currentUser?.uid
        }
      });

      await logOutHandler();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      //
      dispatch(setIsAuthenticatedState({ isAuthenticated: false, fbUserId: null }));
    }
    setIsActionSpinnerVisible(false);
    setIsConfirmDialogVisible(false);
    toast.dismiss();
    toast.success('Logged out successfully');
  };

  return (
    <>
      <div
        className='flex items-center gap-3 p-3 hover:bg-gray-100 hover:text-black rounded-2xl cursor-pointer'
        onClick={async () => {
          if (!isAuthenticated) {
            router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
          } else {
            setIsConfirmDialogVisible(true);
          }
        }}
      >
        {!isAuthenticated ? (
          <>
            <LogIn className='w-6 h-6' />
            <span className='hidden laptop:block'>{'SignIn'}</span>
          </>
        ) : (
          <>
            <LogOut className='w-6 h-6' />
            <span className='hidden laptop:block'>{'SignOut'}</span>
          </>
        )}
      </div>
      <ConfirmDialog
        isDialogVisible={isConfirmDialogVisible}
        setIsDialogVisible={setIsConfirmDialogVisible}
        isActionSpinnerVisible={isActionSpinnerVisible}
        description={'Are you sure you want to logout?'}
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
          await logoutBtnHandler();
        }}
      />
    </>
  );
};

export default SignInBtn;
