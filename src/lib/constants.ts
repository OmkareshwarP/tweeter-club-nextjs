//OpenGraph properties
export const OG_DEFAULT_TITLE = 'Tweeter Club';
export const OG_DEFAULT_DESCRIPTION =
  'Tweeter Club is a social media platform for developers to share their thoughts and ideas.';
export const OG_DEFAULT_IMAGE = '';

export const GA_TRACKING_ID = 'G-customID';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const normalRoutes = ['/about', '/contact-us', '/terms', '/privacy'];
