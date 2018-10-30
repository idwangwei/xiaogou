import 'ionicJS';
import 'ionicCss';
import "babel-polyfill";
import './routes';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import userManifest from './user_manifest';
import app from './app';
import {appModule,rootReducers} from './app';
import * as defaultStates from './redux/default_states/index';
import {bindActionCreators, applyMiddleware, compose} from 'redux';
// import replicate from 'reduxReplicate/index';
// import localforage from 'reduxReplicateLocalforage';
import replicate from 'reduxReplicateForStudent/index';
import localforage from 'reduxReplicateLocalforageForStudent';

import moduleBundleMap from 'module_bundle_map';

const LOCAL_STORAGE_STATE_INFO = "LOCAL_STORAGE_STATE_INFO";
const SYSTEM_LOGIN_STATE = "system_login";
const REMEMBER_ROUTE_LIST = ["home.work_list","home.pub_game_list","home.compute",
    "home.diagnose","home.clazz_manage","home.me", 'random-choice','home.math_oly'];
const REMEMBER_TOP_TABS_ROUTE_LIST = ["home.work_list","home.pub_game_list","home.compute","home.diagnose", 'random-choice'];
let key = '_INITIAL_KEY_';
let reducerKeys = true;
let replicator = localforage;
replicator.setDefaultStates(defaultStates);
const replication = replicate({key, reducerKeys, replicator});

function ConfigNeRedux($ngReduxProvider) {
    $ngReduxProvider.createStoreWith(rootReducers
        , [thunk, createLogger({duration: true})]
        , [replication]);
}
function ConfigTabPositionAndViewCache($ionicConfigProvider,$rootScopeProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.views.maxCache(1);//禁用页面缓存，数字表示最大的缓存的页面数
    $ionicConfigProvider.views.swipeBackEnabled(false);//禁止侧滑后退事件
    //$ionicConfigProvider.views.transition('none');
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    $rootScopeProvider.digestTtl(30);
}

function ConfigHttpProxy($httpProvider) {
    $httpProvider.interceptors.push('getRequestURL');
    $httpProvider.interceptors.push('appendJSessionId');
    $httpProvider.interceptors.push('replaceHttps');
    $httpProvider.interceptors.push('userLogoutBySelf');
    $httpProvider.interceptors.push('userSessionTimeout');
    $httpProvider.interceptors.push('unExpectedServerError');
    $httpProvider.interceptors.push('userLoginInOtherPlace');
    //$httpProvider.interceptors.push('httpInterceptor');
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]'
            ? param(data)
            : data;
    }];
}

