const transactionsData = require('./data/transactions').data;

module.exports = {
    state: {
        balance: 1000,
        currentTransaction: null,
        transactions: transactionsData
    },

    getState() {
        return {...this.state};
    },

    setState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };

        Object.keys(newState).forEach(key => {
            if (newState.hasOwnProperty(key)) {
                const event = new Event(`changed.${key}`);
                document.dispatchEvent(event);
            }
        });
    }
};
