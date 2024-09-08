import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDaG51YQCph_gZMDltD0Q--wj1NXTojocs",
  authDomain: "database-testing-a544d.firebaseapp.com",
  projectId: "database-testing-a544d",
  storageBucket: "database-testing-a544d.appspot.com",
  messagingSenderId: "462763897223",
  appId: "1:462763897223:web:c15705905624b642292322"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };