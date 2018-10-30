import 'ionicJS';
import 'ionicCss';
import '../less/theme01/app.less';
import './routes';
import 'debug_util';
import 'babel-polyfill';
import {m_boot, rootReducers} from './app';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import userManifest from './user_manifest';
import * as defaultStates from './redux/default_states/default_states';
import {bindActionCreators, applyMiddleware, compose} from 'redux';
import * as tasks from './redux/tasks/tasks';
import replicate from 'reduxReplicateForStudent/index';
import localforage from 'reduxReplicateLocalforageForStudent';
import DataPipe from 'base_components/data_pipe';
import * as STATE_NAME from './constants/state_name';
import logger from 'log_monitor';
import moduleBundleMap from 'module_bundle_map';


window.DataPipe = DataPipe;


const LOCAL_STORAGE_STATE_INFO = "LOCAL_STORAGE_STATE_INFO";
const SYSTEM_LOGIN_STATE = "system_login";
const DO_QUESTION_STATE = "do_question";
const WORK_PRAISE_DETAIL = "work_praise_detail";

let key = '_INITIAL_KEY_';
let reducerKeys = true;
let replicator = localforage;
replicator.setDefaultStates(defaultStates);
const replication = replicate({key, reducerKeys, replicator});

function ConfigNeRedux($ngReduxProvider) {

    $ngReduxProvider.createStoreWith(rootReducers
        , [thunk,  createLogger({duration: true})]
        , [replication]);
}

function ConfigWorkerRunner(ngWorkerRunnerProvider) {
    ngWorkerRunnerProvider.createRunner(tasks, './tasks_bundle.js');
    // ngWorkerRunnerProvider.createRunner(tasks, tasks_bundle);
}

function ConfigTabPositionAndViewCache($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.views.maxCache(1);//禁用页面缓存，数字表示最大的缓存的页面数
    $ionicConfigProvider.views.forwardCache(true);//禁用页面缓存，数字表示最大的缓存的页面数
    $ionicConfigProvider.views.swipeBackEnabled(false);//禁止侧滑后退事件
    //$ionicConfigProvider.views.transition('none');
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

}

function ConfigHttpProxy($httpProvider) {
    $httpProvider.interceptors.push('getRequestURL');
    $httpProvider.interceptors.push('appendJSessionId');
    $httpProvider.interceptors.push('appendTimeStamp');
    $httpProvider.interceptors.push('replaceHttps');
    $httpProvider.interceptors.push('userLogoutBySelf');
    $httpProvider.interceptors.push('userSessionTimeout');
    $httpProvider.interceptors.push('unExpectedServerError');
    $httpProvider.interceptors.push('userLoginInOtherPlace');
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    /* $httpProvider.defaults.headers.post['Content-Type'] = function (data) {
     return data.data.constructor === FormData
     ? 'multipart/form-data'
     : 'application/x-www-form-urlencoded';
     };*/
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

        return angular.isObject(data) && String(data) !== '[object File]' && (data.constructor != FormData)
            ? param(data)
            : data;
    }];
}


