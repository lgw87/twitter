import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBzB33YGgK2teYpPD_eBTZE8V54gnXgQ60",
    authDomain: "twitter-3f57d.firebaseapp.com",
    projectId: "twitter-3f57d",
    storageBucket: "twitter-3f57d.appspot.com",
    messagingSenderId: "155801328017",
    appId: "1:155801328017:web:95c0e8ad15bfd326f62230"
  };

  const app = initializeApp(firebaseConfig);

  export const authService = getAuth();
  export const dbService = getFirestore();
  export const storageService = getStorage();
  export default app;