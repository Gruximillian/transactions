const globalStore = require('./globalStore');
const transactionForm = require('./transaction-form');
const transactionPreview = require('./transaction-preview');

(function () {
    transactionForm.init();
    transactionPreview.init();
})();

