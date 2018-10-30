import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import invariant from 'invariant';

import isPlainObject from 'lodash.isplainobject';
import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';
import assign from 'lodash.assign';

const defaultMapStateToTarget = () => ({});
const defaultMapDispatchToTarget = dispatch => ({dispatch});

export default function Connector(store) {
  return (mapStateToTarget, mapDispatchToTarget, scope) => {
    let slice, finalMapStateToTarget;
    let useSelectorMap = mapStateToTarget instanceof Array;
    if (useSelectorMap) {
      slice = getStateSliceFromSelectorMap(store.getState(), mapStateToTarget, scope);
    } else {
      finalMapStateToTarget = mapStateToTarget || defaultMapStateToTarget;
      invariant(
          isFunction(finalMapStateToTarget),
          'mapStateToTarget must be a Function. Instead received %s.', finalMapStateToTarget
      );
      slice = getStateSlice(store.getState(), finalMapStateToTarget);
    }

    const finalMapDispatchToTarget = isPlainObject(mapDispatchToTarget) ?
        wrapActionCreators(mapDispatchToTarget) :
    mapDispatchToTarget || defaultMapDispatchToTarget;


    invariant(
        isPlainObject(finalMapDispatchToTarget) || isFunction(finalMapDispatchToTarget),
        'mapDispatchToTarget must be a plain Object or a Function. Instead received %s.', finalMapDispatchToTarget
    );


    const boundActionCreators = finalMapDispatchToTarget(store.dispatch);

    return (target) => {
      invariant(
          isFunction(target) || isObject(target),
          'The target parameter passed to connect must be a Function or a object.'
      );
      const unsubscribe = store.subscribe(() => {
        console.log('===============store subscribe=================');
        const nextSlice = useSelectorMap
            ? getStateSliceFromSelectorMap(store.getState(), mapStateToTarget, scope)
            : getStateSlice(store.getState(), finalMapStateToTarget);
        if (!shallowEqual(slice, nextSlice)) {
          slice = nextSlice;
          updateTarget(target, slice, boundActionCreators);
        }
      });
      //Initial update
      updateTarget(target, slice, boundActionCreators);
      return unsubscribe;
    }

  }
}

function updateTarget(target, StateSlice, dispatch) {
  if (isFunction(target)) {
    target(StateSlice, dispatch);
  } else {
    assign(target, StateSlice, dispatch);
  }
}

function getStateSlice(state, mapStateToScope) {
  const slice = mapStateToScope(state);

  invariant(
      isPlainObject(slice),
      '`mapStateToScope` must return an object. Instead received %s.',
      slice
  );

  return slice;
}

function getStateSliceFromSelectorMap(state, selectorMap, scope) {
  let slice = {};
  selectorMap.forEach(selectorItem=> {
    if (!selectorItem.selector)
      slice[selectorItem.key] = state[selectorItem.key];
    if (selectorItem.selector && selectorItem.selector instanceof Array) {
      slice[selectorItem.key] = ((secArray)=> {
        let rt = state;
        secArray.forEach(secItem=> {
          rt = rt[secItem];
        });
        return rt;
      })(selectorItem.selector);
    }
    if (selectorItem.selector && typeof selectorItem.selector === "string") {
      slice[selectorItem.key] = state[selectorItem.selector];
    }
    if (selectorItem.selector && selectorItem.selector instanceof Function) {
      slice[selectorItem.key] = selectorItem.selector.call(this, state, scope);
    }
  });
  return slice;
}
