// Firebase 설정 - 환경변수 우선, fallback으로 기본값 사용
// Firebase 클라이언트 키는 공개 키이므로 fallback이 보안에 문제없음
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAooAVv_hpr0jEK7-spDZNOUNNzHhhzdZ8",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "quantdrive-86982.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quantdrive-86982",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "quantdrive-86982.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "888189583403",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:888189583403:web:724f7b5e6660747fc3ea6e",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-X5G16RG2L4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
