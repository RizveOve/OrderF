import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDuunE4bNMTXs0GtoQzfacvgt09JdiC1pE",
  authDomain: "orderf-39b23.firebaseapp.com",
  projectId: "orderf-39b23",
  storageBucket: "orderf-39b23.firebasestorage.app",
  messagingSenderId: "910804559848",
  appId: "1:910804559848:web:d8ba520f4404415e77665d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;