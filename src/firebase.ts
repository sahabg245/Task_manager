import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-PQe2ikX6SqH1tcCMCVj_Kauo6OE4DE8",
  authDomain: "react-app-ca02c.firebaseapp.com",
  projectId: "react-app-ca02c",
  storageBucket: "react-app-ca02c.firebasestorage.app",
  messagingSenderId: "382951568362",
  appId: "1:382951568362:web:b876bc38a21bc24cc97893",
  measurementId: "G-V142T2FFM7",
  databaseURL:"https://react-app-ca02c-default-rtdb.firebaseio.com",
  
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);