import { collection, addDoc, getDocs, query, where, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Creates a contribution, adds an activity entry, generates a certificate, and updates user stats in a single safe transaction.
 * @param {string} userId - The user's UID.
 * @param {number} amount - The contribution amount.
 * @param {string} childName - Name of the child helped.
 * @param {string} status - Contribution status (e.g., 'Success').
 * @returns {Promise<void>}
 */
export async function addContribution(userId, amount, childName, status = 'Success', isGameActivity = false) {
  if (!userId) return;

  const userRef = doc(db, 'users', userId);
  const contributionsCol = collection(db, 'contributions');
  const activitiesCol = collection(db, 'activities');
  const certificatesCol = collection(db, 'certificates');

  // Event-safe auto-detection of game events from status to double-guarantee separation
  const statusLower = (status || '').toLowerCase();
  const detectedGameActivity = isGameActivity || 
    statusLower.includes('reward') || 
    statusLower.includes('matched') || 
    statusLower.includes('symmetrical') || 
    statusLower.includes('alignment') || 
    statusLower.includes('game') || 
    statusLower.includes('play') || 
    statusLower.includes('matrix') || 
    statusLower.includes('tracer') || 
    statusLower.includes('reflex') || 
    statusLower.includes('sound wave') || 
    statusLower.includes('flexpath') ||
    statusLower.includes('victory') ||
    statusLower.includes('complete');

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Fetch user data within transaction
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) {
        throw new Error('User document does not exist.');
      }

      const userData = userSnap.data();

      // 2. Add Contribution record
      const newContribution = {
        userId,
        amount,
        childName,
        status,
        createdAt: serverTimestamp()
      };
      const contributionDocRef = doc(contributionsCol);
      transaction.set(contributionDocRef, newContribution);

      // 3. Add Activity record
      const newActivity = {
        userId,
        text: detectedGameActivity 
          ? `Earned ₹${amount} sponsor-matched treatment support via game achievement`
          : `Contributed ₹${amount} towards ${childName}'s recovery`,
        createdAt: serverTimestamp()
      };
      const activityDocRef = doc(activitiesCol);
      transaction.set(activityDocRef, newActivity);

      // 4. Add Certificate record
      const newCertificate = {
        userId,
        title: detectedGameActivity ? 'Certificate of Play Matching' : 'Certificate of Healing Support',
        amount,
        childName,
        certificateUrl: '', // placeholder for future storage URL
        createdAt: serverTimestamp()
      };
      const certificateDocRef = doc(certificatesCol);
      transaction.set(certificateDocRef, newCertificate);

      // 5. Update user stats
      const totalSupport = (userData.totalSupport || 0) + amount;
      const contributionsCount = (userData.contributions || 0) + 1;
      const childrenHelped = (userData.childrenHelped || 0) + 1;
      const healingStreak = contributionsCount > 1 ? `${contributionsCount} Months` : '1 Month';

      const updateFields = {
        totalSupport,
        contributions: contributionsCount,
        childrenHelped,
        healingStreak
      };

      if (!detectedGameActivity) {
        // Direct/Real healing support action or donation
        const nextHealingSupports = (userData.healingSupports || 0) + 1;
        updateFields.healingSupports = nextHealingSupports;
      } else {
        // Game played events - update games/play counters, NOT healingSupports
        updateFields.gamesPlayed = (userData.gamesPlayed || 0) + 1;
        updateFields.totalWins = (userData.totalWins || 0) + 1;
      }

      transaction.update(userRef, updateFields);
    });
  } catch (err) {
    console.error('Failed to add contribution inside transaction:', err);
    throw err;
  }
}

/**
 * Fetches all contributions for a given user.
 * @param {string} userId - The user's UID.
 * @returns {Promise<Array>} List of contribution documents sorted in memory.
 */
export async function getUserContributions(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'contributions'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => {
      const timeA = a.createdAt?.seconds || a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.seconds || b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
  } catch (err) {
    console.error('Error fetching contributions:', err);
    throw err;
  }
}

/**
 * Fetches all certificates for a given user.
 * @param {string} userId - The user's UID.
 * @returns {Promise<Array>} List of certificate documents sorted in memory.
 */
export async function getUserCertificates(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'certificates'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => {
      const timeA = a.createdAt?.seconds || a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.seconds || b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
  } catch (err) {
    console.error('Error fetching certificates:', err);
    throw err;
  }
}

/**
 * Fetches all activities for a given user.
 * @param {string} userId - The user's UID.
 * @returns {Promise<Array>} List of activity documents sorted in memory.
 */
export async function getUserActivities(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => {
      const timeA = a.createdAt?.seconds || a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.seconds || b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
  } catch (err) {
    console.error('Error fetching activities:', err);
    throw err;
  }
}
