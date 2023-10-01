// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAekALAJx0_v1DYMn2z8ylTGAS8UJpo-mk",
  authDomain: "kings-eye-dd86f.firebaseapp.com",
  projectId: "kings-eye-dd86f",
  storageBucket: "kings-eye-dd86f.appspot.com",
  messagingSenderId: "923986711752",
  appId: "1:923986711752:web:847f178a8186a1549cc1fd",
  measurementId: "G-HKQ6670810"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);