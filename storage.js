import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeLFWso2NJ7hf9AOSmG7JmqElvxFUE-co",
  authDomain: "storage-31396.firebaseapp.com",
  projectId: "storage-31396",
  storageBucket: "storage-31396.firebasestorage.app",
  messagingSenderId: "1054625514155",
  appId: "1:1054625514155:web:d60ebf4770081ef0b7edee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveTransaction(transaction) {
  await addDoc(collection(db, "transactions"), transaction);
}

async function loadTransactions() {
  const querySnapshot = await getDocs(collection(db, "transactions"));
  const transactions = [];
  querySnapshot.forEach((doc) => {
    transactions.push(doc.data());
  });
  return transactions;
}
