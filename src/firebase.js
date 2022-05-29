import { getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNhmLFy1OCggbuF2ZZxIEWNyrx8l07cz8",
  authDomain: "whatsapp-95977.firebaseapp.com",
  projectId: "whatsapp-95977",
  storageBucket: "whatsapp-95977.appspot.com",
  messagingSenderId: "753838543272",
  appId: "1:753838543272:web:b8001461b786f30dcd8d9d",
  measurementId: "G-361R78H812",
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const app = createFirebaseApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;
