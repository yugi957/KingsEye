import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAekALAJx0_v1DYMn2z8ylTGAS8UJpo-mk",
  authDomain: "kings-eye-dd86f.firebaseapp.com",
  databaseURL: "https://kings-eye-dd86f-default-rtdb.firebaseio.com/",
  projectId: "kings-eye-dd86f",
  storageBucket: "kings-eye-dd86f.appspot.com",
  messagingSenderId: "923986711752",
  appId: "1:923986711752:web:847f178a8186a1549cc1fd",
  measurementId: "G-HKQ6670810"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);