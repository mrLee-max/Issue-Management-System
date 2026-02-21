// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVaHowqlxAZR1lDa2LhlaEDLI88XZ1FfE",
  authDomain: "imsstorage.firebaseapp.com",
  projectId: "imsstorage",
  storageBucket: "imsstorage.firebasestorage.app",
  messagingSenderId: "942362264505",
  appId: "1:942362264505:web:aa5f4f899f469080166c68",
  measurementId: "G-864P9LJN63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ you need this
const messaging = getMessaging(app); // ✅ add this

export { app, auth, db, firebaseConfig, storage, getStorage, messaging };