let transactionHistory = [];
const MAX_HISTORY = 5;

function refreshDisplay(accountBal, cashBal, message = '', isError = false) {
    document.getElementById('displayAccountBalance').textContent = accountBal.toLocaleString();
    document.getElementById('displayCashBalance').textContent = cashBal.toLocaleString();
    
    const alertElement = document.getElementById('alertMessage');
    alertElement.textContent = message;
    alertElement.className = isError ? 'error-message' : '';

    const historyList = document.getElementById('transactionHistory');
    historyList.innerHTML = '';

    const displayHistory = transactionHistory.slice(-MAX_HISTORY).reverse();
    
    const startIndex = displayHistory.length; 
    
    displayHistory.forEach((item, index) => {
        const li = document.createElement('li');
        const listNumber = startIndex - index; 
        li.innerHTML = `<strong>${listNumber}.</strong> ${item}`;
        historyList.appendChild(li);
    });
}

function addHistory(entry) {
    transactionHistory.push(entry);
}

function updateBalances() {
    const accountInput = parseFloat(document.getElementById('inputAccountBalance').value) || 0;
    const cashInput = parseFloat(document.getElementById('inputCashBalance').value) || 0;
    
    document.getElementById('inputAccountBalance').value = accountInput;
    document.getElementById('inputCashBalance').value = cashInput;
    
    addHistory(`Balances changed manually. Account: ${accountInput.toLocaleString()}, Cash: ${cashInput.toLocaleString()}`);
    
    refreshDisplay(accountInput, cashInput, 'Current balances updated manually.');
}

function processOperation() {
    const type = document.getElementById('operationType').value;
    const amount = parseFloat(document.getElementById('operationAmount').value) || 0;

    let currentAccountBalance = parseFloat(document.getElementById('displayAccountBalance').textContent.replace(/,/g, ''));
    let currentCashBalance = parseFloat(document.getElementById('displayCashBalance').textContent.replace(/,/g, ''));
    
    document.getElementById('alertMessage').textContent = '';
    let historyMessage = '';

    if (amount <= 0) {
         refreshDisplay(currentAccountBalance, currentCashBalance, "Please enter a valid amount (greater than 0).", true);
         return;
    }

    let success = false;
    
    if (type === 'withdraw') {
        if (currentAccountBalance >= amount) {
            currentAccountBalance -= amount;
            currentCashBalance += amount;
            historyMessage = `Withdrawal: ${amount.toLocaleString()} from Account to Cash.`;
            success = true;
        } else {
            refreshDisplay(
                currentAccountBalance, 
                currentCashBalance, 
                "Couldn't withdraw entered balance. (Insufficient account balance)", 
                true
            );
        }
    } else if (type === 'deposit') {
        if (currentCashBalance >= amount) {
            currentAccountBalance += amount;
            currentCashBalance -= amount;
            historyMessage = `Deposit: ${amount.toLocaleString()} from Cash to Account.`;
            success = true;
        } else {
             refreshDisplay(
                currentAccountBalance, 
                currentCashBalance, 
                "Couldn't deposit entered balance. (Insufficient cash balance)", 
                true
            );
        }
    }
    
    if (success) {
        addHistory(historyMessage);
        
        refreshDisplay(
            currentAccountBalance, 
            currentCashBalance, 
            `${type === 'withdraw' ? 'Successfully withdrew' : 'Successfully deposited'} ${amount.toLocaleString()}.`
        );
        
        document.getElementById('inputAccountBalance').value = currentAccountBalance;
        document.getElementById('inputCashBalance').value = currentCashBalance;
    }
}

document.addEventListener('DOMContentLoaded', () => {
     addHistory(`Initial setup completed. Account: 1,000, Cash: 1,000.`);
    updateBalances();
});