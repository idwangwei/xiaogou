require('ionicJS');
require('ionicCss');
require('platformDetector');
import  oneImg from 'index-home/images/one.png';
import  twoImg from 'index-home/images/two.png';
import  threeImg from 'index-home/images/three.png';
import  titleOneImg from 'index-home/images/title-one.png';
import  titleTwoImg from 'index-home/images/title-two.png';
import  titleThreeImg from 'index-home/images/title-three.png';
import  cursorImg from 'index-home/images/cursor.png'
import localforage  from 'localforage';

import camp_cloud3 from 'index-study-train-camp-ad/images/camp_cloud3.png';
import camp_cloud2 from 'index-study-train-camp-ad/images/camp_cloud2.png';
import camp_cloud1 from 'index-study-train-camp-ad/images/camp_cloud1.png';
import camp_ad_content from 'index-study-train-camp-ad/images/camp_ad.png';
import camp_animal from 'index-study-train-camp-ad/images/camp_animal.png';

///////////////更新版本后清除LocalStorage、localForage中的“data(用户浏览数据)”存储的数据/////////////////////////////
//注意：要保留来自更新框架的几个字段 change_log 、isNeedCheck 、assetPath，和 currentSystem
//注意：要保留PAPER_STORE(缓存的试卷)、DO_PAPER_STORE(保存的做题内容)、LOG_STORE(错误日志信息)
let changeLog = localStorage.getItem("change_log");
// let isNeedCheck=localStorage.getItem("isNeedCheck");
// let assetPath =localStorage.getItem("assetPath");
// let currentSystem =localStorage.getItem("assetPath");
let studyCampAd = localStorage.getItem('study_camp_ad');

/*
 studyCampAd = {
 latestUpdateVersion:{}, //最近更新的版本信息
 hasShownAdFlag:false //最近的版本是否已经显示过学霸训练营广告
 };
 */


if (changeLog) {
    try {
        changeLog = JSON.parse(changeLog);
        let latestUpdateVersion = null;

        for (let i = 0, len = changeLog.length; i < len; i++) {
            if (!latestUpdateVersion) latestUpdateVersion = changeLog[i];
            if (latestUpdateVersion["dt"]
                && changeLog[i]["dt"]
                && new Date(changeLog[i]["dt"]) > new Date(latestUpdateVersion["dt"])) {
                latestUpdateVersion = changeLog[i];
            }
        }
        if (latestUpdateVersion && !latestUpdateVersion["localStorageCleared"]) {
            // localStorage.clear();
            latestUpdateVersion["localStorageCleared"] = true;
            localStorage.setItem("change_log", JSON.stringify(changeLog));
            // localStorage.setItem("assetPath",assetPath);
            // localStorage.setItem("isNeedCheck",isNeedCheck);
            // localStorage.setItem("currentSystem",currentSystem);
            // console.log("localStorage clear after update !!!!!!!!!");
            localforage.createInstance({name: "data"}).clear();
            console.log("localforage data instance clear after update!!!!!!");
        }

        let updateStudyFlag = false; //是否需要更新学霸训练营显示数据
        if(!studyCampAd){
            updateStudyFlag = true;
        }else{
            try {
                studyCampAd = JSON.parse(studyCampAd);
                if( new Date(latestUpdateVersion["dt"]) > new Date(studyCampAd.latestUpdateVersion["dt"])){
                    updateStudyFlag = true;
                }
            }catch(e){
                console.error("parse study_camp_ad error!");
                console.log(e);
            }
        }
        if(updateStudyFlag){
            let tempData = {
                latestUpdateVersion:latestUpdateVersion, //最近更新的版本信息
                hasShownAdFlag:false //最近的版本是否已经显示过学霸训练营广告
            };
            localStorage.setItem('study_camp_ad',JSON.stringify(tempData));
        }

    } catch (e) {
        console.error("parse change_log error!");
        console.log(e);
    }
}
///////////////////////////////////////////////////////////////////////////

ionic.Platform.ready(function () {
    angular.bootstrap(document, ['ionicApp']);
});
let ionicApp = angular.module('ionicApp', ['ionic', 'ngPlatformDetector']);

