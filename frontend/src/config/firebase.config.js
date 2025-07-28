
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAdTnfPiDrHtT4UtJJmETvmxcVw6V1XWrY",
  authDomain: "msaproject-2025.firebaseapp.com",
  projectId: "msaproject-2025",
  storageBucket: "msaproject-2025.firebasestorage.app",
  messagingSenderId: "289229491942",
  appId: "1:289229491942:web:3bd04e74488ebe67a23527",
  measurementId: "G-Y6F5R178G3"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider()
export const db = getFirestore(app);