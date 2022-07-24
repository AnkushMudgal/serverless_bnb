import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDmLlebcOZmibYEUBhYpwZdXwag6j3ofvA",
    authDomain: "robotic-insight-340814.firebaseapp.com",
    projectId: "robotic-insight-340814",
    storageBucket: "robotic-insight-340814.appspot.com",
    messagingSenderId: "660050408812",
    appId: "1:660050408812:web:d6d5578cd16048cb71af49",
    measurementId: "G-K8MXF55MNK"
  };

  const app = initializeApp(firebaseConfig);
  export const firestoreDB = getFirestore(app);