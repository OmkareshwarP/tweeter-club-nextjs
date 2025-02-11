export const OG_DEFAULT_TITLE = 'Tweeter Club';
export const OG_DEFAULT_DESCRIPTION =
  'Tweeter Club is a social media platform for developers to share their thoughts and ideas.';
export const OG_DEFAULT_IMAGE = '';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const protectedRoutes = ['/analytics'];
export const normalRoutes = ['/about', '/contact-us', '/terms', '/privacy'];
