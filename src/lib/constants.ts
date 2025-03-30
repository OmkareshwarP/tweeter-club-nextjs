export const OG_DEFAULT_TITLE = 'Tweeter Club';
export const OG_DEFAULT_DESCRIPTION =
  'Tweeter Club is a social media platform for developers to share their thoughts and ideas.';
export const OG_DEFAULT_IMAGE = '';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const protectedRoutes = ['/analytics'];
export const normalRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/about', '/contact-us', '/terms', '/privacy'];
export const allowedSecondaryPaths = ['following', 'followers'];

export const pageReload = () => {
  window.location.reload();
};

export const MODAL_STYLE = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0rem',
    borderRadius: '0.8rem'
  },
  overlay: { zIndex: 20 }
};

export enum CustomLoaderTypes {
  THREE_DOTS
}

export enum CustomLoaderColors {
  PRIMARY = '#963BF9',
  SECONDARY = '#ffffff',
  TERTIARY = '#030712'
}
