import { create } from 'zustand';
import { auth, db } from '../config/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc} from 'firebase/firestore';


export const useFirebaseStore = create((set) => ({
  authUser: null,     // Stores user profile from Firestore
  firebaseUser: null, // Raw Firebase user object (with token, etc.)
  loading: true,
  error: null,

  checkAuth: async () => {
    set({ loading: true, error: null });

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ authUser: null, firebaseUser: null, loading: false });
        return;
      }

      try {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          throw new Error("Profile not found in Firestore");
        }

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
