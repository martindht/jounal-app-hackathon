import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDp1bOKvkhJdi-szgn33T1OLxeAQYS343E",
  authDomain: "journal-hackathon-36f74.firebaseapp.com",
  projectId: "journal-hackathon-36f74",
  storageBucket: "journal-hackathon-36f74.firebasestorage.app",
  messagingSenderId: "775224669586",
  appId: "1:775224669586:web:15c3411735994a1acfbd4b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export { signInWithPopup, signOut, onAuthStateChanged };

// helpers 
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
