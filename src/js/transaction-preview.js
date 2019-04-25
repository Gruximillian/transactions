const globalStore = require('./globalStore');
const merchantData = require('./data/merchant-list').data;
const transactionsData = require('./data/transactions').data;

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
    const { balance, currentTransaction: { amount } } = globalStore.getState();
    const newBalance = balance * 100 - amount * 100;
    globalStore.setState({
        balance: newBalance / 100,
        currentTransaction: null
    });
}

function cancelTransaction() {
    globalStore.setState({ currentTransaction: null });
}

function toggleTransactionPreview() {
    const currentTransaction = globalStore.getState().currentTransaction;
    if (currentTransaction) {
        this.transactionPreview.classList.remove('hide');
    } else {
        this.transactionPreview.classList.add('hide');
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
