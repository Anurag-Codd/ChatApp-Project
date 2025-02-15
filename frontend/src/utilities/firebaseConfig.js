import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALuHy7hBGxH9qUriwmO_HKnEqt2Ph-ihs",
  authDomain: "chat-xx1.firebaseapp.com",
  projectId: "chat-xx1",
  storageBucket: "chat-xx1.firebasestorage.app",
  messagingSenderId: "299426021794",
  appId: "1:299426021794:web:1699bcb02717282653b2fb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const createUser = createUserWithEmailAndPassword;
export const signInUser = signInWithEmailAndPassword;
export const signOutUser = signOut;

export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
