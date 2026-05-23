import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Creates a user document in Firestore if it doesn't already exist.
 * @param {Object} firebaseUser - The authenticated Firebase user object.
 * @returns {Promise<Object>} The user document data.
 */
export async function createUserDocument(firebaseUser) {
  if (!firebaseUser) return null;

  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const defaultData = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || 'Helper Account',
      email: firebaseUser.email,
      profilePhoto: firebaseUser.photoURL || '',
      totalSupport: 0,
      contributions: 0,
      childrenHelped: 0,
      healingStreak: '0 Days',
      unlockedGames: 0,
      couponsClaimed: 0,
      quotesOpened: 0,
      healingSupports: 0,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(userRef, defaultData);
      return defaultData;
    } catch (err) {
      console.error('Error creating user document:', err);
      throw err;
    }
  }

  return snap.data();
}

/**
 * Fetches user document data from Firestore.
 * @param {string} uid - The user's UID.
 * @returns {Promise<Object|null>} The user document data or null.
 */
export async function getUserData(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error('Error fetching user data:', err);
    throw err;
  }
}

/**
 * Updates an existing user document.
 * @param {string} uid - The user's UID.
 * @param {Object} data - The fields to update.
 * @returns {Promise<void>}
 */
export async function updateUserData(uid, data) {
  if (!uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  } catch (err) {
    console.error('Error updating user data:', err);
    throw err;
  }
}
