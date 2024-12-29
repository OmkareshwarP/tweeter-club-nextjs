import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/styles.scss';
import { GA_TRACKING_ID, OG_DEFAULT_DESCRIPTION, OG_DEFAULT_TITLE } from '@/lib/constants';
import Script from 'next/script';
import { localFontsClassName } from '@/fonts';
import Navigation from '@/components/navigation/Navigation';

export const metadata: Metadata = {
  title: OG_DEFAULT_TITLE,
  description: OG_DEFAULT_DESCRIPTION
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        {/* Load the Google Analytics script */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy='afterInteractive' />
        <Script id='gtag-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
      </head>
      <body className={localFontsClassName}>
        <Navigation>{children}</Navigation>
      </body>
    </html>
  );
}
