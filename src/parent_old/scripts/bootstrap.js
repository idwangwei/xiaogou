import 'ionicJS';
import 'ionicCss';
import "babel-polyfill";
import app from './app'
import $ from 'jquery';

import './routes';
// import 'ionicJS';
import 'less/theme/theme01/app.less';
import 'appTextareaCss';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import userManifest from 'local_store/UserManifest';
import rootReducer from './redux/index';
import replicate from 'reduxReplicate/index';
import localforage from 'reduxReplicateLocalforage';

let key = '_INITIAL_KEY_';
let reducerKeys = true;
let replicator = localforage;
let userManifest_=userManifest;
replicator.setDefaultStates({ profile: "456" });
const replication = replicate({ key, reducerKeys, replicator });

function ConfigNeRedux($ngReduxProvider) {
    $ngReduxProvider.createStoreWith(rootReducer
        , [thunk, createLogger({ duration: true })]
        , [replication]);
}

//require('libs/circliful/css/jquery.circliful.css');
//require('libs/jqui/jquery-ui.min.css');
app.config(['$ionicConfigProvider','$rootScopeProvider', function ($ionicConfigProvider,$rootScopeProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    // $ionicConfigProvider.views.maxCache(0); //����ҳ�滺�棬���ֱ�ʾ���Ļ����ҳ����
    $ionicConfigProvider.views.swipeBackEnabled(false);//禁止侧滑后退事件
    $rootScopeProvider.digestTtl(30);
}]).config(['$ngReduxProvider', ConfigNeRedux])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        // Override $http service's default transformRequest
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
    }]).run(['$http', '$rootScope', '$log', '$state', 'serverInterface', '$ionicPlatform',
        function ($http, $rootScope, $log, $state, serverInterface, $ionicPlatform) {
            loadingScene.hide();
            window.$state = $state;
            $ionicPlatform.ready(function () {
                $ionicPlatform.registerBackButtonAction(function (e) {
                    //判断处于哪个页面时双击退出
                    if($rootScope.viewGoBack()=="exit"){
                     // 退出app
                     // ionic.Platform.exitApp();
                     }
                    e.preventDefault();
                    return false;
                }, 101);
            });
            $rootScope.winInnerWidth = window.innerWidth;
            $rootScope.loadImg = function (imgUrl) {
                return require('pImages/' + imgUrl);
            };
            let firstGoToRegister=window.localStorage.getItem('firstGoToRegister');
            if(firstGoToRegister){
                window.localStorage.removeItem('firstGoToRegister');
                $state.go('register');
            }else
                $state.go('system_login');

            if (!$rootScope.modal) {//���modal�򿪺��ܽ���ҳ����ת��
                $rootScope.modal = [];
            }
            var lastLoginInfoStr = localStorage.getItem("lastLoginInfo");
            if (!lastLoginInfoStr) return;
            var lastLoginInfo;
            try {
                lastLoginInfo = JSON.parse(lastLoginInfoStr);
                $rootScope.lastLoginInfo = lastLoginInfo;
            } catch (e) {
                $log.error(e);
            }

        }]);

ionic.Platform.ready(function () {
    angular.bootstrap(document, ['app']);
});
