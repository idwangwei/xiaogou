import {ngDecModule} from  './decoratorModule';
import DataPipe from './data_pipe';
import {bindActionCreators} from 'redux';

const EMPTY_SELECTOR_TYPE = "EMPTY_SELECTOR_TYPE";
const PATH_SELECTOR_TYPE = "PATH_SELECTOR_TYPE";
const FUNCTION_SELECTOR_TYPE = "FUNCTION_SELECTOR_TYPE";
const STR_SELECTOR_TYPE = "STR_SELECTOR_TYPE";


export function Inject(...dependences) {
    return (target)=> {
        function Wrapper(...args) {
            dependences.forEach((dep, idx)=> {
                if (dep == '$scope') {
                    target.prototype.getScope = function () {
                        return args[idx];
                    }
                } else if (dep == "$rootScope") {
                    target.prototype.getRootScope = function () {
                        return args[idx];
                    }
                } else if (dep == '$state') {
                    target.prototype.getStateService = function () {
                        return args[idx];
                    }
                } else {
                    target.prototype[dep] = args[idx];
                }
            });
            target.$inject = dependences;
            target.instance = new target(...args);
            return  target.instance;
        }

        Wrapper.prototype = target.prototype;
        Wrapper.$inject = dependences;
        return Wrapper;
    }
}
export function View(stateName, stateConfig) {
    return (target)=> {
        ngDecModule.config(['$stateProvider', ($stateProvider)=> {
            $stateProvider.state(stateName, stateConfig);
        }]);
        function Wrapper(...args) {

            let viewCtrlInstance = new target(...args);
            let noop = ()=>null;
            let viewHooks = { //定义视图的钩子函数
                initFlags: noop,
                initData: noop,
                mapStateToThis: noop,
                mapActionToThis: noop,
                componentWillReceiveProps: noop,
                onBeforeEnterView: noop,
                onAfterEnterView: noop,
                onBeforeLeaveView: noop,
                onLoadedView: noop,
                onUpdate: noop,
                configDataPipe: noop,
                onReceiveProps: noop,
                // back:noop,//页面左上角的钩子
            };
            let viewProps = {
                viewEntered: false,
                hasPageRefreshManger: false,
                dataPipe: new DataPipe()
            };
            let disconnect = noop;
            let unWatch = noop;
            Object.keys(viewHooks).forEach((key)=> {
                if (!viewCtrlInstance[key])
                    viewCtrlInstance[key] = viewHooks[key];
            });
            Object.assign(viewCtrlInstance, viewProps);

            viewCtrlInstance.configDataPipe();

            let $scope = viewCtrlInstance.getScope();
            if (!$scope)
                throw new Error('$scope must be injected with Decorator "@View"');
            let $ngRedux = viewCtrlInstance.$ngRedux;
            if (!$ngRedux)
                throw new Error('$ngRedux must be injected with Decorator "@View"');
            let pageRefreshManager = viewCtrlInstance.pageRefreshManager;
            if (!viewCtrlInstance.getStateService) {
                throw new Error('$state is required with pageRefreshManager');
            }
            viewCtrlInstance.go = function (state, params) {
                viewCtrlInstance.viewEntered = false;
                viewCtrlInstance.getStateService().go(state, params);
            };
            if (pageRefreshManager && pageRefreshManager.getListenerName) {
                viewCtrlInstance.hasPageRefreshManger = true;

                //如果注入了hasPageRefreshManger，则要监听来自hasPageRefreshManger的更新消息
                if (viewCtrlInstance.hasPageRefreshManger) {
                    let $state = viewCtrlInstance.getStateService();
                    unWatch = $scope.$on(pageRefreshManager.getListenerName($state.current, $state.params), (ev, data) => {
                        if (pageRefreshManager.shouldUpdate($state, data.url)) {
                            viewCtrlInstance.onUpdate();
                        }
                    });
                }
            }

            //添加 $ionicView.beforeEnter
            let unWatchBeforeEnterView = $scope.$on('$ionicView.beforeEnter', () => {
                viewCtrlInstance.onBeforeEnterView();
                //添加 返回按键事件
                // console.error(viewCtrlInstance.back)
                if(viewCtrlInstance.getRootScope&&viewCtrlInstance.back){
                    let $rootScope=viewCtrlInstance.getRootScope();
                    console.log(viewCtrlInstance.back)
                    $rootScope.viewGoBack=viewCtrlInstance.back.bind(viewCtrlInstance);
                }
            });
            //添加 $ionicView.beforeLeave事件监听
            let unWatchBeforeLeaveView = $scope.$on('$ionicView.beforeLeave', () => {
                disconnect();
                viewCtrlInstance.viewEntered = false;
                viewCtrlInstance.onBeforeLeaveView();
            });
            let unWatchOnLoadedView = $scope.$on('$ionicView.loaded', () => {
                viewCtrlInstance.onLoadedView();
            });
            //添加 $ionicView.afterEnter事件监听
            let unWatchAfterEnterView = $scope.$on('$ionicView.afterEnter', () => {
                $scope.$evalAsync(() => {
                    viewCtrlInstance.viewEntered = true;
                    disconnect = $ngRedux.connect(viewCtrlInstance.selectorList ? viewCtrlInstance.selectorList : viewCtrlInstance.mapStateToThis
                        , viewCtrlInstance.mapActionToThis()
                        , viewCtrlInstance)
                    ((selectedState, selectedAction) => {
                        if (!viewCtrlInstance.viewEntered) return;
                        Object.assign(viewCtrlInstance, selectedState, selectedAction);
                        viewCtrlInstance.dataPipe.run(viewCtrlInstance);
                        $scope.$evalAsync(() => {
                            viewCtrlInstance.onReceiveProps(selectedState, selectedAction);
                        });
                    });
                    viewCtrlInstance.onAfterEnterView();
                });
            });
            $scope.$on('$destroy', () => {
                disconnect();
                unWatch();
                unWatchAfterEnterView();
                unWatchBeforeEnterView();
                unWatchBeforeLeaveView();
                unWatchOnLoadedView();
            });

            return viewCtrlInstance;
        }

        Wrapper.prototype = target.prototype;
        Wrapper.$inject = target.$inject;
        return Wrapper;
    };
}

