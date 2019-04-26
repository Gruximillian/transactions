const transactionForm = require('./transaction-form');
const transactionPreview = require('./transaction-preview');
const transactionPanel = require('./transaction-panel');

(function () {
    transactionForm.init();
    transactionPreview.init();
    transactionPanel.init();

    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
    });
})();

