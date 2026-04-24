/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAN82RmTOG2ROfytwkgxPsB1azZ7whwQ6M",
  authDomain: "lifelinex-4c911.firebaseapp.com",
  projectId: "lifelinex-4c911",
  storageBucket: "lifelinex-4c911.firebasestorage.app",
  messagingSenderId: "981522538286",
  appId: "1:981522538286:web:b21306974d2f9ea96b64bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
