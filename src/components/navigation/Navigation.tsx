'use client';

import DashboardPage from '@/components/dashboardPage/DashboardPage';
import ProtectedPage from '@/components/ProtectedPage';
import { userManageClient } from '@/lib/apollo-client';
import { normalRoutes } from '@/lib/constants';
import store from '@/redux/store';
import { darkTheme } from '@/styles/themes';
import { ApolloProvider } from '@apollo/client';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

interface NavigationProps {
  children: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const pathname = usePathname();
  const isNormalPage = normalRoutes.includes(pathname);
  //
  if (!isNormalPage) {
    //dashboard page
    return (
      <>
        <Toaster />
        <div className={''}>
          {/* redux provider */}
          <Provider store={store}>
            <ApolloProvider client={userManageClient}>
              <ThemeProvider theme={darkTheme}>
                <ProtectedPage>
                  <DashboardPage>{children}</DashboardPage>
                </ProtectedPage>
              </ThemeProvider>
            </ApolloProvider>
          </Provider>
        </div>
      </>
    );
  } else {
    return <div className={''}>{children}</div>;
  }
};

export default Navigation;
