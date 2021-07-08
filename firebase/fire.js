import firebase from "firebase";
import "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA329PmXe7X3qLJNMYOnm-WWpb1yDhViR4",
  authDomain: "vezadrainagenz-805e5.firebaseapp.com",
  projectId: "vezadrainagenz-805e5",
  storageBucket: "vezadrainagenz-805e5.appspot.com",
  messagingSenderId: "988876007166",
  appId: "1:988876007166:web:0954f8809f8d0585e3e7af",
  measurementId: "G-GT26WCPFPL",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export default firebase;
