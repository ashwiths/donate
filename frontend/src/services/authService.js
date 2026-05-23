import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { createUserDocument } from './userService';

/**
 * Signs in the user with Google and ensures a Firestore user document exists.
 * @returns {Promise<{user: Object, userDoc: Object}>} The authenticated user and user document.
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const userDoc = await createUserDocument(result.user);
    return { user: result.user, userDoc };
  } catch (err) {
    console.error('Error in signInWithGoogle service:', err);
    throw err;
  }
}

/**
 * Logs out the current user.
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Error in logoutUser service:', err);
    throw err;
  }
}
