module.exports = {
    state: {
        balance: 1000,
        currentTransaction: null
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
