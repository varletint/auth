import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.FIREBASE_KEY,
    authDomain: "varletint.firebaseapp.com",
    projectId: "varletint",
    storageBucket: "varletint.appspot.com",
    messagingSenderId: "205316607104",
    appId: "1:205316607104:web:870be6b17e26a4fdc66a65",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
