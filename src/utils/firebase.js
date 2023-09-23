// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "blog-f26be.firebaseapp.com",
  projectId: "blog-f26be",
  storageBucket: "blog-f26be.appspot.com",
  messagingSenderId: "949655780257",
  appId: "1:949655780257:web:e2e3f5d907f573f612a9e0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);