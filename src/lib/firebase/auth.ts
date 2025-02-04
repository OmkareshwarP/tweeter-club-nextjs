// auth.ts
import { signOut, unlink } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { fbAuth } from './firebaseConfig';
import store from '@/redux/store';
import { resetAuth } from '@/redux/slices/authSlice';
import { resetUser } from '@/redux/slices/userSlice';

export const logOutHandler = async () => {
  const currentState = store.getState();
  console.log({ fbAuthStore: currentState.auth.fbAuth });

  if (currentState.auth.fbAuth?.provider == 'google.com') {
    await unlinkProvider('google.com');
  }
  //
  store.dispatch(resetAuth());
  store.dispatch(resetUser());
  //
  localStorage.removeItem('authToken');
  localStorage.removeItem('fbToken');
  await signOut(fbAuth);
};

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
  } catch (error: any) {
    console.error('Error unlinking provider:', error.message);
  }
};
