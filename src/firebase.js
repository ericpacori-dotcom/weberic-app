import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  // CORREGIDO: "k" minúscula, "W" mayúscula
  apiKey: "AIzaSyCLDLqKQ6X-4CPrVaa7fzB2kxdAEvOKwCI",
  authDomain: "weberic-25da5.firebaseapp.com",
  projectId: "weberic-25da5",
  storageBucket: "weberic-25da5.firebasestorage.app",
  messagingSenderId: "25713019750",
  appId: "1:25713019750:web:aba88fd613de8b4b5896a7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// EXPORTAR las herramientas
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();