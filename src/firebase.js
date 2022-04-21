import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAbNQHwMy6L_S9_EzGF2apOCImR8WjPFMg",
  authDomain: "hear-ye-hear-ye.firebaseapp.com",
  projectId: "hear-ye-hear-ye",
  storageBucket: "hear-ye-hear-ye.appspot.com",
  messagingSenderId: "242184962560",
  appId: "1:242184962560:web:e23bca726ad2a84b1b4ee5",
  measurementId: "G-68937X2N6B"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
