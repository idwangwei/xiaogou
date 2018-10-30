/**
 * Created by 彭建伦 on 2016/4/29.
 */
import DataPipe from "./data_pipe";

export default class BaseController {
    constructor() {
        this.dataPipe = new DataPipe();
        this.initFlags = this.initFlags || this.noop;
        this.initData = this.initData || this.noop;
        this.configDataPipe = this.configDataPipe || this.noop;
        this.onReceiveProps = this.onReceiveProps || this.noop;
        this.getStateService = this.getStateService || this.noop;
        this.selectorList = this.selectorList ? this.selectorList : [];
        // this.back=this.back||this.noop;

        let injects = this.constructor.$inject;
        if (!injects || !(injects instanceof Array)) { //必须在class上指定“$inject”属性
            return console.error('the "$inject" property muse be specified on class ' + this.constructor.name);
        }
        this.setMethodsForInjects(arguments[0]);

        this.initFlags();
        this.initData();
        this.configDataPipe();

        let hasPageRefreshManger = false;
        let $ngRedux = this.$ngRedux;
        let $scope = this.getScope();
        let pageRefreshManager = this.pageRefreshManager;
        let $state = this.getStateService();
        if (!$ngRedux || !$ngRedux.connect)
            console.error('ngRedux is required!');
        if (!$scope || !$scope.$on)
            console.error('$scope is required!');
        if (pageRefreshManager && pageRefreshManager.getListenerName) {
            hasPageRefreshManger = true;
            if (!$state || !$state.current) {
                console.error('$state is required with pageRefreshManager');
            }
        }

        this.actions = {};
        this.viewEntered = false;//表示当前视图是否被激活
        //定义unwatch函数
        let unWatch = this.noop;
        let unWatchAfterEnterView = this.noop;
        let unWatchBeforeLeaveView = this.noop;
        let unWatchBeforeEnterView = this.noop;
        let unWatchOnLoadedView = this.noop;
        let unWatchOnEnterView = this.noop;
        let unWatchDirectiveView = this.noop;
        let disconnect = this.noop;
        this.$injector = this.getScope().$root.$injector;
        // this.tabItemService = this.$injector.get("tabItemService");
        //定义view hooks
        this.onBeforeEnterView = this.isFunction(this.onBeforeEnterView) ? this.onBeforeEnterView : this.noop;
        this.onAfterEnterView = this.isFunction(this.onAfterEnterView) ? this.onAfterEnterView : this.noop;
        this.onBeforeLeaveView = this.isFunction(this.onBeforeLeaveView) ? this.onBeforeLeaveView : this.noop;
        this.onLoadedView = this.isFunction(this.onLoadedView) ? this.onLoadedView : this.noop;
        this.onEnterView = this.isFunction(this.onEnterView) ? this.onEnterView : this.noop;

        // 定义与数据相关的hooks
        this.mapStateToThis = this.mapStateToThis || this.noop;
        this.mapActionToThis = this.mapActionToThis || this.noop;
        this.componentWillReceiveProps = this.componentWillReceiveProps || this.noop;


        //如果注入了hasPageRefreshManger，则要监听来自hasPageRefreshManger的更新消息
        if (hasPageRefreshManger)
            unWatch = $scope.$on(pageRefreshManager.getListenerName($state.current, $state.params), (ev, data) => {
                setTimeout(() => {
                    if (data.forceUpdate) return this.onUpdate();
                    if (pageRefreshManager.shouldUpdate($state, data.url)) {
                        this.onUpdate();
                    }
                }, 1000);

            });
        //添加 $ionicView.beforeEnter
        unWatchBeforeEnterView = $scope.$on('$ionicView.beforeEnter', (event, viewData) => {
            // if (this.constructor.name != "StuHomeCtrl") {
            //     this.tabItemService.hideAllTabs();
            // }
            this.onBeforeEnterView(event, viewData);
            //添加 返回按键事件
            // console.error(this.back)
            if (this.getRootScope && this.back) {
                let $rootScope = this.getRootScope();
                $rootScope.viewGoBack = this.back.bind(this);
            }
        });
        let connectFn = () => {
            //setTimeout(() => {
            this.mapStateObj = {
                selectorList: this.selectorList,
                mapStateToThis: this.mapStateToThis
            };
            $scope.$evalAsync(() => {
                this.viewEntered = true;
                disconnect = $ngRedux.connect(this.mapStateObj, this.mapActionToThis())((selectedState, selectedAction) => {
                    if (!this.viewEntered) return;
                    Object.assign(this, selectedState, selectedAction);
                    this.dataPipe.run(this);
                    $scope.$evalAsync(() => {
                        let LABEL = `${this.constructor.name} receive props....`;
                        // console.time(LABEL);
                        this.onReceiveProps(selectedState, selectedAction);
                        // console.timeEnd(LABEL);
                    });
                });
                this.onAfterEnterView();
            });
            //}, 100);
        };
        //添加 $ionicView.afterEnter事件监听
        unWatchAfterEnterView = $scope.$on('$ionicView.afterEnter', connectFn);
        //添加指令初始化redux的事件监听
        unWatchDirectiveView = $scope.$on('directive.redux.init', connectFn);
        //添加 $ionicView.beforeLeave事件监听
        unWatchBeforeLeaveView = $scope.$on('$ionicView.beforeLeave', () => {
            disconnect();
            this.viewEntered = false;
            this.onBeforeLeaveView();
        });

        unWatchOnLoadedView = $scope.$on('$ionicView.loaded', () => {
            this.onLoadedView();
        });
        unWatchOnEnterView = $scope.$on('$ionicView.enter', () => {
            this.onEnterView();
        });
        $scope.$on('$destroy', () => {
            disconnect();
            unWatch();
            unWatchAfterEnterView();
            unWatchBeforeEnterView();
            unWatchBeforeLeaveView();
            unWatchDirectiveView();
            unWatchOnLoadedView();
            unWatchOnEnterView();
        });
    }

    getState() {
        if (!this.$ngRedux)
            return console.error('$ngRedux is not found!');
        return this.$ngRedux.getState();
    }

    setMethodsForInjects(args) {
        let me = this;
        this.constructor.$inject.forEach((val, idx) => {
            if (val == '$scope') {
                me.getScope = function () {
                    return args[idx];
                }
            } else if (val == '$rootScope') {
                me.getRootScope = function () {
                    return args[idx];
                }
            } else if (val == '$state') {
                me.getStateService = function () {
                    return args[idx];
                }
            } else {
                me[val] = args[idx];
            }
        });
    }

    /**
     * 切换state
     * @param state 切换试图的state名称
     * @param navDirection 页面切换的方向 ["forward"|"back"] forward -> 从右往左切换 ，back -> 从左往右切换
     * @param params 路由参数
     */
    go(state, navDirection, params) {
        const DEFAULT_NAV_DIRECTION = "forward";
        if (!this.getStateService || !this.getStateService()) return console.error('$state service is not injected!');
        if (typeof navDirection != "string") {
            params = navDirection;
            navDirection = DEFAULT_NAV_DIRECTION;
        }
        let $ionicviewswitcher = this.$injector.get('$ionicViewSwitcher');
        this.viewEntered = false;
        if (navDirection != "none")
            $ionicviewswitcher.nextDirection(navDirection);
        else
            $ionicviewswitcher.nextDirection('none');
        this.getStateService().go(state, params);
    }

    isFunction(obj) {
        return typeof obj === "function";
    }

    noop() {
        return {};
    }
}
