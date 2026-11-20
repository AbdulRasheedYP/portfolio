import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBZ66iIyaCpwH53itNydoKWL5jr8dVGAt0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portfolio-79a11.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portfolio-79a11",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portfolio-79a11.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "868772329007",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:868772329007:web:0de6f9dc5df27fd54238da",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4SPNXCT0DZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
export const storage = getStorage(app);
export default app;
