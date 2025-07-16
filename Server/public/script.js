const expense_form = document.getElementById("expense_form");
const expense_name = document.getElementById("expense_name");
const expense_amount = document.getElementById("expense_amount");
const expenseCategory = document.getElementById("expense_category");
const expenseDate = document.getElementById("expense_date");
const expenseTableBody = document.querySelector("#expense_table tbody");
const totalExpenseElement = document.getElementById("total_expense");
const darkModeToggle = document.getElementById("dark_mode_toggle");
const ctx = document.getElementById("expense_chart").getContext("2d");

let totalExpense = 0;
let categoryData = {};
let expenseChart;

// Load Dark Mode and Fetch Expenses on Page Load
window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
    fetchExpensesFromBackend();
};

// Toggle Dark Mode
darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Form Submit Event
expense_form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = expense_name.value.trim();
    const amount = parseFloat(expense_amount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    if (name === "" || isNaN(amount) || date === "") {
        alert("Please fill out all fields correctly.");
        return;
    }

    try {
        const response = await fetch("/api/expenses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, amount, category, date })
        });

        const data = await response.json();
        addExpenseToUI(data);
        expense_form.reset();
    } catch (err) {
        console.error("Error adding expense:", err);
        alert("Failed to add expense.");
    }
});

// Fetch Expenses from Backend
async function fetchExpensesFromBackend() {
    try {
        const response = await fetch("/api/expenses");
        const expenses = await response.json();
        expenses.forEach(expense => addExpenseToUI(expense));
    } catch (err) {
        console.error("Error fetching expenses:", err);
    }
}

// Add Expense Row to Table
function addExpenseToUI(expense) {
    const { _id, name, amount, category, date } = expense;

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${name}</td>
        <td>₹${amount.toFixed(2)}</td>
        <td>${category}</td>
        <td>${new Date(date).toISOString().split("T")[0]}</td>
        <td><button class="delete-btn" data-id="${_id}">🗑️</button></td>
    `;

    expenseTableBody.appendChild(row);
    updateTotal(amount);

    if (!categoryData[category]) {
        categoryData[category] = 0;
    }
    categoryData[category] += amount;
    updateChart();

    // Delete Button
    row.querySelector(".delete-btn").addEventListener("click", async function () {
        try {
            const res = await fetch(`/api/expenses/${_id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                row.remove();
                updateTotal(-amount);
                categoryData[category] -= amount;
                if (categoryData[category] <= 0) {
                    delete categoryData[category];
                }
                updateChart();
            } else {
                alert("Failed to delete expense.");
            }
        } catch (err) {
            console.error("Error deleting expense:", err);
        }
    });
}

// Update Total Expense
function updateTotal(amount) {
    totalExpense += amount;
    totalExpense = Math.max(totalExpense, 0);
    totalExpenseElement.textContent = `${totalExpense.toFixed(2)}`;
}

// Draw/Update Chart
function updateChart() {
    if (expenseChart) {
        expenseChart.destroy();
    }
    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"],
            }]
        }
    });
}