ionicApp.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(false);
    $stateProvider.state('index_home', {
        url: '/index_home',
        template: require('./index-home/index_home.html'),
        controller: 'sysSelectCtrl'
    });
    $stateProvider.state('index_study_train_camp_ad', {
        url: 'index_study_train_camp_ad',
        template: require('./index-study-train-camp-ad/index_camp_ad.html'),
        controller: 'studyTrainCampAdCtrl'
    })
}]);
ionicApp.controller('sysSelectCtrl', ['$scope', '$window', '$log', '$ionicPopup','$ionicSlideBoxDelegate'
    , function ($scope, $window, $log, $ionicPopup,$ionicSlideBoxDelegate) {
        loadingScene.show();
        $scope.SUB_APP_DIR = {
            TEACHER: 'teacher_index.html',
            STUDENT: 'student_index.html',
            PARENT: 'parent_index.html'
        };
        $scope.ROLE = {
            TEACHER: "teacher",
            STUDENT: "student",
            PARENT: "parent"
        };
        $scope.one = oneImg;
        $scope.two = twoImg;
        $scope.three = threeImg;
        $scope.titleOneImg = titleOneImg;
        $scope.titleTwoImg = titleTwoImg;
        $scope.titleThreeImg = titleThreeImg;
        $scope.cursorImg = cursorImg;
        let teacher = {
            id: $scope.ROLE.TEACHER,
            image: '',
            name: '我是教师',
            desc: '这是一些描述',
            color: '#6B94D6'
        };
        let parent = {
            id: $scope.ROLE.PARENT,
            image: '',
            name: '我是家长',
            desc: '这是一些描述',
            color: '#8BC855'
        };
        let student = {
            id: $scope.ROLE.STUDENT,
            image: '',
            name: '我是学生',
            desc: '这是一些描述',
            color: '#F38B83'
        };
        $scope.previousSlide=function () {
            $ionicSlideBoxDelegate.previous();
        };
        $scope.nextSlide=function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.showPreviousSlideBtn=function () {
            return $ionicSlideBoxDelegate.currentIndex()!==0;
        };
        $scope.showNextSlideBtn=function () {
            return $ionicSlideBoxDelegate.currentIndex()!==$ionicSlideBoxDelegate.count()-1;
        };
        $scope.handleSelect = function (item, isRegister) {
            if (isRegister) $window.localStorage.setItem('firstGoToRegister', JSON.stringify(true));
            if (item === $scope.ROLE.TEACHER) {
                $window.location.href = $scope.SUB_APP_DIR.TEACHER;
                $window.localStorage.setItem('currentSystem', JSON.stringify(teacher));
                return;
            }
            if (item === $scope.ROLE.PARENT) {
                $window.location.href = $scope.SUB_APP_DIR.PARENT;
                $window.localStorage.setItem('currentSystem', JSON.stringify(parent));
                return;
            }
            if (item === $scope.ROLE.STUDENT) {
                $window.location.href = $scope.SUB_APP_DIR.STUDENT;
                $window.localStorage.setItem('currentSystem', JSON.stringify(student));
                return;
            }
        };

        $scope.dataInit = function () {
            $scope.currentSystemStr = $window.localStorage.getItem('currentSystem');
            if ($scope.currentSystemStr) {
                try {
                    var currentSystem = JSON.parse($scope.currentSystemStr);
                    if (!checkVersionAndUpdate()) {
                        $scope.handleSelect(currentSystem.id);
                        loadingScene.hide();
                    }
                } catch (e) {
                    $log.error(e);
                    loadingScene.hide();
                }
            } else {
                loadingScene.hide();
                checkVersionAndUpdate();
            }
        };
        $scope.dataInit();


        $scope.goToLogin = function () {
            $window.localStorage.setItem('currentSystem', JSON.stringify(student));
            $window.location.href = $scope.SUB_APP_DIR.STUDENT;
        };

        var alertTemplate = '<div style="text-align:center">' +
            '<div style="text-align: left">为学校定制的新版本上线，请到下面地址下载安装:</div>' +
            '<div style="-webkit-user-select: initial;user-select: initial;font-size: 20px; padding: 10px 0 20px 0;">http://xuexiV.com</div>' +
            '<div style="text-align: left">请关闭本程序窗口以保证顺利安装。</div>' +
            '</div>';
        //弹出更新提示
        function showUpdateTipAlert() {
            $ionicPopup.alert({
                title: "提示",
                template: alertTemplate,
                okText: '确定'
            }).then(function () {
                showUpdateTipAlert();
            });
        }

        function checkVersionAndUpdate() {
            var match = navigator.userAgent.match(/electron-MathGames\d\/(\d.\d.\d)/);
            if (navigator.userAgent.indexOf('Windows NT') != -1 && match && match[1] == '1.0.0') {
                showUpdateTipAlert();
                loadingScene.hide();
                return true;
            }
        }
    }]);