function HandleAutoLoginWhenBootstrap($ocLazyLoad, $ngRedux, $state, $ionicHistory,profileService,teacherProfileService, $rootScope, serverInterface) {
    let readyHandler = ()=> {
        let state = $ngRedux.getState();
        let user = state.profile_user_auth.user;

        let logoutByUser = state.profile_user_auth.logoutByUser;
        $rootScope.user = user;
        //去登录界面
        let goToLoginState = ()=> {
            Promise.all([$ocLazyLoad.load('t_global'),$ocLazyLoad.load('t_home'),$ocLazyLoad.load('t_user_auth')]).then(()=>{
                let firstGoToRegister=window.localStorage.getItem('firstGoToRegister');
                if(firstGoToRegister){
                    window.localStorage.removeItem('firstGoToRegister');
                    $state.go('register');
                }else
                    $state.go(SYSTEM_LOGIN_STATE);
                $rootScope.hideLoadingScene();
            });
        };
        //回到上一次退出程序时的界面
        let goToLastState = (loginSuccess)=> {
            if(!loginSuccess){
                goToLoginState();
                return
            }
            let stateInfoStr = localStorage.getItem(LOCAL_STORAGE_STATE_INFO);
            let isCameFromGame = localStorage.getItem('IS_COME_FROM_GAME');
            let stateModuleMap = {
                'home.work_list':'t_home_teaching_work',
                'chapter_game_list':'t_game',
                'home.compute':'t_compute',
                'home.me':'t_me',
            };
            if(isCameFromGame){
                localStorage.setItem('IS_COME_FROM_GAME', '');
                Promise.all([$ocLazyLoad.load('t_home'),$ocLazyLoad.load('t_global')]).then(()=>{
                    Promise.race([$ocLazyLoad.load(stateModuleMap[JSON.parse(isCameFromGame)]),new Promise((resolve,reject)=>{setTimeout(()=>{reject()},2000)})]).then(()=>{
                        $state.go(JSON.parse(isCameFromGame));
                    },()=>{
                        $state.go("home.work_list")
                    })
                })
            }
            try {
                //todo 模块区分后再分别加载对应的界面模块和其依赖的模块
                let stateInfo = JSON.parse(stateInfoStr);

                if(stateModuleMap[stateInfo.name]){
                    Promise.all([$ocLazyLoad.load('t_global'),$ocLazyLoad.load('t_home'),$ocLazyLoad.load(stateModuleMap[stateInfo.name])]).then(()=> {
                        $state.go(stateInfo.name, stateInfo.toStateParams);
                        $rootScope.hideLoadingScene();
                    });
                }else {
                    Promise.all([$ocLazyLoad.load('t_global'),$ocLazyLoad.load('t_home'),$ocLazyLoad.load(stateModuleMap['home.work_list'])]).then(()=> {
                        $state.go("home.work_list");
                        $rootScope.hideLoadingScene();
                    });
                    $rootScope.hideLoadingScene();
                }
            } catch (e) {
                goToLoginState();
            }
        };

        if (user && user.loginName && !logoutByUser) {
            if (!$rootScope.sessionID)$rootScope.sessionID = user.jsessionid;
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            teacherProfileService.handleLogin({}, (param)=> goToLastState(param),$rootScope,true);
        } else {
            goToLoginState();
        }
    };
    $rootScope.ip = serverInterface.CLOUD_IP;//默认云端网络
    //TODO: 需要区分学生和老师
    if (userManifest.defaultUser == userManifest.NONE_USER)
        $ngRedux.setKey(key, readyHandler);
    else
        $ngRedux.setKey(userManifest.defaultUser, readyHandler);
}
function HandleStateChange($rootScope, $timeout, pageRefreshManager) {
    //每一次切换路由时将路由信息保存到localstorage
    let saveStateToLocalStorage = (toState, toStateParams)=> {
        let stateInfo = {
            name: toState.name,
            toStateParams: toStateParams
        };

        //只有下面这些路由才缓存
        if (REMEMBER_ROUTE_LIST.indexOf(stateInfo.name) > -1)
            localStorage.setItem(LOCAL_STORAGE_STATE_INFO, JSON.stringify(stateInfo));

        //保存顶部tabs的最新的route,再次回到相应的底部tab时显示最新的顶部tab页
        if (REMEMBER_TOP_TABS_ROUTE_LIST.indexOf(stateInfo.name) > -1){
            $rootScope.studyStateLastStateUrl = stateInfo.name;
            localStorage.setItem('studyStateLastStateUrl',JSON.stringify(stateInfo.name));
        }
    };

    $rootScope.$on('$stateChangeSuccess', function (ev, toState, toStateParams) {
        $timeout(function () {
            pageRefreshManager.updateOrCollectStateUrl(toState, toStateParams);
            saveStateToLocalStorage(toState, toStateParams);
        }, 50);
        if(toState.name == SYSTEM_LOGIN_STATE){
            $rootScope.isShowSetting = false;
        }else{
            $rootScope.isShowSetting = true;
        }
    });
}

function DisableHardwareBackButton($ionicPlatform,$ionicHistory,$ionicPopup,$rootScope,$location,$state) {
    $ionicPlatform.ready(function () {
        $ionicPlatform.registerBackButtonAction(function (e) {
            //阻止默认的行为
            e.preventDefault();
            //如果有新手引导直接禁用返回
            if($rootScope.isShowGuideFlag==true){
                return false;
            }
            //自定义返回
             if($rootScope.viewGoBack()=="exit"){
                // 退出app
                //ionic.Platform.exitApp();
             }
            return false;
        }, 101);
    });
}

function SetRootScopeInfo($rootScope, $ionicHistory, $state,$injector) {
    $rootScope.winInnerWidth = window.innerWidth;
    $rootScope.homeOrClazz = { type: 2 }; //云端还是课堂 1课堂|2家庭 默认为家庭
    $rootScope.$injector=$injector;
    $rootScope.loadImg = function (imgUrl) {
        return require('../tImages/' + imgUrl);
    };
    $rootScope.goBack = function () {
        $ionicHistory.goBack();
    };
    $rootScope.back = function () {
        $ionicHistory.goBack();
    };
    $rootScope.showLoadingScene = function () {
        window.loadingScene && window.loadingScene.show();
    };
    $rootScope.hideLoadingScene = function () {
        setTimeout(function () {
            window.loadingScene && window.loadingScene.hide();
        }, 500);
    };
    if (!$rootScope.modal) {//解决modal打开后不能进行页面跳转。
        $rootScope.modal = [];
    }


}

