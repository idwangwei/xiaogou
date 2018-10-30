import localforage from 'localforage';
import sha from 'sha-1';
let _stringify = JSON.stringify;
let _parse = JSON.parse;
const hasIDB = Boolean(
    typeof window !== 'undefined'
    && (
        window.indexedDB
        || window.mozIndexedDB
        || window.webkitIndexedDB
        || window.msIndexedDB
    )
);

const stringify = hasIDB ? value => value : _stringify;
const parse = hasIDB ? value => value : _parse;

const dataStore = window.dataStore = localforage.createInstance({name: 'data'});

const reading = {};
const writing = {};
const debounce = {};
let defaultStates = null;
let setDefaultStates = (ds) => {
    defaultStates = ds;
};
let mergeDefaultStates = (states) => {
    Object.assign(defaultStates, states);
};
const warn = typeof console !== 'undefined'
    ? console.warn.bind(console)
    : () => {
    };

function getItemKey(key, reducerKey) {
    if (reducerKey) {
        return `${key}/${reducerKey}`;
    }

    return key;
}

function getInitialState({key, reducerKey}, setState) {
    const itemKey = getItemKey(key, reducerKey);

    const handler = (error, state) => {
        if (error) {
            warn(error);
            setState();
        } else if (typeof state === 'undefined' || state === null) {
            setState(defaultStates[reducerKey]);
        } else {
            let parseState = parse(state);

            let processRegExp = new RegExp('ing$');
            if (parseState === true && processRegExp.test(reducerKey)) {
                parseState = defaultStates[reducerKey];
            }

            if (Object.prototype.toString.call(parseState) === "[object Object]") {
                for (var param in parseState) {
                    if (param && param.indexOf("Processing") != -1) {
                        if (!defaultStates[reducerKey]) {
                        }
                        parseState[param] = defaultStates[reducerKey][param];
                    }
                }
            }
            setState(parseState);
        }
    };

    if (reading[itemKey]) {
        reading[itemKey].push(handler);
    } else {
        reading[itemKey] = [handler];

        function clearHandlers(error, state) {
            if (typeof writing[itemKey] !== 'undefined') {
                state = writing[itemKey];
            }

            const handlers = reading[itemKey];
            delete reading[itemKey];
            while (handlers.length) {
                handlers.shift()(error, state);
            }
        }

        dataStore
            .getItem(itemKey)
            .then(state => {
                clearHandlers(null, state);
            })
            .catch(error => {
                clearHandlers(error);
            });
    }
}

function onStateChange({key, reducerKey}, state, nextState) {
    const itemKey = getItemKey(key, reducerKey);

    writing[itemKey] = nextState;

    clearTimeout(debounce[itemKey]);
    debounce[itemKey] = setTimeout(() => {
        nextState = writing[itemKey];
        delete writing[itemKey];
        dataStore
            .setItem(itemKey, stringify(nextState))
            .catch(warn);
    }, localforageReplicator.debounce);
}

const localforageReplicator = {
    getInitialState, onStateChange, setDefaultStates, mergeDefaultStates, debounce: 10
};

export default localforageReplicator;
