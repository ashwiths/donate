import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { createUserDocument } from '../services/userService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userDoc = await createUserDocument(firebaseUser);
          const completeUser = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || userDoc?.name || 'Helper Account',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || userDoc?.profilePhoto || '',
            ...userDoc
          };
          setCurrentUser(completeUser);
        } catch (err) {
          console.error("Error setting up user document in AuthContext:", err);
          setCurrentUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Helper Account',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || ''
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout error:", e);
    }
    setCurrentUser(null);
    localStorage.removeItem('hp_token');
  };

  const login = (userData) => {
    setCurrentUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      user: currentUser, // provide both for perfect backward compatibility
      loading, 
      login,
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
