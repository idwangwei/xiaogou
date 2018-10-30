let loadingScene = require('loadingScene');
require('loadingSceneCss');
require('ionicJS');
require('ionicCss');
require('platformDetector');
loadingScene.loadCordova();
import  oneImg from 'index-home/images/one.png';
import  twoImg from 'index-home/images/two.png';
import  threeImg from 'index-home/images/three.png';
import  titleOneImg from 'index-home/images/title-one.png';
import  titleTwoImg from 'index-home/images/title-two.png';
import  titleThreeImg from 'index-home/images/title-three.png';

//loadingScene.show();

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
    })
}]);
ionicApp.controller('sysSelectCtrl', ['$scope', '$window', '$log', '$ionicPopup', 'platformDetector', function ($scope, $window, $log, $ionicPopup, platformDetector) {

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
    $scope.one=oneImg;
    $scope.two=twoImg;
    $scope.three=threeImg;
    $scope.titleOneImg=titleOneImg;
    $scope.titleTwoImg=titleTwoImg;
    $scope.titleThreeImg=titleThreeImg;
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

    $scope.handleSelect=function(item,isRegister){
        if(isRegister) $window.localStorage.setItem('firstGoToRegister', JSON.stringify(true));
        if(item===$scope.ROLE.TEACHER){
            $window.location.href = $scope.SUB_APP_DIR.TEACHER;
            $window.localStorage.setItem('currentSystem', JSON.stringify(teacher));
            return;
        }
        if(item===$scope.ROLE.PARENT){
            $window.location.href = $scope.SUB_APP_DIR.PARENT;
            $window.localStorage.setItem('currentSystem', JSON.stringify(parent));
            return;
        }
        if(item===$scope.ROLE.STUDENT){
            $window.location.href = $scope.SUB_APP_DIR.STUDENT;
            $window.localStorage.setItem('currentSystem', JSON.stringify(student));
            return;
        }
    };

    $scope.dataInit = function () {
        debugger;
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


    $scope.goToLogin=function () {
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
ionicApp.run(['$state', function ($state) {
    $state.go('index_home');
}]);