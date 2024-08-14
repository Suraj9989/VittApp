// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDT1nyxvyZ_eXvtYOqQ_N25aGAoMWTC04o",
  authDomain: "vittapp-692d9.firebaseapp.com",
  projectId: "vittapp-692d9",
  storageBucket: "vittapp-692d9.appspot.com",
  messagingSenderId: "465948985167",
  appId: "1:465948985167:web:fddf44a98ecf9f7096673a",
  measurementId: "G-937NCQ61GJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };