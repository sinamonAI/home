import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAooAVv_hpr0jEK7-spDZNOUNNzHhhzdZ8",
    authDomain: "quantdrive-86982.firebaseapp.com",
    projectId: "quantdrive-86982",
    storageBucket: "quantdrive-86982.firebasestorage.app",
    messagingSenderId: "888189583403",
    appId: "1:888189583403:web:724f7b5e6660747fc3ea6e",
    measurementId: "G-X5G16RG2L4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
