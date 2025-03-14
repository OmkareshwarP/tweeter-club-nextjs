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

const SignInBtn: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [logout] = useMutation(LOGOUT, { client: userManageClient });

  const logoutBtnHandler = async () => {
    toast.loading('Logging out...');

    if (!fbAuth.currentUser?.uid) {
      await logOutHandler();
      toast.dismiss();
      toast.error('Something went wrong while logging out');
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
    toast.dismiss();
    toast.success('Logged out successfully');
  };

  return (
    <div
      className='mt-5 ml-5 bg-white px-3 py-1 font-semibold w-fit text-black rounded-lg shadow-lg cursor-pointer'
      onClick={async () => {
        if (!isAuthenticated) {
          router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
        } else {
          await logoutBtnHandler();
        }
      }}
    >
      {!isAuthenticated ? 'SignIn' : 'SignOut'}
    </div>
  );
};

export default SignInBtn;