/*错误捕获方法 结合handleError.js*/
function myErrorCatch($provide) {
    $provide.decorator("$exceptionHandler", function ($delegate) {
        return function (exception, cause) {
            $delegate(exception, cause);
            if($("#handleErrorBox").children("p").length>30){
                $("#handleErrorBox").children("p").remove();
            }
            var txt="<p style='font-size: 12px;color: red;border-bottom: 1px solid #aaa;margin-bottom: 5px;word-break: break-all'><span style='color: yellow'>angular内部错误信息：</span><br/>"
            txt+="message: <br/>" + exception.message + "<br/>"
            txt+="stack: <br/><textarea style='width: 100%;min-height: 100px;border: 1px solid #fff;color: red'>" + exception.stack + "</textarea></p>"
            $("#handleErrorBox").append(txt);
        };
    });
}
app.config(['$ionicConfigProvider','$rootScopeProvider', ConfigTabPositionAndViewCache])
    .config(['$ngReduxProvider', ConfigNeRedux])
    .config(['$httpProvider', ConfigHttpProxy])
    .config(['$ocLazyLoadProvider',function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            modules: [
                {
                    name: 't_boot',
                    reconfig: true,
                    files: [moduleBundleMap['t_boot']]
                },
                {
                    name: 't_global',
                    reconfig: true,
                    files: [moduleBundleMap['t_global']]
                },
                {
                    name: 't_home',
                    reconfig: true,
                    files: [moduleBundleMap['t_home']]
                },
                {
                    name: 't_home_teaching_work',
                    reconfig: true,
                    files: [moduleBundleMap['t_home_teaching_work']]
                },
                {
                    name: 't_work_publish1',
                    reconfig: true,
                    files: [moduleBundleMap['t_work_publish1']]
                },
                {
                    name: 't_work_publish2',
                    reconfig: true,
                    files: [moduleBundleMap['t_work_publish2']]
                },
                {
                    name: 't_work_publish3',
                    reconfig: true,
                    files: [moduleBundleMap['t_work_publish3']]
                },
                {
                    name: 't_classes',
                    reconfig: true,
                    files: [moduleBundleMap['t_classes']]
                },
                {
                    name: 't_credits_store',
                    reconfig: true,
                    files: [moduleBundleMap['t_credits_store']]
                },
                {
                    name: 't_me',
                    reconfig: true,
                    files: [moduleBundleMap['t_me']]
                }, {
                    name: 't_work_publish4',
                    reconfig: true,
                    files: [moduleBundleMap['t_work_publish4']]
                }, {
                    name: 't_teacher_group',
                    reconfig: true,
                    files: [moduleBundleMap['t_teacher_group']]
                }, {
                    name: 't_game',
                    reconfig: true,
                    files: [moduleBundleMap['t_game']]
                }, {
                    name: 't_compute',
                    reconfig: true,
                    files: [moduleBundleMap['t_compute']]
                }, {
                    name: 't_diagnose',
                    reconfig: true,
                    files: [moduleBundleMap['t_diagnose']]
                }, {
                    name: 't_user_auth',
                    reconfig: true,
                    files: [moduleBundleMap['t_user_auth']]
                }, {
                    name: 't_area_evaluation',
                    reconfig: true,
                    files: [moduleBundleMap['t_area_evaluation']]
                }, {
                    name: 't_personal_qb',
                    reconfig: true,
                    files: [moduleBundleMap['t_personal_qb']]
                }, {
                    name: 't_online_teaching',
                    reconfig: true,
                    files: [moduleBundleMap['t_online_teaching']]
                }
            ]
        });
    }])
    .config(myErrorCatch)
    .run(['$rootScope', '$timeout', 'pageRefreshManager', HandleStateChange])
    .run(['$ionicPlatform','$ionicHistory','$ionicPopup','$rootScope','$location','$state', DisableHardwareBackButton])
    .run(['$rootScope', '$ionicHistory', '$state','$injector', SetRootScopeInfo])
    .run(['$ocLazyLoad','$ngRedux', '$state', '$ionicHistory','profileService', 'teacherProfileService','$rootScope', "serverInterface", HandleAutoLoginWhenBootstrap]);


ionic.Platform.ready(function () {
    angular.bootstrap(document, ['app']);
});
