import { Roboto_Mono } from 'next/font/google';

export const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap'
});

// export const ubuntuRegular = localFont({
//   variable: '--font-ubuntu-regular',
//   display: 'swap',
//   src: '../../public/assets/fonts/Ubuntu-Regular.ttf',
// });

export const localFontsClassName = `
  ${robotoMono.variable}`;
