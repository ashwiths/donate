import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../services/userService';
import { getUserContributions, getUserCertificates, getUserActivities } from '../services/contributionService';

/**
 * Custom React hook to fetch Firestore user data, contributions, certificates, and recent activity.
 * @returns {Object} The user's detailed data state.
 */
export function useUserData() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!currentUser?.uid) {
      setUserData(null);
      setContributions([]);
      setCertificates([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [uData, contribs, certs, acts] = await Promise.all([
        getUserData(currentUser.uid),
        getUserContributions(currentUser.uid),
        getUserCertificates(currentUser.uid),
        getUserActivities(currentUser.uid)
      ]);

      setUserData(uData || currentUser);
      setContributions(contribs);
      setCertificates(certs);
      setActivities(acts);
    } catch (err) {
      console.error('Error fetching Firestore user records in hook:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    userData,
    contributions,
    certificates,
    activities,
    loading,
    refreshData: fetchData
  };
}
