/**
 * Created by 彭建伦 on 2016/4/29.
 */
export default class BaseController {
    constructor() {
        this.initFlags = this.initFlags || this.noop;
        this.initData = this.initData || this.noop;
        // this.back=this.back||this.noop;

        let injects = this.constructor.$inject;
        if (!injects || !(injects instanceof Array)) { //必须在class上指定“$inject”属性
            return console.error('the "$inject" property muse be specified on class ' + this.constructor.name);
        }
        this.setMethodsForInjects(arguments[0]);

        this.initFlags();
        this.initData();

        let hasPageRefreshManger = false;
        let $ngRedux = this.$ngRedux;
        let $scope = this.getScope();
        let pageRefreshManager = this.pageRefreshManager;
        let $state = this.$state;
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
        let disconnect = this.noop;
        //定义view hooks
        this.onBeforeEnterView = this.isFunction(this.onBeforeEnterView) ? this.onBeforeEnterView : this.noop;
        this.onAfterEnterView = this.isFunction(this.onAfterEnterView) ? this.onAfterEnterView : this.noop;
        this.onBeforeLeaveView = this.isFunction(this.onBeforeLeaveView) ? this.onBeforeLeaveView : this.noop;
        this.onLoadedView = this.isFunction(this.onLoadedView) ? this.onLoadedView : this.noop;

        // 定义与数据相关的hooks
        this.mapStateToThis = this.mapStateToThis.bind(this) || this.noop;
        this.mapActionToThis = this.mapActionToThis.bind(this) || this.noop;
        this.componentWillReceiveProps = this.componentWillReceiveProps || this.noop;


        //如果注入了hasPageRefreshManger，则要监听来自hasPageRefreshManger的更新消息
        if (hasPageRefreshManger)
            unWatch = $scope.$on(pageRefreshManager.getListenerName($state.current, $state.params), (ev, data) => {
                if (pageRefreshManager.shouldUpdate($state, data.url)) {
                    this.onUpdate();
                }
            });
        //添加 $ionicView.beforeEnter
        unWatchBeforeEnterView = $scope.$on('$ionicView.beforeEnter', () => {
            this.onBeforeEnterView();
            //添加 返回按键事件
            // console.error(this.back)

            if(this.getRootScope&&this.back){
                let $rootScope=this.getRootScope();
                $rootScope.viewGoBack=this.back.bind(this);
            }
        });
        //添加 $ionicView.afterEnter事件监听
        unWatchAfterEnterView = $scope.$on('$ionicView.afterEnter', () => {
            //setTimeout(() => {
            $scope.$evalAsync(() => {
                this.viewEntered = true;
                disconnect = $ngRedux.connect(this.mapStateToThis, this.mapActionToThis())((selectedState, selectedAction) => {
                    if (!this.viewEntered) return;
                    Object.assign(this, selectedState, selectedAction);
                    //console.log(selectedState);
                    $scope.$evalAsync(() => {
                        let LABEL = `${this.constructor.name} receive props....`;
                        console.time(LABEL);
                        this.onReceiveProps(selectedState, selectedAction);
                        console.timeEnd(LABEL);
                    });
                });
                this.onAfterEnterView();
            });
            //}, 100);
        });
        //添加 $ionicView.beforeLeave事件监听
        unWatchBeforeLeaveView = $scope.$on('$ionicView.beforeLeave', () => {
            disconnect();
            this.viewEntered = false;
            this.onBeforeLeaveView();
        });

        unWatchOnLoadedView = $scope.$on('$ionicView.loaded', () => {
            this.onLoadedView();
        });
        $scope.$on('$destroy', () => {
            disconnect();
            unWatch();
            unWatchAfterEnterView();
            unWatchBeforeEnterView();
            unWatchBeforeLeaveView();
            unWatchOnLoadedView();
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
            } else if(val=='$state'){
                me.getStateService=function(){
                    return args[idx];
                }
            }else {
                me[val] = args[idx];
            }
        });
    }

    go(state, params) {
        if (!this.getStateService()) return console.error('$state service is not injected!');
        this.viewEntered = false;
        this.getStateService().go(state, params);
    }

    isFunction(obj) {
        return typeof obj === "function";
    }

    noop() {
        return {}
    }
}
