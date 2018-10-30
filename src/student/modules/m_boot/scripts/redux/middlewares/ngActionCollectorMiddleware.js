/**
 * Created by 彭建伦 on 2016/4/21.
 */
window.collectedActions = [];
function ngActionCollectorMiddleware() {
    return store=>next=>action=> {
        if (action.type == '@@reduxUiRouter/$stateChangeStart')
            collectedActions.push(action.payload.toState.url);
        next(action);
    }
}
ngActionCollectorMiddleware.$inject = [];
angular.module('ngActionCollectorMiddleware', [])
    .factory('ngActionCollectorMiddleware', ngActionCollectorMiddleware);