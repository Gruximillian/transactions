module.exports = {
    state: {
        currenttransaction: {}
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
                const event = new Event(`changed.${key.toLowerCase()}`);
                document.dispatchEvent(event);
            }
        });
    }
};
