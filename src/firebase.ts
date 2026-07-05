import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return true;
  } catch (error) {
    return false;
  }
};

export const saveScore = async (name: string, score: number) => {
  try {
    const docRef = await addDoc(collection(db, "ranking"), {
      name: name,
      score: score,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    //console.error("Error: ", e);
    return false;
  }
};

export const getTopScores = async (limitCount: number = 25) => {
  try {
    const q = query(
      collection(db, "ranking"),
      orderBy("score", "desc"),
      limit(limitCount),
    );

    const querySnapshot = await getDocs(q);
    const scores = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return scores;
  } catch (e) {
    console.error("Error fetching scores: ", e);
    return [];
  }
};
