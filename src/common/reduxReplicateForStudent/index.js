/**
 * Creates a Redux store enhancer designed to replicate actions and states.
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
let replicate = ({key, reducerKeys, replicator}) => {
    return next => (reducer, initialState, enhancer) => {
        let store = next(replicatedReducer, initialState, enhancer);
        let nextState = null;
        store.mergeDefaultStates = replicator.mergeDefaultStates;
        if (!store.onReady) {
            store.readyCallbacks = [];
            store.onReady = readyCallback => {
                store.readyCallbacks.push(readyCallback);
            };
        }
        if (!store.setKey) {
            store.setKey = (newKey, readyCallback) => {
                key = newKey;
                store.key = key;

                if (readyCallback) {
                    store.onReady(readyCallback);
                }
                getInitialState(key);
            };
        }
        if (!store.setState) {
            store.setState = state => {
                nextState = state;
                store.replaceReducer(replicatedReducer);
            };
        }
        store.update = (reducer, defaultStates, readyCallback) => {
            if (replicator.mergeDefaultStates)
                replicator.mergeDefaultStates(defaultStates);
            getInitialState(key, defaultStates, reducer);
            store.onReady(readyCallback);
        };

        function getInitialState(gettingKey, defaultStates, rd) {
            store.initializedReplication = false;
            store.onReady(() => {
                store.initializedReplication = true;
            });
            if (store.initializingReplication) {
                store.initializingReplication++;
            } else {
                store.initializingReplication = 1;
            }

            let actualInitialState = reducerKeys ? {} : null;
            let setInitialState = false;
            let initialReducerKeys = reducerKeys;
            if (rd) {
                reducerKeys = Object.keys(rd);
                initialReducerKeys = reducerKeys;
            } else {
                reducerKeys = Object.keys(store.getState());
                initialReducerKeys = reducerKeys;
            }
            let semaphore = initialReducerKeys.length;

            function clear() {
                if (--semaphore === 0) {
                    if (setInitialState) {
                        store.setState(Object.assign({}, store.getState(), actualInitialState));
                    }
                    if (--store.initializingReplication === 0)
                        while (store.readyCallbacks.length) {
                            store.readyCallbacks.shift()(store.key, store);
                        }
                }
            }

            for (let reducerKey of initialReducerKeys) {
                replicator.getInitialState({key, reducerKey}, state => {
                    // console.log(`同步本地字段${reducerKey}`);
                    if (gettingKey === key && typeof state !== 'undefined') {
                        actualInitialState[reducerKey] = state;
                        setInitialState = true;
                    }
                    clear();
                });
            }


        }

        function mergeNextState(state) {
            if (reducerKeys) {
                state = Object.assign({}, state, nextState);
            } else {
                state = nextState;
            }

            nextState = null;
            return state;
        }

        function replicatedReducer(state, action) {
            const actualNextState = nextState
                ? reducer.reducer(mergeNextState(state), action)
                : reducer.reducer(state, action);
            reducerKeys = Object.keys(actualNextState);
            if (key && store && store.initializedReplication) {
                if (replicator.onStateChange) {
                    if (reducerKeys) {
                        for (let reducerKey of reducerKeys) {
                            if (state[reducerKey] !== actualNextState[reducerKey]) {
                                replicator.onStateChange(
                                    {key, reducerKey},
                                    state[reducerKey],
                                    actualNextState[reducerKey],
                                    action,
                                    store
                                );
                            }
                        }
                    } else if (state !== actualNextState) {
                        replicator.onStateChange(
                            {key}, state, actualNextState, action, store
                        );
                    }
                }
            }

            return actualNextState;
        }


        getInitialState(key);
        return store;
    };
};

export default replicate;