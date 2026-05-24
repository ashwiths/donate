import { collection, addDoc, getDocs, query, where, doc, runTransaction, serverTimestamp, increment, arrayUnion, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
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

      // 3. Add Activity records
      let activityType = 'contribution';
      let activityTarget = 'Healing Support';
      
      if (contributionType === 'game_unlock') {
        activityType = 'game_unlock';
        activityTarget = gameName || 'Premium Game';
      } else if (contributionType === 'coupon_unlock') {
        activityType = 'coupon_unlock';
        activityTarget = couponBrand || 'Sponsor';
      } else if (contributionType === 'sponsor_reward') {
        activityType = 'reward_claimed';
        activityTarget = 'Sponsor-matched support';
      }
      
      const newActivity = {
        type: activityType,
        userId,
        supporterName: supporterName || userData.name || 'Verified Supporter',
        target: activityTarget,
        amount,
        createdAt: serverTimestamp()
      };
      const activityDocRef = doc(activitiesCol);
      transaction.set(activityDocRef, newActivity);

      // Log certificate_generated activity
      const certActivityDocRef = doc(activitiesCol);
      const certActivity = {
        type: 'certificate_generated',
        userId,
        supporterName: supporterName || userData.name || 'Verified Supporter',
        target: title || 'Healing Certificate',
        amount,
        createdAt: serverTimestamp()
      };
      transaction.set(certActivityDocRef, certActivity);

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

      // Coupon Unlock logic
      if (contributionType === 'coupon_unlock') {
        const couponUnlocksCol = collection(db, 'couponUnlocks');
        const couponUnlockDocRef = doc(couponUnlocksCol);
        const newCouponUnlock = {
          userId,
          supporterName: supporterName || '',
          couponId: couponId || '',
          brand: couponBrand || '',
          code: couponCode || '',
          amount,
          unlockedAt: serverTimestamp(),
          certificateId: newCertId,
          redeemed: false
        };
        transaction.set(couponUnlockDocRef, newCouponUnlock);

        // Update Coupon Stock & Reward Inventory
        if (couponId) {
          const couponDocRef = doc(db, 'coupons', couponId);
          const couponSnap = await transaction.get(couponDocRef);
          if (couponSnap.exists()) {
            const couponData = couponSnap.data();
            const remaining = couponData.remainingStock ?? 100;
            if (remaining <= 0) {
              throw new Error('This coupon is out of stock.');
            }
            const newRemaining = remaining - 1;
            const newUnlocked = (couponData.unlockedCount ?? 0) + 1;
            
            transaction.update(couponDocRef, {
              remainingStock: newRemaining,
              unlockedCount: newUnlocked,
              isActive: newRemaining > 0
            });

            // rewardInventory record
            const invDocRef = doc(db, 'rewardInventory', couponId);
            transaction.set(invDocRef, {
              couponId,
              brand: couponBrand || '',
              remainingStock: newRemaining,
              unlockedCount: newUnlocked,
              updatedAt: serverTimestamp()
            }, { merge: true });
          }
        }
      }

      // Game Unlock logic
      if (contributionType === 'game_unlock') {
        const gameUnlocksCol = collection(db, 'gameUnlocks');
        const gameUnlockDocRef = doc(gameUnlocksCol);
        const newGameUnlock = {
          userId,
          gameId: gameId || '',
          gameName: gameName || 'Premium Game',
          unlockAmount: amount,
          unlockedAt: serverTimestamp(),
          certificateId: newCertId
        };
        transaction.set(gameUnlockDocRef, newGameUnlock);
      }

      // Update global analytics document inside transaction
      const statsRef = doc(db, 'analytics', 'globalStats');
      const statsUpdate = {
        totalContributions: increment(1),
        totalCertificatesGenerated: increment(1),
        totalRevenue: increment(amount),
        updatedAt: serverTimestamp()
      };
      
      if (contributionType === 'coupon_unlock') {
        statsUpdate.totalCouponsUnlocked = increment(1);
      } else if (contributionType === 'game_unlock') {
        statsUpdate.totalGamesUnlocked = increment(1);
      } else if (contributionType === 'donation' || contributionType === 'sponsor_reward') {
        statsUpdate.totalHealingSupport = increment(amount);
      }
      
      transaction.set(statsRef, statsUpdate, { merge: true });

      // 5. Update user stats
      const updateFields = {
        totalSupport: increment(amount),
        contributions: increment(1),
        childrenHelped: increment(1),
        totalCertificates: increment(1),
        lastActiveAt: serverTimestamp()
      };

      if (contributionType === 'sponsor_reward') {
        updateFields.gamesPlayed = increment(1);
        updateFields.totalWins = increment(1);
      } else if (contributionType === 'coupon_unlock') {
        updateFields.couponsClaimed = increment(1);
        
        if (couponId) {
          const detailObj = {
            id: couponId,
            brand: couponBrand || 'Premium Sponsor',
            code: couponCode || 'SECRET',
            unlockedAt: new Date().toISOString(),
            amount: amount
          };
          updateFields.unlockedCoupons = arrayUnion(detailObj);
        }
      } else if (contributionType === 'game_unlock') {
        updateFields.totalGamesUnlocked = increment(1);
        updateFields.gamesPlayed = increment(1);
        
        if (gameId) {
          const detailObj = {
            gameId,
            gameName: gameName || 'Premium Game',
            amount,
            type: 'paid',
            unlockedAt: new Date().toISOString()
          };
          updateFields.unlockedGames = arrayUnion(gameId);
          updateFields.unlockedGameDetails = arrayUnion(detailObj);
        }
      } else {
        updateFields.healingSupports = increment(1);
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

/**
 * Seeds the coupons collection in Firestore if it is empty.
 */
export async function seedCouponsIfEmpty() {
  try {
    const couponsCol = collection(db, 'coupons');
    const snap = await getDocs(couponsCol);
    if (snap.empty) {
      const initialCoupons = [
        {
          id: 'zop',
          brand: 'ZOP',
          title: 'Zop Premium Earbuds',
          offer: 'Get Bluetooth Earbuds at ₹399',
          code: 'ZPTSCZEBXX1',
          totalStock: 100,
          remainingStock: 100,
          unlockedCount: 0,
          unlockAmount: 10,
          category: 'Electronics',
          expiryDate: '2026-12-31',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&h=150&fit=crop&q=80',
          isActive: true,
          blurBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(29, 78, 216, 0.12) 100%)',
          accentColor: '#1D4ED8',
          logoUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&h=150&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&h=400&fit=crop&q=80',
          description: 'Elevate your listening experience with high-fidelity sound and ergonomic comfort. Get premium Bluetooth earbuds.',
          benefits: ['No minimum order', '80% OFF', 'Valid on Mentioned Product'],
          redeemUrl: 'https://www.gonoise.com/collections/earbuds'
        },
        {
          id: 'giva',
          brand: 'GIVA',
          title: 'GIVA Silver Jewellery',
          offer: 'Flat ₹1000 Off on all silver jewellery',
          code: 'PSC-02DHCZ',
          totalStock: 100,
          remainingStock: 84,
          unlockedCount: 16,
          unlockAmount: 20,
          category: 'Fashion & Lifestyle',
          expiryDate: '2026-12-31',
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=150&fit=crop&q=80',
          isActive: true,
          blurBg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(13, 148, 136, 0.12) 100%)',
          accentColor: '#0D9488',
          logoUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=150&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=400&fit=crop&q=80',
          description: 'Add a touch of elegance to your daily wear with certified silver jewellery from GIVA. Beautifully crafted designs.',
          benefits: ['Min order ₹1999', '₹1000 OFF', 'Valid on selected items'],
          redeemUrl: 'https://www.giva.co/collections/silver-jewellery'
        },
        {
          id: 'just-herbs',
          brand: 'Just Herbs',
          title: 'Just Herbs Lipsticks',
          offer: 'Get 16 Lipsticks worth ₹575 at ₹299',
          code: 'PAYTMJHLSK40',
          totalStock: 100,
          remainingStock: 100,
          unlockedCount: 0,
          unlockAmount: 10,
          category: 'Personal Care',
          expiryDate: '2026-12-31',
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=150&h=150&fit=crop&q=80',
          isActive: true,
          blurBg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(219, 39, 119, 0.12) 100%)',
          accentColor: '#DB2777',
          logoUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=150&h=150&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=400&fit=crop&q=80',
          description: 'Indulge in organic beauty with 100% natural, ayurvedic lipsticks. Soft, moisturizing matte shades for every skin tone.',
          benefits: ['No minimum order', '₹276 OFF', 'Valid on selected item'],
          redeemUrl: 'https://www.justherbs.in/collections/lipsticks'
        },
        {
          id: 'the-man-company',
          brand: 'The Man Company',
          title: 'The Man Company Grooming',
          offer: 'Buy 1 Get 3 Free',
          code: 'TMCPTB1G3SC04',
          totalStock: 100,
          remainingStock: 100,
          unlockedCount: 0,
          unlockAmount: 15,
          category: 'Personal Care',
          expiryDate: '2026-12-31',
          image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=150&h=150&fit=crop&q=80',
          isActive: true,
          blurBg: 'linear-gradient(135deg, rgba(120, 113, 108, 0.08) 0%, rgba(68, 64, 60, 0.12) 100%)',
          accentColor: '#44403C',
          logoUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=150&h=150&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1626015713026-d837d172406f?w=800&h=400&fit=crop&q=80',
          description: 'Premium grooming essentials for men formulated with natural essential oils. Elevate your everyday style.',
          benefits: ['No minimum order', 'Buy 1 Get 3', 'Valid on Select Products'],
          redeemUrl: 'https://www.themancompany.com/collections/face-care'
        },
        {
          id: 'airtel',
          brand: 'Airtel',
          title: 'Airtel Postpaid plan',
          offer: 'Unlimited data & 22+ OTTs with Airtel Postpaid',
          code: '4A2711CF',
          totalStock: 100,
          remainingStock: 100,
          unlockedCount: 0,
          unlockAmount: 10,
          category: 'Recharge & Utility',
          expiryDate: '2026-12-31',
          image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=150&h=150&fit=crop&q=80',
          isActive: true,
          blurBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(185, 28, 28, 0.12) 100%)',
          accentColor: '#B91C28',
          logoUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=150&h=150&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&h=400&fit=crop&q=80',
          description: 'Experience blazing-fast connectivity with Airtel postpaid plans featuring unlimited data rollover, premium OTT apps and more.',
          benefits: ['Unlimited data', '22+ OTTs', 'Specific products'],
          redeemUrl: 'https://www.airtel.in/postpaid'
        },
        {
          id: 'pilgrim',
          brand: 'Pilgrim',
          title: 'Pilgrim Sunscreens',
          offer: 'Sunscreens at ₹349',
          code: 'PTMS349SC',
          totalStock: 100,
          remainingStock: 100,
          unlockedCount: 0,
          unlockAmount: 20,
          category: 'Personal Care',
          expiryDate: '2026-12-31',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&q=80',
          isActive: true,
          blurBg: 'linear-gradient(135deg, rgba(14, 116, 144, 0.08) 0%, rgba(8, 145, 178, 0.12) 100%)',
          accentColor: '#0891B2',
          logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=400&fit=crop&q=80',
          description: 'Shield your skin against UV rays with Korean beauty-inspired ultra-light gel sunscreens from Pilgrim.',
          benefits: ['No minimum order', 'Sunscreens at ₹349', 'Valid on selected items'],
          redeemUrl: 'https://discoverpilgrim.com/collections/sunscreens'
        }
      ];

      for (const coupon of initialCoupons) {
        const couponRef = doc(db, 'coupons', coupon.id);
        await setDoc(couponRef, {
          ...coupon,
          createdAt: serverTimestamp()
        });
      }
      console.log('Seeded coupons database successfully.');
    }
  } catch (err) {
    console.error('Error seeding coupons database:', err);
  }
}

/**
 * Subscribes to real-time updates of the coupons collection.
 */
export function subscribeCoupons(onUpdate) {
  const couponsCol = collection(db, 'coupons');
  return onSnapshot(couponsCol, (snapshot) => {
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onUpdate(list);
  }, (err) => {
    console.error('Coupons real-time sync failed:', err);
  });
}

/**
 * Subscribes to real-time updates of a single coupon document.
 */
export function subscribeCoupon(couponId, onUpdate) {
  const couponRef = doc(db, 'coupons', couponId);
  return onSnapshot(couponRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate({ id: snapshot.id, ...snapshot.data() });
    }
  }, (err) => {
    console.error(`Coupon ${couponId} real-time sync failed:`, err);
  });
}
