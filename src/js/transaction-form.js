const globalStore = require('./globalStore');

module.exports = {
    init() {
        this.form = document.querySelector('#transaction-form');
        this.inputs = this.form.querySelectorAll('input');
        this.submitButton = this.form.querySelector('#submit-button');

        onStateChange(this.inputs);
        clearForm(this.inputs);
        addInputEvents(this.inputs);
        this.form.addEventListener('submit', handleSubmit.bind(this));
        document.addEventListener('changed.toAccountValid', validateForm.bind(this));
        document.addEventListener('changed.amountValid', validateForm.bind(this));
    },
};

const defaultState = {
    fromAccount: 'Free Checking(4692) - $5824.76',
    toAccount: '',
    amount: '',
    toAccountValid: false,
    amountValid: false,
};

const store = {
    state: {},

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

function onStateChange(inputs) {
    handleInputStateChange('fromAccount', inputs);
    handleInputStateChange('toAccount', inputs);
    handleInputStateChange('amount', inputs);
}

function handleInputStateChange(key, inputs) {
    document.addEventListener(`changed.${key}`, () => {
        const state = store.getState();
        const value = state[key];
        const input = Array.from(inputs).filter(input => input.id === key)[0];
        input.value = value;
    });
}

function isEmpty(value) {
    return value.trim() === '';
}

function isNumber(value) {
    const number = Number(value);
    return !isNaN(value) && number.toString() === value;
}

function validateForm() {
    const { toAccountValid, amountValid } = store.getState();
    if (toAccountValid && amountValid) {
        this.submitButton.removeAttribute('disabled');
    } else {
        this.submitButton.setAttribute('disabled', 'disabled');
    }
}

function validateProperty(target) {
    const property = target.id;
    const value = target.value;
    let valid = !isEmpty(value);

    if (property === 'amount') {
        valid = valid && isNumber(value);
    }

    let action = valid ? 'remove' : 'add';

    target.classList[action]('invalid');
    store.setState({ [`${property}Valid`]: valid });
}

function addInputEvents(inputs) {
    const inputsNumber = inputs.length;

    for (let i = 0; i < inputsNumber; i++) {
        inputs[i].addEventListener('input', handleInput);
    }
}

function handleInput(e) {
    const id = e.target.id;
    const value = e.target.value;
    validateProperty(e.target);
    store.setState({ [id]: value });
}

function handleSubmit(e) {
    e.preventDefault();
    const state = store.getState();
    globalStore.setState({currenttransaction: state});
    clearForm(this.inputs);
}

function clearForm(inputs) {
    const inputsNumber = inputs.length;

    for (let i = 0; i < inputsNumber; i++) {
        inputs[i].value = '';
    }
    store.setState(defaultState);
}
