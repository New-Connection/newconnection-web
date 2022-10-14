import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enum DBCollections {
    DAOS = "daos",
    MEMBERS = "members",
    PROPOSALS = "proposals",
    WHITELIST = "whitelist"
}

export const daosCollection = collection(db, DBCollections.DAOS);
export const membersCollection = collection(db, DBCollections.MEMBERS);
export const proposalsCollection = collection(db, DBCollections.PROPOSALS);
export const whitelistCollection = collection(db, DBCollections.WHITELIST);
