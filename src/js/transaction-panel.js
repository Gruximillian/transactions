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

function renderTransactions() {
    const { transactions } = globalStore.getState();
    // this.transactionList.textContent = `There are ${transactions.length} transactions`;
}
