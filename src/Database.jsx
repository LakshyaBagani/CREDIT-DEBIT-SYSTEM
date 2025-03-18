import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAlTcM5nH3wFvm3LZsPscZ-nFdp-8Ppek",
  authDomain: "credit-debit-system.firebaseapp.com",
  projectId: "credit-debit-system",
  storageBucket: "credit-debit-system.firebasestorage.app",
  messagingSenderId: "437510550454",
  appId: "1:437510550454:web:5a313b94d86c83c71f8717",
  measurementId: "G-Y0WB76R570"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);