import { Roboto_Mono, Ubuntu_Mono } from 'next/font/google';

export const robotoMono = Roboto_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
});

export const ubuntuMono = Ubuntu_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu-mono'
});

// export const ubuntuRegular = localFont({
//   variable: '--font-ubuntu-regular',
//   display: 'swap',
//   src: '../../public/assets/fonts/Ubuntu-Regular.ttf',
// });

export const localFontsClassName = `
   ${ubuntuMono.variable}`;
