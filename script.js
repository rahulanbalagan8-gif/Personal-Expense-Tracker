let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    transactions.push({
        id: Date.now(),
        description: description,
        amount: amount,
        type: type
    });

    saveTransactions();
    updateDashboard();
    form.reset();
});

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function deleteTransaction(id) {
    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    updateDashboard();
}

function updateDashboard() {
    let income = 0;
    let expense = 0;

    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

        const item = document.createElement("li");

        const details = document.createElement("span");
        details.textContent =
            transaction.description + " - ₹" +
            transaction.amount.toFixed(2) +
            " (" + transaction.type + ")";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "15px";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        item.appendChild(details);
        item.appendChild(deleteButton);
        transactionList.appendChild(item);
    });

    balanceDisplay.textContent = "₹" + (income - expense).toFixed(2);
    incomeDisplay.textContent = "₹" + income.toFixed(2);
    expenseDisplay.textContent = "₹" + expense.toFixed(2);
}

updateDashboard();