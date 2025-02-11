'use client';

import { normalRoutes, protectedRoutes } from '@/lib/constants';
import { fbAuth } from '@/lib/firebase';
import { setAuthState } from '@/redux/slices/authSlice';
import store, { RootState } from '@/redux/store';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider, useDispatch, useSelector } from 'react-redux';

interface ILayoutComponentProps {
  children: React.ReactNode;
}

const LayoutComponent: React.FC<ILayoutComponentProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isNormalRoute = normalRoutes.includes(pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fbAuth, async (authUser) => {
      if (!authUser) {
        dispatch(setAuthState({ isAuthenticated: false }));
        return;
      }
      dispatch(setAuthState({ isAuthenticated: true }));
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isProtectedRoute) {
    return <>ProtectedRoute</>;
  } else if (isNormalRoute) {
    return <>NormalRoute</>;
  } else {
    return (
      <div className={'w-[100%] h-[100%]'}>
        <Toaster />
        {children}
        {isAuthenticated ? (
          <>
            <div
              className='mt-5 ml-5 bg-white px-3 py-1 font-semibold w-fit text-black rounded-lg shadow-lg cursor-pointer'
              onClick={async () => {
                await signOut(fbAuth);
              }}
            >
              SignOut
            </div>
          </>
        ) : (
          <>
            <div
              className='mt-5 ml-5 bg-white px-3 py-1 font-semibold w-fit text-black rounded-lg shadow-lg cursor-pointer'
              onClick={() => {
                router.push('sign-in');
              }}
            >
              SignIn
            </div>
          </>
        )}
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
