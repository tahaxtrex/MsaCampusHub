import { create } from 'zustand';
import { auth, db } from '../config/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useFirebaseStore = create((set) => ({
  authUser: null,
  firebaseUser: null,
  loading: true,
  error: null,

  checkAuth: () => {
    set({ loading: true, error: null });

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ authUser: null, firebaseUser: null, loading: false });
        return;
      }

      try {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        // If profile doesn't exist, create it
        if (!snap.exists()) {
          const defaultProfile = {
            username: firebaseUser.displayName ?? "Anonymous",
            email: firebaseUser.email,
            createdAt: new Date(),
          };
          await setDoc(ref, defaultProfile);
          set({
            firebaseUser,
            authUser: defaultProfile,
            loading: false,
          });
          return;
        }

        // Profile exists — normal flow
        set({
          firebaseUser,
          authUser: snap.data(),
          loading: false,
        });

      } catch (err) {
        console.error("Auth check error:", err);
        set({ error: err.message, loading: false });
      }
    });
  },

  logout: async () => {
    await auth.signOut();
    set({ authUser: null, firebaseUser: null });
  }
}));
