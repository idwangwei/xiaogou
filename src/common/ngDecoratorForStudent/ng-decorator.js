import {ngDecModule} from './decoratorModule';
import DataPipe from './data_pipe';
import {bindActionCreators} from 'redux';

const EMPTY_SELECTOR_TYPE = "EMPTY_SELECTOR_TYPE";
const PATH_SELECTOR_TYPE = "PATH_SELECTOR_TYPE";
const FUNCTION_SELECTOR_TYPE = "FUNCTION_SELECTOR_TYPE";
const STR_SELECTOR_TYPE = "STR_SELECTOR_TYPE";

let md = ngDecModule;
let reducers, defaultStates;
let handleInject = (dependences, target, args) => {
    dependences.forEach((dep, idx) => {
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
        } else if (dep == '$ngRedux') {
            /*兼容一起base_ctrl中的getState()*/
            target.prototype.getState = function () {
                return args[idx].getState();
            };
            target.prototype[dep] = args[idx];
        } else {
            target.prototype[dep] = args[idx];
        }
    });
};

export function registerModule(module, pReducers, pDefaultStates) {
    md = module;
    if (pReducers) reducers = pReducers;
    if (pDefaultStates) defaultStates = pDefaultStates;
    let injector = angular.element('body').injector();
    let rootScope = injector.get("$rootScope");
    let ngRedux = injector.get("$ngRedux");
    if (reducers && pDefaultStates) {
        if (!ngRedux) {
            console.error("$ngRedux not found!");
            rootScope[`${module.name}-storeReady`] = true;
        } else {
            ngRedux.mergeReducer(reducers, defaultStates).then(() => {
                console.log(`${module.name}-storeReady!!!!!!!!!!`);
                if(rootScope.$$listeners[`${module.name}-storeReady`]){
                    rootScope.$broadcast(`${module.name}-storeReady`);
                }else{
                    //如果merge操作先完成 那么直接inject
                    rootScope[`${module.name}-storeReady`] = true;
                }
            });
        }
    } else {
        rootScope[`${module.name}-storeReady`] = true;
    }
}

export function Inject(...dependences) {
    return (target) => {
        function Wrapper(...args) {
            handleInject(dependences, target, args);
            target.$inject = dependences;
            target.instance = new target(...args);
            return target.instance;
        }

        Wrapper.prototype = target.prototype;
        Wrapper.$inject = dependences;
        return Wrapper;
    }
}

export function ViewDecorator(viewName, config) {
    return (target) => {
        let getViewController = (ev) => {
            // let viewCtrl = null;
            // angular.element('ion-view').each(function () {
            //     let ctrl = angular.element(this).scope().ctrl
            //     if (ctrl && ctrl.constructor && ctrl.constructor.name.toUpperCase() === controllerName.toUpperCase()) viewCtrl = ctrl;
            // });
            // return viewCtrl;
            return ev.targetScope.ctrl;
        };
        let decorateObject = (targetObj, obj) => {
            let keys = Object.keys(obj).concat(Object.getOwnPropertyNames(obj.__proto__));
            keys.forEach(key => {
                if (key === 'constructor') return;
                if (!targetObj[key]) targetObj[key] = obj[key];
                else {
                    if (angular.isFunction(targetObj[key]) && angular.isFunction(obj[key])) {
                        let fn = targetObj[key];
                        targetObj[key] = function () {
                            fn.call(this, arguments).then(() => {
                                obj[key].call(this, arguments);
                            });
                        }
                    } else {
                        targetObj[key] = obj[key];
                    }
                }
            });
        };
        md.run(['$rootScope', '$injector', function ($rootScope, $injector) {
            $rootScope.$on('$ionicView.loaded', function (ev, toState) {
                if (toState.stateName === viewName) {
                    let viewCtrl = getViewController(ev);
                    let obj = new target();
                    if (config.inject && config.inject.length) {
                        config.inject.forEach((name) => {
                            obj[name] = $injector.get(name);
                        });
                    }
                    decorateObject(viewCtrl, obj);
                }
            })
        }]);
    }
}

