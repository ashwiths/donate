import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserContributions, getUserCertificates, getUserActivities } from '../services/contributionService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Custom React hook to fetch Firestore user data, contributions, certificates, and recent activity with real-time syncing.
 * @returns {Object} The user's detailed data state.
 */
export function useUserData() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    if (!currentUser?.uid) return;
    try {
      const [contribs, certs, acts] = await Promise.all([
        getUserContributions(currentUser.uid),
        getUserCertificates(currentUser.uid),
        getUserActivities(currentUser.uid)
      ]);
      setContributions(contribs);
      setCertificates(certs);
      setActivities(acts);
    } catch (err) {
      console.error('Error fetching Firestore lists in hook:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.uid) {
      setUserData(null);
      setContributions([]);
      setCertificates([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to user document in real-time
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      } else {
        setUserData(currentUser);
      }
    }, (err) => {
      console.error('Error in user doc snapshot:', err);
    });

    // Fetch static lists once
    fetchLists().finally(() => {
      setLoading(false);
    });

    return () => {
      unsubscribeUser();
    };
  }, [currentUser, fetchLists]);

  return {
    userData,
    contributions,
    certificates,
    activities,
    loading,
    refreshData: fetchLists
  };
}
