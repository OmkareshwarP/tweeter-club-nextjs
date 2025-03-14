import { resetAuthState } from '@/redux/slices/authSlice';
import store from '@/redux/store';
import { FirebaseError, FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User as FBUser, unlink, signOut } from 'firebase/auth';

export type { FBUser };

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig, process.env.NEXT_PUBLIC_APP_NAME);
const fbAuth = getAuth(app);

export { fbAuth, onAuthStateChanged };

export function handleFirebaseError(err: unknown): { isFirebaseError: boolean; message: string } {
  const error = err as FirebaseError;
  switch (error.code) {
    case 'auth/email-already-in-use':
      return { isFirebaseError: true, message: 'The email address is already in use by another account.' };
    case 'auth/invalid-email':
      return { isFirebaseError: true, message: 'The email address is not valid.' };
    case 'auth/operation-not-allowed':
      return { isFirebaseError: true, message: 'Email/password accounts are not enabled.' };
    case 'auth/weak-password':
      return { isFirebaseError: true, message: 'The password is too weak.' };
    case 'auth/user-not-found':
      return { isFirebaseError: true, message: 'No user found with this email.' };
    case 'auth/wrong-password':
      return { isFirebaseError: true, message: 'Incorrect password.' };
    case 'auth/invalid-credential':
      return { isFirebaseError: true, message: 'Email or password is incorrect. Please enter correct details.' };
    default:
      return { isFirebaseError: false, message: '' };
  }
}

export const unlinkProvider = async (providerId: string) => {
  const user = fbAuth.currentUser;
  if (!user) {
    console.log('No user is signed in to unlink a provider.');
    return;
  }
  try {
    await unlink(user, providerId);
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    console.error('Error unlinking provider:', firebaseError.message);
  }
};

export const logOutHandler = async () => {
  const currentState = store.getState();

  if (currentState.auth.currentProvider == 'google.com') {
    await unlinkProvider('google.com');
  }

  localStorage.removeItem('authToken');
  localStorage.removeItem('fbToken');

  store.dispatch(resetAuthState());

  await signOut(fbAuth);
};