export function View(stateName, stateConfig) {
    return (target) => {
        function Wrapper(...args) {
            if (stateConfig.inject && stateConfig.inject.length) {
                handleInject(stateConfig.inject, target, args);
            }
            let viewCtrlInstance = new target(...args);
            viewCtrlInstance.selectorList = viewCtrlInstance.selectorList ? viewCtrlInstance.selectorList : [];
            let noop = () => {
            };
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
            Object.keys(viewHooks).forEach((key) => {
                if (!viewCtrlInstance[key])
                    viewCtrlInstance[key] = viewHooks[key];
            });
            Object.assign(viewCtrlInstance, viewProps);

            viewCtrlInstance.configDataPipe();
            viewCtrlInstance.mapStateObj = {
                selectorList: viewCtrlInstance.selectorList,
                mapStateToThis: viewCtrlInstance.mapStateToThis
            };

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
            viewCtrlInstance.go = function (state, navDirection, params) {
                const DEFAULT_NAV_DIRECTION = "forward";
                if (!viewCtrlInstance.getStateService || !viewCtrlInstance.getStateService()) return console.error('$state service is not injected!');
                if (typeof navDirection != "string") {
                    params = navDirection;
                    navDirection = DEFAULT_NAV_DIRECTION;
                }
                let $ionicviewswitcher = viewCtrlInstance.$injector.get('$ionicViewSwitcher');
                viewCtrlInstance.viewEntered = false;
                if (navDirection != "none")
                    $ionicviewswitcher.nextDirection(navDirection);
                else
                    $ionicviewswitcher.nextDirection('none');
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
                if (viewCtrlInstance.getRootScope && viewCtrlInstance.back) {
                    let $rootScope = viewCtrlInstance.getRootScope();
                    $rootScope.viewGoBack = viewCtrlInstance.back.bind(viewCtrlInstance);
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
                    disconnect = $ngRedux.connect(viewCtrlInstance.mapStateObj, viewCtrlInstance.mapActionToThis()
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
        if (stateConfig.inject && stateConfig.inject.length) {
            Wrapper.$inject = stateConfig.inject;
        }
        Wrapper.$inject.push("$injector");
        md.config(['$stateProvider', ($stateProvider) => {
            if (stateConfig.views) {
                let key = Object.keys(stateConfig.views)[0];
                let configObj = stateConfig.views[key];
                configObj.controller = Wrapper;
                configObj.controllerAs = configObj.controllerAs || "ctrl";
            } else {
                stateConfig.controller = Wrapper;
                stateConfig.controllerAs = stateConfig.controllerAs || "ctrl";
            }
            $stateProvider.state(stateName, stateConfig);
        }]);
        return Wrapper;
    };
}

export function Directive(config) {
    return (target) => {
        if (!config.selector) {
            throw new Error('selector must be provided!');
        }
        config.controller = target;
        if (!config.controllerAs)
            config.controllerAs = "ctrl";
        md.directive(config.selector, function () {
            return config
        });
    }
}

export function Component(config) {
    return (target) => {
        target.controller = target;
        md.component(config.selector, config)
    }
}

/**
 * 收集从ng-redux获取数据的相关配置
 * @param selector
 * @returns {function()}
 * @constructor
 */
export function select(selector) {
    return (target, key, descriptor) => {
        descriptor.writable = true;
        if (!target.selectorList) target.selectorList = [];
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
    descriptor.value = (...args) => {
        let $ngRedux = target.$ngRedux;
        if (!$ngRedux)
            throw new Error('$ngRedux is required by decorator @actionCreator');
        let nextMethod = bindActionCreators(method.bind(target.constructor.instance), $ngRedux.dispatch);
        ret = nextMethod.apply(target, args);
        return ret;
    };
    return descriptor;
}

/**
 * 向ng模块上注册常量
 * @param name 常量名
 * @param obj
 * @returns {function(*)}
 * @constructor
 */
export function Constant(name, obj) {
    return (target) => {
        md.constant(name, obj);
    }
}

/**
 * 向ng模块上注册service
 * @param name 服务名称
 * @returns {function(*)}
 * @constructor
 */
export function Service(name, config) {
    return target => {
        if (config && config.inject && config.inject.length)
            target.$inject = config.inject;
        md.service(name, target);
    }
}


/**
 * 向被修饰的function中注入Promise.resolve,并返回promise
 * @param target
 * @param key
 * @param descriptor
 * @returns {*}
 */
export function PromiseFn(target, key, descriptor) {
    let method = descriptor.value;
    descriptor.value = function () {
        let scope = this;
        return new Promise(resolve => {
            method.call(scope, resolve);
        })
    };
    return descriptor;
}

