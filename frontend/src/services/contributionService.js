import { collection, addDoc, getDocs, query, where, doc, runTransaction, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Centralized helper to generate a healing certificate and related records (contribution, activity).
 * @param {object} params
 * @returns {Promise<string>} Created certificate document ID.
 */
export async function generateHealingCertificate({
  userId,
  amount,
  childName = 'Janamithra',
  title = '',
  contributionType = 'donation', // 'donation', 'game_unlock', 'coupon_unlock', 'sponsor_reward'
  couponId = '',
  couponBrand = '',
  couponCode = '',
  gameId = '',
  gameName = '',
  supporterName = ''
}) {
  if (!userId) return null;

  const userRef = doc(db, 'users', userId);
  const contributionsCol = collection(db, 'contributions');
  const activitiesCol = collection(db, 'activities');
  const certificatesCol = collection(db, 'certificates');

  try {
    let newCertId = '';
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
        status: `${contributionType.toUpperCase()}_SUCCESS`,
        createdAt: serverTimestamp()
      };
      const contributionDocRef = doc(contributionsCol);
      transaction.set(contributionDocRef, newContribution);

      // 3. Add Activity record
      let activityText = `Contributed ₹${amount} towards ${childName}'s recovery`;
      if (contributionType === 'game_unlock') {
        activityText = `Unlocked premium game "${gameName || 'Game'}" for ₹${amount} supporting ${childName}`;
      } else if (contributionType === 'coupon_unlock') {
        activityText = `Unlocked premium coupon for "${couponBrand || 'Sponsor'}" for ₹${amount} supporting ${childName}`;
      } else if (contributionType === 'sponsor_reward') {
        activityText = `Earned ₹${amount} sponsor-matched treatment support via game achievement`;
      }
      
      const newActivity = {
        userId,
        text: activityText,
        createdAt: serverTimestamp()
      };
      const activityDocRef = doc(activitiesCol);
      transaction.set(activityDocRef, newActivity);

      // 4. Add Certificate record
      const certificateDocRef = doc(certificatesCol);
      newCertId = certificateDocRef.id;
      
      const newCertificate = {
        amount,
        childName,
        title: title || (contributionType === 'game_unlock' ? 'Certificate of Play Matching' : 'Certificate of Healing Support'),
        userId,
        createdAt: serverTimestamp(),
        certificateUrl: '', // placeholder
        couponId: couponId || '',
        gameId: gameId || '',
        contributionType,
        supporterName: supporterName || ''
      };
      transaction.set(certificateDocRef, newCertificate);

      if (contributionType === 'coupon_unlock') {
        const couponUnlocksCol = collection(db, 'couponUnlocks');
        const couponUnlockDocRef = doc(couponUnlocksCol);
        const newCouponUnlock = {
          supporterName: supporterName || '',
          brand: couponBrand || '',
          code: couponCode || '',
          amount,
          userId,
          createdAt: serverTimestamp()
        };
        transaction.set(couponUnlockDocRef, newCouponUnlock);
      }

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

      if (contributionType === 'sponsor_reward') {
        updateFields.gamesPlayed = (userData.gamesPlayed || 0) + 1;
        updateFields.totalWins = (userData.totalWins || 0) + 1;
      } else if (contributionType === 'coupon_unlock') {
        updateFields.couponsClaimed = (userData.couponsClaimed || 0) + 1;
        
        if (couponId) {
          const detailObj = {
            id: couponId,
            brand: couponBrand || 'Premium Sponsor',
            code: couponCode || 'SECRET',
            unlockedAt: new Date().toISOString(),
            amount: amount
          };
          if (!Array.isArray(userData.unlockedCoupons)) {
            updateFields.unlockedCoupons = [detailObj];
          } else {
            updateFields.unlockedCoupons = arrayUnion(detailObj);
          }
        }
      } else if (contributionType === 'game_unlock') {
        updateFields.totalGamesUnlocked = (userData.totalGamesUnlocked || 0) + 1;
        
        if (gameId) {
          const detailObj = {
            gameId,
            gameName: gameName || 'Premium Game',
            amount,
            type: 'paid',
            unlockedAt: new Date().toISOString()
          };
          if (!Array.isArray(userData.unlockedGames)) {
            updateFields.unlockedGames = [gameId];
            updateFields.unlockedGameDetails = [detailObj];
          } else {
            updateFields.unlockedGames = arrayUnion(gameId);
            updateFields.unlockedGameDetails = arrayUnion(detailObj);
          }
        }
      } else {
        updateFields.healingSupports = (userData.healingSupports || 0) + 1;
      }

      transaction.update(userRef, updateFields);
    });

    return newCertId;
  } catch (err) {
    console.error('Failed to generate healing certificate inside transaction:', err);
    throw err;
  }
}

/**
 * Creates a contribution, adds an activity entry, generates a certificate, and updates user stats in a single safe transaction.
 * Retained for backward compatibility with existing game components.
 */
export async function addContribution(userId, amount, childName, status = 'Success', isGameActivity = false) {
  if (!userId) return;

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

  const contributionType = detectedGameActivity ? 'sponsor_reward' : 'donation';
  const title = detectedGameActivity ? 'Certificate of Play Matching' : 'Certificate of Healing Support';

  return generateHealingCertificate({
    userId,
    amount,
    childName,
    title,
    contributionType
  });
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
