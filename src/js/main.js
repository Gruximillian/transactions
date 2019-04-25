const globalStore = require('./globalStore');
const transactionForm = require('./transaction-form');

(function () {
    'use strict';

    transactionForm.init();
    // console.log('form', transactionForm.form);
    document.addEventListener('changed.currenttransaction', (e) => {
        // console.log('changed transaction', e);
        // console.log('store', globalStore.getState());
    });
})();

