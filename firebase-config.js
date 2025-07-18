// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFIWlyJLRuOIJgRRHo9xkEWPk0OC5jnYQ",
  authDomain: "linkvault-181c7.firebaseapp.com",
  projectId: "linkvault-181c7",
  storageBucket: "linkvault-181c7.firebasestorage.app",
  messagingSenderId: "222258163708",
  appId: "1:222258163708:web:2fb9bf8918d90e8d768c79",
  measurementId: "G-3G3D8D6MRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;