'use client';

import React, { useEffect, useState } from 'react';
import styles from './DashboardLaptop.module.scss';
import { darkTheme, lightTheme } from '@/styles/themes';
import { useRouter } from 'next/navigation';

interface DashboardLaptopLayoutProps {
  children: React.ReactNode;
}

const DashboardLaptopLayout: React.FC<DashboardLaptopLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [theme, setTheme] = useState<any>(lightTheme);

  useEffect(() => {
    // Set body class based on the current theme
    document.body.classList.toggle('dark-theme', theme === darkTheme);
  }, [theme]);
  //
  return (
    <>
      <div className={`${styles.container}`}>{children}</div>
    </>
  );
};

export default DashboardLaptopLayout;
