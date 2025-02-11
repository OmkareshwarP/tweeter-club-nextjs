import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/styles.scss';
import { localFontsClassName } from '@/fonts';
import { OG_DEFAULT_DESCRIPTION, OG_DEFAULT_TITLE } from '@/lib/constants';
import LayoutComponentWrapper from './common/LayoutComponent';

export const metadata: Metadata = {
  title: OG_DEFAULT_TITLE,
  description: OG_DEFAULT_DESCRIPTION
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={localFontsClassName}>
        <LayoutComponentWrapper>{children}</LayoutComponentWrapper>
      </body>
    </html>
  );
}
