import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  FieldValue
} from 'firebase/firestore';
import { UserData } from '../types';

// IMPORTANT: To use Firebase services, you must create your own Firebase project
// and replace the placeholder values below with your actual configuration.
// You can get your configuration from the Firebase console:
// Project Settings > General > Your apps > Web app > SDK setup and configuration
export const firebaseConfig = {
  apiKey: "AIzaSyApyNfZiKBi7uR_LaycwjvRxg4d0_xl1IM",
  authDomain: "ielt-f591f.firebaseapp.com",
  projectId: "ielt-f591f",
  storageBucket: "ielt-f591f.firebasestorage.app",
  messagingSenderId: "238942676671",
  appId: "1:238942676671:web:708fab9c32b5fc5353480a",
  measurementId: "G-CRFY6NXH8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = (): Promise<User> => {
    return new Promise((resolve, reject) => {
        signInWithPopup(auth, provider)
            .then(result => resolve(result.user))
            .catch(error => reject(error));
    });
};

export const signOutUser = (): Promise<void> => {
    return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Firestore Functions
export const getUserDocument = async (uid: string): Promise<UserData | null> => {
    if (!uid) return null;
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserData;
    }
    return null;
};

export const createUserDocument = async (uid: string, data: UserData): Promise<void> => {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data);
};

export const updateUserDocument = async (uid: string, data: Partial<UserData>): Promise<void> => {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, data);
};