ionicApp.controller('studyTrainCampAdCtrl', ['$scope', '$window', '$log', '$state'
    , function ($scope, $window, $log, $state) {
        //学霸训练营广告在每次更新内容之后要显示，点击按钮之后就不再显示
        $scope.camp_cloud3 = camp_cloud3;
        $scope.camp_cloud2 = camp_cloud2;
        $scope.camp_cloud1 = camp_cloud1;
        $scope.camp_ad_content = camp_ad_content;
        $scope.camp_animal = camp_animal;
        $scope.isIos = $scope.platform.IS_IPHONE ||  $scope.platform.IS_IPAD;
        $scope.SUB_APP_DIR = {
            TEACHER: 'teacher_index.html',
            STUDENT: 'student_index.html',
            PARENT: 'parent_index.html'
        };
        $scope.ROLE = {
            TEACHER: "teacher",
            STUDENT: "student",
            PARENT: "parent"
        };

        loadingScene.hide();

        $scope.handleSelect = function (item, isRegister) {
            if (isRegister) $window.localStorage.setItem('firstGoToRegister', JSON.stringify(true));
            if (item === $scope.ROLE.TEACHER) {
                $window.location.href = $scope.SUB_APP_DIR.TEACHER;
                return;
            }
            if (item === $scope.ROLE.PARENT) {
                $window.location.href = $scope.SUB_APP_DIR.PARENT;
                return;
            }
            if (item === $scope.ROLE.STUDENT) {
                $window.location.href = $scope.SUB_APP_DIR.STUDENT;
                return;
            }
        };

        $scope.changePage = function () {
            let currentSystemStr = $window.localStorage.getItem('currentSystem');
            if (currentSystemStr) {
                try {
                    let currentSystem = JSON.parse(currentSystemStr);
                    $scope.handleSelect(currentSystem.id);
                    loadingScene.hide();
                } catch (e) {
                    $log.error(e);
                    $state.go('index_home');
                    loadingScene.hide();
                }
            } else {
                $state.go('index_home');
            }
        };

        $scope.skipToIndexHome = function () {
            let studyCampAd = localStorage.getItem('study_camp_ad');
            if(studyCampAd){
                studyCampAd = JSON.parse(studyCampAd);
                studyCampAd.hasShownAdFlag = true;
                localStorage.setItem('study_camp_ad', JSON.stringify(studyCampAd));
            }
           /* loadingScene.show();
            $state.go('index_home');*/
            $scope.changePage();
        };
    }]);

ionicApp.run(['$state', '$rootScope',function ($state, $rootScope) {
    if ($rootScope.platform.IS_WINDOWS || $rootScope.platform.IS_MAC_OS) { //windows和mac没有保存change_log，所以直接进入index_home
        $state.go('index_home');
    }else{
        // let studyCampAd = localStorage.getItem('study_camp_ad');
        // if (studyCampAd) {
        //     try {
        //         studyCampAd = JSON.parse(studyCampAd);
        //         if (studyCampAd.hasShownAdFlag) {
        //             $state.go('index_home');
        //         } else {
        //             $state.go('index_study_train_camp_ad');
        //         }
        //     } catch (e) {
        //         $log.error(e);
        //         $state.go('index_home');
        //     }
        // }else{
            $state.go('index_home');
        // }
    }
}]);