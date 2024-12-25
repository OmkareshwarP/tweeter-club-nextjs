'use client';

import React, { useEffect, useState } from 'react';

import styles from './CustomPage.module.scss';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '@/styles/themes';

export default function CustomPage({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    // Set body class based on the current theme
    document.body.classList.toggle('dark-theme', theme === darkTheme);
  }, [theme]);
  //
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <div className={`${styles.container}`}>
          <div id='header-container' className={`${styles.headerContainer}`}>
            Header
          </div>
          <button onClick={() => setTheme(theme === lightTheme ? darkTheme : lightTheme)}>Toggle Theme</button>
          <div>
            <div className={`${styles.bodyContainer}`}>{children}</div>
            <div id={'footer-container'} className={`${styles.footerContainer}`}>
              Footer
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
