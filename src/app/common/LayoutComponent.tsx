'use client';

import { GET_USER_BASIC_INFO } from '@/graphql/queries';
import { IResponseData, IAuthUserInfo } from '@/interfaces';
import { userManageClient } from '@/lib/apollo-client';
import { normalRoutes, protectedRoutes } from '@/lib/constants';
import { fbAuth, logOutHandler } from '@/lib/firebase';
import { setAuthUserInfoState, setCurrentProviderState, setIsAuthenticatedState } from '@/redux/slices/authSlice';
import store, { RootState } from '@/redux/store';
import { useQuery } from '@apollo/client';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Provider, useDispatch, useSelector } from 'react-redux';
import DashboardScreen from '../DashboardScreen';

interface ILayoutComponentProps {
  children: React.ReactNode;
}

const LayoutComponent: React.FC<ILayoutComponentProps> = ({ children }) => {
  const { isAuthenticated, fbUserId } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { refetch: userBasicInfoRefetch } = useQuery(GET_USER_BASIC_INFO, { client: userManageClient, skip: true });

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isNormalRoute = normalRoutes.includes(pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fbAuth, async (authUser) => {
      const _token = localStorage.getItem('authToken');
      if (authUser && authUser.uid && _token && _token?.length > 5) {
        dispatch(setIsAuthenticatedState({ isAuthenticated: true, fbUserId: authUser.uid }));
        dispatch(setCurrentProviderState({ currentProvider: authUser.providerData[0]?.providerId }));
        return;
      }

      dispatch(setIsAuthenticatedState({ isAuthenticated: false, fbUserId: null }));
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserBasicInfo = async () => {
    const response = await userBasicInfoRefetch();
    const result: IResponseData = response.data?.getUserBasicInfo;
    if (result.error == false) {
      const userData: IAuthUserInfo = result.data;
      console.log({ userData });
      dispatch(setAuthUserInfoState({ authUserInfo: userData }));
      if (userData.userId !== fbUserId) {
        toast.error('Unauthorized - Logging out');
        await logOutHandler();
      }
    } else {
      await logOutHandler();
      toast.error(result.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated && fbUserId) {
      getUserBasicInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, fbUserId]);

  if (isProtectedRoute) {
    return <>ProtectedRoute</>;
  } else if (isNormalRoute) {
    return <>NormalRoute</>;
  } else {
    return (
      <div className={'w-[100%] h-[100%]'}>
        <Toaster />
        {children}
        <DashboardScreen />
      </div>
    );
  }
};

interface ILayoutComponentWrapperProps {
  children: React.ReactNode;
}

const LayoutComponentWrapper: React.FC<ILayoutComponentWrapperProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <LayoutComponent>{children}</LayoutComponent>
    </Provider>
  );
};

export default LayoutComponentWrapper;
