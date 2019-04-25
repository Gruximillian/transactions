const globalStore = require('./globalStore');
const merchantData = require('./data/merchant-list').data;

module.exports = {
    init() {
        this.form = document.querySelector('#transaction-form');
        this.inputs = this.form.querySelectorAll('input');
        this.submitButton = this.form.querySelector('#submit-button');

        onStateChange(this.inputs);
        clearForm(this.inputs);
        addInputEvents(this.inputs);

        this.form.addEventListener('submit', handleSubmit.bind(this));
        document.addEventListener('changed.merchantValid', validateForm.bind(this));
        document.addEventListener('changed.amountValid', validateForm.bind(this));
        document.addEventListener('changed.currentTransaction', toggleForm.bind(this));
        document.addEventListener('changed.balance', () => clearForm(this.inputs));
    },
};

const defaultState = {
    fromAccount: 'Free Checking(4692) - ${{balance}}',
    merchant: '',
    amount: '',
    merchantValid: false,
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
    handleInputStateChange('merchant', inputs);
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

function isNumber(value) {
    const isFloat = value.indexOf('.') !== -1;
    const decimalPart = isFloat && value.split('.')[1];
    const decimals = decimalPart && decimalPart.length;
    const number = isFloat ? parseFloat(value).toFixed(decimals) : parseInt(value);

    return !isNaN(value) && number.toString() === value;
}

function isValidAmount(value) {
    const balance = globalStore.getState().balance;
    const number = Number(value);
    return number > 0 && number <= 500 && number <= balance;
}

function isValidMerchant(value) {
    return merchantData.some(data => data.merchant === value)
}

function validateForm() {
    const { merchantValid, amountValid } = store.getState();
    if (merchantValid && amountValid) {
        this.submitButton.removeAttribute('disabled');
    } else {
        this.submitButton.setAttribute('disabled', 'disabled');
    }
}

function validateProperty(target) {
    const property = target.id;
    const value = target.value;
    let valid = value.trim() !== '';

    if (property === 'merchant') {
        valid = valid && isValidMerchant(value);
    }

    if (property === 'amount') {
        valid = valid && isNumber(value) && isValidAmount(value);
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
    const { fromAccount, merchant, amount } = store.getState();
    const transaction = {
        fromAccount,
        merchant,
        amount
    };
    globalStore.setState({ currentTransaction: transaction });
}

function toggleForm() {
    const currentTransaction = globalStore.getState().currentTransaction;
    if (currentTransaction) {
        this.form.classList.add('hide');
    } else {
        this.form.classList.remove('hide');
    }
}

function clearForm(inputs) {
    const inputsNumber = inputs.length;

    for (let i = 0; i < inputsNumber; i++) {
        inputs[i].value = '';
    }

    store.setState({
        ...defaultState,
        fromAccount: defaultState.fromAccount.replace('{{balance}}', globalStore.getState().balance)
    });
}
