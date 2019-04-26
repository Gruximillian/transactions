const globalStore = require('./globalStore');
const merchantData = require('./data/merchant-list').data;

module.exports = {
    init() {
        this.transactionPreview = document.querySelector('#transaction-preview');
        this.fromAccount = this.transactionPreview.querySelector('#transaction-preview__fromAccount');
        this.merchant = this.transactionPreview.querySelector('#transaction-preview__merchant');
        this.amount = this.transactionPreview.querySelector('#transaction-preview__amount');
        this.transferButton = this.transactionPreview.querySelector('#transaction-confirm');
        this.cancelButton = this.transactionPreview.querySelector('#transaction-cancel');

        document.addEventListener('changed.currentTransaction', () => {
            toggleTransactionPreview.call(this);
            updateTransactionDetails.call(this);
        });
        this.cancelButton.addEventListener('click', cancelTransaction);
        this.transferButton.addEventListener('click', performTransaction);
    },
};

function performTransaction() {
    const { balance, currentTransaction: { merchant, amount } } = globalStore.getState();
    const newBalance = balance * 100 - amount * 100;
    const transactions = globalStore.getState().transactions;
    const merchantObject = merchantData.filter(data => data.merchant === merchant)[0];
    const newTransaction = {
        ...merchantObject,
        amount,
        transactionDate: Date.now()
    };

    globalStore.setState({
        balance: newBalance / 100,
        currentTransaction: null,
        transactions: [...transactions, newTransaction]
    });
}

function cancelTransaction() {
    globalStore.setState({ currentTransaction: null });
}

function toggleTransactionPreview() {
    const currentTransaction = globalStore.getState().currentTransaction;
    if (currentTransaction) {
        this.transactionPreview.classList.remove('hide');
        document.body.classList.add('transaction-preview-active');
    } else {
        this.transactionPreview.classList.add('hide');
        document.body.classList.remove('transaction-preview-active');
    }
}

function updateTransactionDetails() {
    const { currentTransaction } = globalStore.getState();

    if (!currentTransaction) return;

    const { fromAccount, merchant, amount } = currentTransaction;
    this.fromAccount.textContent = fromAccount;
    this.merchant.textContent = merchant;
    this.amount.textContent = `$${amount}`;
}
