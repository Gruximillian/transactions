const globalStore = require('./globalStore');

module.exports = {
    init() {
        this.transactionPanel = document.querySelector('#transaction-panel');
        this.transactionList = this.transactionPanel.querySelector('#transaction-list');
        this.searchTransactions = this.transactionPanel.querySelector('#transaction-panel__search');
        this.sortControlsWrapper = this.transactionPanel.querySelector('#transaction-panel__sort-controls');
        this.sortByDateButton = this.transactionPanel.querySelector('#sortBy-transactionDate');
        this.sortByMerchantButton = this.transactionPanel.querySelector('#sortBy-merchant');
        this.sortByAmountButton = this.transactionPanel.querySelector('#sortBy-amount');

        renderTransactions.call(this, globalStore.getState().transactions);
        document.addEventListener('changed.transactions', () => {
            const transactions = globalStore.getState().transactions;
            renderTransactions.call(this, transactions);
        });
        document.addEventListener('changed.sortedBy', () => {
            const transactions = globalStore.getState().transactions;
            renderTransactions.call(this, transactions);
        });
        document.addEventListener('changed.sortingOrder', () => {
            const transactions = globalStore.getState().transactions;
            renderTransactions.call(this, transactions);
        });

        updateSortButtons.call(this);
        this.sortByDateButton.addEventListener('click', (e) => {
            updateSortState.call(this, e.target);
            updateSortButtons.call(this);
        });
        this.sortByMerchantButton.addEventListener('click', (e) => {
            updateSortState.call(this, e.target);
            updateSortButtons.call(this);
        });
        this.sortByAmountButton.addEventListener('click', (e) => {
            updateSortState.call(this, e.target);
            updateSortButtons.call(this);
        });
        this.searchTransactions.addEventListener('input', searchTransactions.bind(this));
    },
};

const timeFormat = {
    month: 'short', day: 'numeric'
};
const dateFormatter = new Intl.DateTimeFormat('us-EN', timeFormat).format;

function createTransaction(transaction) {
    const { amount, categoryCode, merchant, merchantLogo, transactionDate, transactionType } = transaction;
    const date = dateFormatter(transactionDate);

    return (
`
<div class="transaction-panel__transaction">
    <div class="transaction-panel__category-marker" style="background-color: ${categoryCode};"></div>
    <div class="transaction-panel__row">
        <div class="transaction-panel__date-column">${date}</div>
        <div class="transaction-panel__image-column">
            <img class="transaction-panel__merchant-image" src="${merchantLogo}">
        </div>
    </div>
    <div class="transaction-panel__row">
        <div>
            <div class="transaction-panel__transaction-merchant">${merchant}</div>
            <div class="transaction-panel__transaction-type">${transactionType}</div>
        </div>
        <div class="transaction-panel__transaction-amount">-$${amount}</div>
    </div>
</div>
`
    );
}

function renderTransactions(transactions) {
    const { sortedBy, sortingOrder } = globalStore.getState();
    const sortedTransactions = sortTransactions(transactions, sortedBy, sortingOrder);

    this.transactionList.innerHTML = sortedTransactions.map(createTransaction).join('');
}

function sortTransactions(transactions, sortedBy, sortingOrder) {
    return transactions.sort((a, b) => {
        const first = a[sortedBy];
        const second = b[sortedBy];
        if (sortingOrder === 'ascending') {
            return sortedBy === 'merchant' ? first.localeCompare(second) : first - second;
        }
        if (sortingOrder === 'descending') {
            return sortedBy === 'merchant' ? second.localeCompare(first) : second - first;
        }
    });
}

function updateSortState(target) {
    const sortBy = target.dataset.sortBy;
    const { sortedBy, sortingOrder } = globalStore.getState();
    if (sortBy !== sortedBy) {
        globalStore.setState({ sortedBy: sortBy });
    } else {
        const newSortingOrder = sortingOrder === 'ascending' ? 'descending' : 'ascending';
        globalStore.setState({ sortingOrder: newSortingOrder });
    }
}

function searchTransactions(e) {
    const value = e.target.value.trim().toLowerCase();
    const { transactions } = globalStore.getState();
    const filteredTransactions = transactions.filter(transaction => {
        return transaction.merchant.toLowerCase().indexOf(value) !== -1
            || transaction.transactionType.toLowerCase().indexOf(value) !== -1
            || transaction.amount.toLowerCase().indexOf(value) !== -1;
    });

    renderTransactions.call(this, filteredTransactions);
}

function updateSortButtons() {
    const { sortedBy, sortingOrder } = globalStore.getState();

    this.sortControlsWrapper.dataset.sortOrder = sortingOrder;
    this.sortByDateButton.dataset.sortActive = false;
    this.sortByMerchantButton.dataset.sortActive = false;
    this.sortByAmountButton.dataset.sortActive = false;

    if (sortedBy === 'transactionDate') {
        this.sortByDateButton.dataset.sortActive = true;
    }
    if (sortedBy === 'merchant') {
        this.sortByMerchantButton.dataset.sortActive = true;
    }
    if (sortedBy === 'amount') {
        this.sortByAmountButton.dataset.sortActive = true;
    }
}
