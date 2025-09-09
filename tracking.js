import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getFirestore, collection, getDocs, deleteDoc, doc, setDoc, addDoc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const tableBody = document.getElementById("transactionTable");
const balanceEl = document.getElementById("balance");

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

async function saveSnapshot() {
  await addDoc(collection(db, "history"), {
    timestamp: Date.now(),
    transactions: transactions
  });
}

async function loadTransactions() {
  transactions = [];
  const querySnapshot = await getDocs(collection(db, "transactions"));
  querySnapshot.forEach((d) => {
    transactions.push({ id: d.id, ...d.data() });
  });
  renderTable();
}

async function restoreSnapshot(snapshot) {
  const querySnapshot = await getDocs(collection(db, "transactions"));
  for (let d of querySnapshot.docs) {
    await deleteDoc(doc(db, "transactions", d.id));
  }

  for (let t of snapshot.transactions) {
    let copy = { ...t };
    delete copy.id;
    await addDoc(collection(db, "transactions"), copy);
  }

  await loadTransactions();
}

function renderTable() {
  tableBody.innerHTML = "";
  let balance = 0;

  transactions.forEach((t) => {
    const row = document.createElement("tr");
    row.dataset.id = t.id;

    const sourceCell = document.createElement("td");
    sourceCell.textContent = t.source;

    const amountCell = document.createElement("td");
    amountCell.textContent = "$" + t.amount.toFixed(2);

    const dateCell = document.createElement("td");
    dateCell.textContent = t.date;

    const typeCell = document.createElement("td");
    typeCell.textContent = t.type;

    const buttonCell = document.createElement("td");
    const button = document.createElement("button");
    button.textContent = "Delete";
    button.classList.add("delete-btn");
    button.dataset.id = t.id;
    button.style.width = "100px";
    button.style.height = "50px";
    buttonCell.appendChild(button);

    row.appendChild(sourceCell);
    row.appendChild(amountCell);
    row.appendChild(dateCell);
    row.appendChild(typeCell);
    row.appendChild(buttonCell);

    tableBody.appendChild(row);

    if (t.type === "Funding") {
      balance += t.amount;
    } else {
      balance -= t.amount;
    }
  });

  balanceEl.textContent = "Balance: $" + balance.toFixed(2);
}

tableBody.addEventListener("click", async function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;

    await saveSnapshot();

    await deleteDoc(doc(db, "transactions", id));
    await loadTransactions();
  }
});

async function undo() {
  const q = query(collection(db, "history"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const last = snapshot.docs[0].data();
    await restoreSnapshot(last);

    await deleteDoc(doc(db, "history", snapshot.docs[0].id));
  }
}

async function redo() {
  await loadTransactions();
}

document.addEventListener("keydown", function(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "z") {
    event.preventDefault();
    undo();
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "y") {
    event.preventDefault();
    redo();
  }
});

loadTransactions();
