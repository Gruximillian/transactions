const globalStore = require('./globalStore');

module.exports = {
    init() {
        this.transactionPanel = document.querySelector('#transaction-panel');
        this.transactionList = this.transactionPanel.querySelector('#transaction-list');
        // this.fromAccount = this.transactionPreview.querySelector('#transaction-preview__fromAccount');
        // this.merchant = this.transactionPreview.querySelector('#transaction-preview__merchant');
        // this.amount = this.transactionPreview.querySelector('#transaction-preview__amount');
        // this.transferButton = this.transactionPreview.querySelector('#transaction-confirm');
        // this.cancelButton = this.transactionPreview.querySelector('#transaction-cancel');

        renderTransactions.call(this);
        document.addEventListener('changed.transactions', () => {
            renderTransactions.call(this);
        });
        // this.cancelButton.addEventListener('click', cancelTransaction);
        // this.transferButton.addEventListener('click', performTransaction);
    },
};

const timeFormat = {
    month: 'short', day: 'numeric'
};
const dateFormatter = new Intl.DateTimeFormat('us-EN', timeFormat).format;

function addTransaction(transaction) {
    const { amount, categoryCode, merchant, merchantLogo, transactionDate, transactionType } = transaction;
    const date = dateFormatter(transactionDate);

    return (
`
<div class="transaction-panel__transaction" style="border-left-color: ${categoryCode};">
    <div class="transaction-panel__row">
        <div class="transaction-panel__transaction-column transaction-panel__date-column">${date}</div>
        <div class="transaction-panel__transaction-column transaction-panel__image-column">
            <img class="transaction-panel__merchant-image" src="${merchantLogo}">
        </div>
    </div>
    <div class="transaction-panel__row">
        <div class="transaction-panel__transaction-column">
            <div>${merchant}</div>
            <div>${transactionType}</div>
        </div>
        <div class="transaction-panel__transaction-column">-$${amount}</div>
    </div>
</div>
`
    );
}

function renderTransactions() {
    const { transactions } = globalStore.getState();

    this.transactionList.innerHTML = transactions.map(addTransaction).join('');
}