function HandleAutoLoginWhenBootstrap($ocLazyLoad,$ngRedux, $state, profileService, $rootScope, serverInterface, finalData) {
    let readyHandler = () => {
        let state = $ngRedux.getState();
        let user = state.profile_user_auth.user;
        let logoutByUser = state.profile_user_auth.logoutByUser;
        //去登录界面
        let goToLoginState = () => {
            Promise.all([$ocLazyLoad.load('m_user_auth'),$ocLazyLoad.load('m_global')]).then(()=>{
                $state.go('system_login');
                $rootScope.hideLoadingScene();
            })
        };
        //回到上一次退出程序时的界面
        let goToLastState = (loginSuccess) => {
            if (!loginSuccess) {
                goToLoginState();
                return;
            }
            let stateInfoStr = localStorage.getItem(LOCAL_STORAGE_STATE_INFO);
            let isCameFromGame = localStorage.getItem(finalData.IS_COME_FROM_GAME);
            let switchTo = JSON.parse(localStorage.getItem('switchTo'));
            let isCameFromGameParam = switchTo && switchTo.sPlayGame && switchTo.sPlayGame.param;
            try {
                if (isCameFromGame) {
                    localStorage.setItem(finalData.IS_COME_FROM_GAME, '');
                    let obj={
                        "home.game_list":"m_math_game",
                        "game_map_level":"m_game_map",
                        "home.compute":"m_compute",
                        'winter_camp_game':'m_winter_camp'
                    };
                    if(JSON.parse(isCameFromGame) == 'winter_camp_game'){
                        Promise.all([$ocLazyLoad.load('m_home'),$ocLazyLoad.load('m_global'),$ocLazyLoad.load('m_diagnose'),$ocLazyLoad.load('m_oral_calculation')]).then(()=>{
                            console.log("冬令营mark--------1")
                            Promise.race([$ocLazyLoad.load("m_winter_camp"),new Promise((resolve,reject)=>{setTimeout(()=>{reject()},2000)})]).then(()=>{
                                console.log("冬令营mark--------2")
                                $state.go("winter_camp_game",isCameFromGameParam);
                            },()=>{
                                $state.go("home.study_index")
                                console.log("冬令营mark--------3")
                            })
                        })
                    }else{
                        Promise.all([$ocLazyLoad.load('m_home'),$ocLazyLoad.load('m_global')]).then(()=>{
                            console.log("其他游戏mark--------1")
                            Promise.race([$ocLazyLoad.load(obj[JSON.parse(isCameFromGame)]),new Promise((resolve,reject)=>{setTimeout(()=>{reject()},2000)})]).then(()=>{
                                console.log("其他游戏mark--------2")
                                $state.go(JSON.parse(isCameFromGame), isCameFromGameParam);
                            },()=>{
                                $state.go("home.study_index")
                                console.log("其他游戏mark--------3")
                            })
                        })
                    }

                } else {
                    let stateInfo = JSON.parse(stateInfoStr);
                    let obj={
                        // "home.diagnose_pk":"m_diagnose_pk",
                        "home.me":"m_me",
                        "home.study_index":"m_home",
                        "home.improve":"m_improve",
                        "home.live_home":"m_live",
                    }
                    if(!obj[stateInfo.name]){
                        stateInfo={
                            name:"home.study_index",
                            toStateParams:{}
                        }
                    }
                    if(stateInfo.name=="home.me"||stateInfo.name=="home.improve"||stateInfo.name=="home.live_home"){
                        /*m_me依赖m_home  在ios上面由于不确定原因导致有不可预估的错误 所以保证m_home先于m_me加载,还有就是$ocLazyLoad.load可能不执行then*/
                        Promise.all([$ocLazyLoad.load('m_home'),$ocLazyLoad.load('m_global')]).then(()=>{
                            Promise.all([$ocLazyLoad.load(obj[stateInfo.name])]).then(()=>{
                                $state.go(stateInfo.name, stateInfo.toStateParams);
                            })
                        })
                    }else if(stateInfo.name=="home.study_index"){
                        Promise.all([$ocLazyLoad.load('m_global')]).then(()=>{
                            Promise.all([$ocLazyLoad.load(obj[stateInfo.name])]).then(()=>{
                                $state.go(stateInfo.name, stateInfo.toStateParams);
                            })
                        })
                    } else{
                        Promise.all([$ocLazyLoad.load(obj[stateInfo.name]),$ocLazyLoad.load('m_home'),$ocLazyLoad.load('m_global')]).then(()=>{
                            $state.go(stateInfo.name, stateInfo.toStateParams);
                        })
                    }

                }
                $rootScope.hideLoadingScene();
            } catch (e) {
                goToLoginState();
            }
        };
        //$rootScope.ip = serverInterface.CLOUD_IP;//默认云端网络
        if (user && user.loginName && !logoutByUser) {
            let login = bindActionCreators(profileService.handleLogin.bind(profileService), $ngRedux.dispatch);
            if (!$rootScope.sessionID) $rootScope.sessionID = user.jsessionid;
            login({}, (param) => goToLastState(param), null, true);
        } else {
            goToLoginState()
        }
    };
    window.loadingScene && window.loadingScene.show();
    // $state.go('system_login');
    $rootScope.ip = serverInterface.CLOUD_IP;//默认云端网络
    if (userManifest.defaultUser == userManifest.NONE_USER)
        $ngRedux.setKey(key, readyHandler);
    else
        $ngRedux.setKey(userManifest.defaultUser, readyHandler);
}

function HandleStateChange($rootScope, $timeout, pageRefreshManager) {
    //每一次切换路由时将路由信息保存到localstorage
    let saveStateToLocalStorage = (toState, toStateParams) => {
        let stateInfo = {
            name: toState.name,
            toStateParams: toStateParams
        };
        /*//做题和表扬明细不缓存跳转
         if (stateInfo.name != SYSTEM_LOGIN_STATE && stateInfo.name != DO_QUESTION_STATE&&stateInfo.name !=WORK_PRAISE_DETAIL)
         localStorage.setItem(LOCAL_STORAGE_STATE_INFO, JSON.stringify(stateInfo));*/

        //只有下面这些路由才缓存
        if (STATE_NAME.REMEMBER_ROUTE_LIST.indexOf(stateInfo.name) > -1)
            localStorage.setItem(LOCAL_STORAGE_STATE_INFO, JSON.stringify(stateInfo));
    };
    $rootScope.$on('$stateChangeSuccess', function (ev, toState, toStateParams) {
        $timeout(function () {
            pageRefreshManager.updateOrCollectStateUrl(toState, toStateParams);
            saveStateToLocalStorage(toState, toStateParams);
        }, 50);

        if (toState.name !== 'home.diagnose_pk') {
            $rootScope.bgMusic && $rootScope.bgMusic.pause();
        }

        if (((toState.name == 'home.diagnose02' || toState.name == 'diagnose_knowledge02') && toStateParams.isIncreaseScore == 'true')
            || toState.name == 'pet_page'
        ) {
            $rootScope.petPageBgMusic.play()
        } else {
            $rootScope.petPageBgMusic.pause()
        }
        $rootScope.routeIsIndexPage = toState.name === 'home.study_index';
        if (toState.name == 'system_login') {
            $rootScope.isBlankScreen = false;
        } else {
            $rootScope.isBlankScreen = true;
        }

    });
}