export function Directive(config) {
    return (target)=> {
        if (!config.selector) {
            throw new Error('selector must be provided!');
        }
        config.controller = target;
        if (!config.controllerAs)
            config.controllerAs = "ctrl";
        ngDecModule.directive(config.selector, function () {
            return config
        });
    }
}

export function Component(config) {
    return (target)=> {
        target.controller = target;
        ngDecModule.component(config.selector, config)
    }
}
/**
 * 收集从ng-redux获取数据的相关配置
 * @param selector
 * @returns {function()}
 * @constructor
 */
export function select(selector) {

    return (target, key, descriptor)=> {
        descriptor.writable = true;
        if (!target.selectorList)target.selectorList = [];
        if (!selector) {
            target.selectorList.push({type: EMPTY_SELECTOR_TYPE, key: key});
        } else if (typeof selector === "string") {
            target.selectorList.push({type: STR_SELECTOR_TYPE, key: key, selector: selector});
        } else if (selector instanceof Array) {
            target.selectorList.push({type: PATH_SELECTOR_TYPE, key: key, selector: selector});
        } else if (selector instanceof Function) {
            target.selectorList.push({type: FUNCTION_SELECTOR_TYPE, key: key, selector: selector});
        } else {
            throw new Error('unknown selector type!');
        }
    }
}
/**
 * 该decorator使service的某个方法可以 getState和dispatch action
 * @param target
 * @param key
 * @param descriptor
 * @returns {*}
 */
export function actionCreator(target, key, descriptor) {
    let method = descriptor.value;
    let ret;
    descriptor.value = (...args)=> {
        let $ngRedux = target.$ngRedux;
        if (!$ngRedux)
            throw new Error('$ngRedux is required by decorator @actionCreator');
        let nextMethod = bindActionCreators(method.bind(target.constructor.instance), $ngRedux.dispatch);
        ret = nextMethod.apply(target, args);
        return ret;
    };
    return descriptor;
}


