let budget = 0;
let transactions = [];

const budgetAmountEl = document.getElementById('budget-amount');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const remainingEl = document.getElementById('remaining');
const transactionsListEl = document.getElementById('transactions-list');
const monthlyBudgetInput = document.getElementById('monthly-budget');
const setBudgetBtn = document.getElementById('set-budget');
const addTransactionBtn = document.getElementById('add-transaction');

const ctx = document.getElementById('chart').getContext('2d');
let chart;

function updateBudget() {
  budget = Number(monthlyBudgetInput.value);
  budgetAmountEl.textContent = budget.toFixed(2);
  updateSummary();
  updateChart();
}

function addTransaction() {
  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value.trim();
  const amount = Number(document.getElementById('amount').value);

  if (!description || !amount || amount <= 0) {
    alert('Please enter valid description and amount');
    return;
  }

  transactions.push({ id: Date.now(), type, description, amount });
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  renderTransactions();
  updateSummary();
  updateChart();
}

function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  renderTransactions();
  updateSummary();
  updateChart();
}

function renderTransactions() {
  transactionsListEl.innerHTML = '';
  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.textContent = `${tx.description} - $${tx.amount.toFixed(2)} (${tx.type})`;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.style.marginLeft = '1rem';
    delBtn.onclick = () => deleteTransaction(tx.id);

    li.appendChild(delBtn);
    transactionsListEl.appendChild(li);
  });
}

function updateSummary() {
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const remaining = budget + totalIncome - totalExpense;

  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpenseEl.textContent = totalExpense.toFixed(2);
  remainingEl.textContent = remaining.toFixed(2);
}

function updateChart() {
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense', 'Remaining Budget'],
      datasets: [{
        label: 'Budget Breakdown',
        data: [totalIncome, totalExpense, Math.max(budget - totalExpense, 0)],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      }],
    },
  });
}

setBudgetBtn.addEventListener('click', updateBudget);
addTransactionBtn.addEventListener('click', addTransaction);

renderTransactions();
updateSummary();
updateChart();
