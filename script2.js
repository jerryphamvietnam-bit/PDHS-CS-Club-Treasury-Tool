import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const transactionForm = document.getElementById("transactionForm");

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

  let transactions = [];

  async function loadTransactions() {
    transactions = [];
    const querySnapshot = await getDocs(collection(db, "transactions"));
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data());
    });

    if (typeof renderTable === "function") renderTable(transactions);
  }

  transactionForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const source = document.getElementById("source").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const type = document.getElementById("type").value;

    if (!source || isNaN(amount) || !date || !type) {
      alert("Please fill in all fields correctly!");
      return;
    }

    await addDoc(collection(db, "transactions"), {
      source,
      amount,
      date,
      type
    });

    transactionForm.reset();
    await loadTransactions();
    alert("Transaction added!");
  });

  loadTransactions();
});
