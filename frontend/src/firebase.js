import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAfuVxTTFl2OSZKvyVTaDr_Tzw6WUrlHPs",
    authDomain: "heal-and-play-49d9f.firebaseapp.com",
    projectId: "heal-and-play-49d9f",
    storageBucket: "heal-and-play-49d9f.firebasestorage.app",
    messagingSenderId: "92212756735",
    appId: "1:92212756735:web:b329f7e69357f87c42ccca"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);