function DisableHardwareBackButton($ionicPlatform, $ionicHistory, $ionicPopup, $rootScope, $location, $state) {
    $ionicPlatform.ready(function () {
        $rootScope.registerBackButtonAction = function () {
            return $ionicPlatform.registerBackButtonAction(function (e) {
                //阻止默认的行为
                if ($rootScope.viewGoBack&&$rootScope.viewGoBack() == "exit") {
                    // 退出app
                    //ionic.Platform.exitApp();
                }
                e.preventDefault();
                return false;
            }, 101);
        };
        $rootScope.registerBackButtonAction2 = function () {
            return $ionicPlatform.registerBackButtonAction(function (e) {
                e.preventDefault();
                return false;
            }, 401);
        };
        $rootScope.unRegisterBackButtonAction = $rootScope.registerBackButtonAction();
    });
}

function SetRootScopeInfo($rootScope, $ionicHistory, $state, $injector) {
    $rootScope.winInnerWidth = window.innerWidth;
    $rootScope.$injector = $injector;
    $rootScope.loadBootImg = function (imgUrl) {
        return require('../bootImages/' + imgUrl);
    };
    $rootScope.goBack = function () {
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
    /**
     *  在支持touch的设备上禁用掉mousedown及mouseup事件，
     *  以避免出现点击一次相当于两次的问题
     */
    if ($rootScope.platform.IS_ANDROID || $rootScope.platform.IS_IPHONE || $rootScope.platform.IS_IPAD) {
        document.addEventListener('mousedown', function (ev) {
            ev.stopPropagation();
        }, true);
        document.addEventListener('mouseup', function (ev) {
            ev.stopPropagation();
        }, true);
    }
    $rootScope.hatchPetBgMusic = document.getElementById('increase_score_hatch_pet_music');
    $rootScope.feedPetBgMusic = document.getElementById('increase_score_feed_pet_music');
    $rootScope.petPageBgMusic = document.getElementById('pet_page_bg_music');
    $rootScope.petEatMusic = [
        document.getElementById('pet_eat_music_1'),
        document.getElementById('pet_eat_music_2'),
        document.getElementById('pet_eat_music_3')
    ]
}

function StartNetStatusListener(ngWorkerRunner, $ngRedux, appInfoService) {
    let changeNetworkStatus = bindActionCreators(appInfoService.changeNetworkStatus, $ngRedux.dispatch);
    // ngWorkerRunner.runTask('notifyNetWorkStatus', [{onLine:$ngRedux.getState().app_info.onLine}]).progress(function (isOnline) {
    //     changeNetworkStatus(isOnline);
    // });

    setInterval(() => {
        let isOnline = $ngRedux.getState().app_info.onLine;
        let nowOnline;
        if (navigator.connection) {
            nowOnline = navigator.connection.type != 'none';
        } else {
            nowOnline = navigator.onLine;
        }
        if (isOnline != nowOnline) {
            isOnline = nowOnline;
            changeNetworkStatus(isOnline);
        }
    }, 3000);
}

function ConfigLogUploading($window, $state, $rootScope, $timeout) {
    $window.LogMonitor.uploadLog(0, true);
    $window.document.addEventListener("resume", () => {
        $window.LogMonitor.uploadLog(0, true);
        if ((($state.current.name == 'home.diagnose02' || $state.current.name == 'diagnose_knowledge02') && $state.params.isIncreaseScore == 'true')
            || $state.current.name == 'pet_page'
        ) {
            $timeout(() => {
                $rootScope.petPageBgMusic && $rootScope.petPageBgMusic.play();
            }, 10)
        }
    }, false);
    $window.document.addEventListener("pause", () => {
        $window.LogMonitor.uploadLog(0, true);
        $timeout(() => {
            $rootScope.petPageBgMusic && $rootScope.petPageBgMusic.pause();
        }, 10)
    }, false)
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

m_boot.config(['$ionicConfigProvider', ConfigTabPositionAndViewCache])
    .config(['$ngReduxProvider', ConfigNeRedux])
    .config(['$httpProvider', ConfigHttpProxy])
    .config(['ngWorkerRunnerProvider', ConfigWorkerRunner])
    .config(['$ocLazyLoadProvider',function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            modules: [{
                name: 'm_home',
                reconfig: true,
                files: [moduleBundleMap['m_home']]
            },{
                name: 'm_final_sprint',
                reconfig: true,
                files: [moduleBundleMap['m_final_sprint']]
            },{
                name: 'm_final_sprint_payment',
                reconfig: true,
                files: [moduleBundleMap['m_final_sprint_payment']]
            },{
                name: 'm_final_sprint_question',
                reconfig: true,
                files: [moduleBundleMap['m_final_sprint_question']]
            },{
                name: 'm_game_map',
                reconfig: true,
                files: [moduleBundleMap['m_game_map']]
            },{
                name: 'm_math_game',
                reconfig: true,
                files: [moduleBundleMap['m_math_game']]
            },{
                name: 'm_compute',
                reconfig: true,
                files: [moduleBundleMap['m_compute']]
            },{
                name: 'm_diagnose',
                reconfig: true,
                files: [moduleBundleMap['m_diagnose']]
            },{
                name: 'm_user_auth',
                reconfig: true,
                files: [moduleBundleMap['m_user_auth']]
            }, {
                name: 'm_oral_calculation',
                reconfig: true,
                files: [moduleBundleMap['oral_calculation']]
            },{
                name: 'm_reward',
                reconfig: true,
                files: [moduleBundleMap['m_reward']]
            },{
                name: 'm_diagnose_pk',
                reconfig: true,
                files: [moduleBundleMap['m_diagnose_pk']]
            },{
                name: 'm_me_classes',
                reconfig: true,
                files: [moduleBundleMap['m_me_classes']]
            },{
                name: 'm_global',
                reconfig: true,
                files: [moduleBundleMap['m_global']]
            },{
                name: 'm_me',
                reconfig: true,
                files: [moduleBundleMap['m_me']]
            }, {
                name: 'm_diagnose_payment',
                reconfig: true,
                files: [moduleBundleMap['m_diagnose_payment']]
            }, {
                name: 'm_increase_score_payment',
                reconfig: true,
                files: [moduleBundleMap['m_increase_score_payment']]
            }, {
                name: 'm_pet_page',
                reconfig: true,
                files: [moduleBundleMap['m_pet_page']]
            }, {
                name: 'm_xly',
                reconfig: true,
                files: [moduleBundleMap['m_xly']]
            }, {
                name: 'm_olympic_math_home',
                reconfig: true,
                files: [moduleBundleMap['m_olympic_math_home']]
            }, {
                name: 'm_work',
                reconfig: true,
                files: [moduleBundleMap['m_work']]
            }, {
                name: 'm_holiday_work',
                reconfig: true,
                files: [moduleBundleMap['m_holiday_work']]
            }, {
                name: 'm_question_every_day',
                reconfig: true,
                files: [moduleBundleMap['m_question_every_day']]
            }, {
                name: 'm_winter_camp',
                reconfig: true,
                files: [moduleBundleMap['m_winter_camp']]
            }, {
                name: 'm_improve',
                reconfig: true,
                files: [moduleBundleMap['m_improve']]
            }, {
                name: 'm_olympic_math_microlecture',
                reconfig: true,
                files: [moduleBundleMap['m_olympic_math_microlecture']]
            }, {
                name: 'm_live',
                reconfig: true,
                files: [moduleBundleMap['m_live']]
            }, {
                name: 'm_online_teaching',
                reconfig: true,
                files: [moduleBundleMap['m_online_teaching']]
            }]
        });
    }])
    .config(myErrorCatch)
    /*.run(['$ocLazyLoad', ($ocLazyLoad)=> {
        $ocLazyLoad.load("m_xly");
    }])*/
    .run(['$rootScope', '$timeout', 'pageRefreshManager', HandleStateChange])
    .run(['$ionicPlatform', '$ionicHistory', '$ionicPopup', '$rootScope', '$location', '$state', DisableHardwareBackButton])
    .run(['$rootScope', '$ionicHistory', '$state', '$injector', SetRootScopeInfo])
    .run(['ngWorkerRunner', '$ngRedux', 'appInfoService', StartNetStatusListener])
    .run(['$ocLazyLoad','$ngRedux', '$state', 'profileService', '$rootScope', "serverInterface", "finalData", HandleAutoLoginWhenBootstrap])
    .run(['$window', '$state', '$rootScope', '$timeout', ConfigLogUploading]);


//启动APP
ionic.Platform.ready(function () {
    angular.bootstrap(document, ['m_boot'], {strictDi: false});
});




