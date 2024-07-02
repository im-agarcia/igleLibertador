// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // Asegúrate de importar esto

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQJjNJ1k-eXbQJbgPBoG-iREAo-gEisF8",
  authDomain: "igle-libertador.firebaseapp.com",
  projectId: "igle-libertador",
  storageBucket: "igle-libertador.appspot.com",
  messagingSenderId: "75908170048",
  appId: "1:75908170048:web:85af5012c2b2865ba67aa5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
// Initialize Firebase