
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Note: Pour le frontend, les clés sont publiques par design dans Firebase.
// Elles sont limitées par le domaine autorisé dans la console Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyBEdWAY2itBcWIlh9GfqqBwnhqW-NsH3GQ",
  authDomain: "clopshort-3eb0a.firebaseapp.com",
  projectId: "clopshort-3eb0a",
  storageBucket: "clopshort-3eb0a.firebasestorage.app",
  messagingSenderId: "127272590360",
  appId: "1:127272590360:web:fe88ca83153abb651a776d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
