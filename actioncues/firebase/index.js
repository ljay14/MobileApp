// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, getDocs, updateDoc, doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4DXujG_jLwj3Qdj1El5iPqYDO4-z_3xg",
  authDomain: "taskmanager-327e1.firebaseapp.com",
  projectId: "taskmanager-327e1",
  storageBucket: "taskmanager-327e1.firebasestorage.app",
  messagingSenderId: "80958623915",
  appId: "1:80958623915:web:403fffdfd85b701cbc27ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export{app, db, getFirestore, collection, deleteDoc, getDocs, addDoc, updateDoc, doc }  