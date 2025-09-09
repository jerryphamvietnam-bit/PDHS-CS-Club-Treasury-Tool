document.addEventListener("DOMContentLoaded", () => {
  const transactionForm = document.getElementById("transactionForm");

  let storedTransactions = localStorage.getItem("transactions");
  let transactions;
  try {
    transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    if (!Array.isArray(transactions)) transactions = [];
  } catch {

    transactions = [];
  }

  let history = [];

  transactionForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const source = document.getElementById("source").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const type = document.getElementById("type").value;

    if (!source || isNaN(amount) || !date || !type) {
      alert("Please fill in all fields correctly!");
      return;
    }
    history.push(JSON.parse(JSON.stringify(transactions)));
    transactions.push({ source, amount, date, type });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    transactionForm.reset();
    if (typeof renderTable === "function") renderTable();
    alert("Transaction added!");
  });
});
