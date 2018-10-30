/**
 *
 * Thanks to Three.js, mr.doob
 */
import logger from  "log_monitor";
var ARORA = "Arora";
var CHROME = "Chrome";
var EPIPHANY = "Epiphany";
var FIREFOX = "Firefox";
var MOBILE_SAFARI = "Mobile Safari";
var INTERNET_EXPLORER = "Internet Explorer";
var MIDORI = "Midori";
var OPERA = "Opera";
var SAFARI = "Safari";

var ANDROID = "Android";
var CHROME_OS = "Chrome OS";
var IOS = "iOS";
var LINUX = "Linux";
var MAC_OS = "Mac OS";
var WINDOWS = "Windows";
var IPAD = "iPad";
var IPHONE = "iPhone";

var platformDetector = angular.module('ngPlatformDetector', []);
platformDetector.service('platformDetector', [function () {
    window.game = window.game || {};

    this.detector = {

        browser: (function () {
            var ua = navigator.userAgent;
            if (/Arora/i.test(ua)) {
                return ARORA;
            } else if (/Chrome/i.test(ua)) {
                return CHROME;
            } else if (/Epiphany/i.test(ua)) {
                return EPIPHANY;
            } else if (/Firefox/i.test(ua)) {
                return FIREFOX;
            } else if (/Mobile(\/.*)? Safari/i.test(ua)) {
                return MOBILE_SAFARI;
            } else if (/MSIE/i.test(ua)) {
                return INTERNET_EXPLORER;
            } else if (/Midori/i.test(ua)) {
                return MIDORI;
            } else if (/Opera/.test(ua)) {
                return OPERA;
            } else if (/Safari/i.test(ua)) {
                return SAFARI;
            }
            return false;
        })(),

        os: (function () {
            var ua = navigator.userAgent;
            if (/Android/i.test(ua)) {
                return ANDROID;
            } else if (/CrOS/i.test(ua)) {
                return CHROME_OS;
            } else if (/iP[ao]d/i.test(ua)) {
                return IPAD;
            } else if (/iPhone/i.test(ua)) {
                return IPHONE;
            } else if (/Linux/i.test(ua)) {
                return LINUX;
            } else if (/Mac OS/i.test(ua)) {
                return MAC_OS;
            } else if (/windows/i.test(ua)) {
                return WINDOWS;
            }
            return false;
        })(),

        support: {
            canvas: !!window.CanvasRenderingContext2D,
            localStorage: (function () {
                try {
                    return !!window.localStorage.getItem;
                } catch (error) {
                    return false;
                }
            })(),
            file: !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob,
            fileSystem: !!window.requestFileSystem || !!window.webkitRequestFileSystem,
            getUserMedia: !!window.navigator.getUserMedia || !!window.navigator.webkitGetUserMedia || !!window.navigator.mozGetUserMedia || !!window.navigator.msGetUserMedia,
            requestAnimationFrame: !!window.mozRequestAnimationFrame || !!window.webkitRequestAnimationFrame || !!window.oRequestAnimationFrame || !!window.msRequestAnimationFrame,
            sessionStorage: (function () {
                try {
                    return !!window.sessionStorage.getItem;
                } catch (error) {
                    return false;
                }
            })(),
            webgl: (function () {
                try {
                    return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
                } catch (e) {
                    return false;
                }
            })(),
            worker: !!window.Worker
        }

    };
}]);
platformDetector.run(['$rootScope', 'platformDetector','$ionicPlatform', function ($rootScope, platformDetector,$ionicPlatform) {
    $rootScope.platform = {};
    $rootScope.platform.IS_ANDROID = platformDetector.detector.os == ANDROID;
    $rootScope.platform.IS_MAC_OS = platformDetector.detector.os == MAC_OS;
    $rootScope.platform.IS_CHROME_OS = platformDetector.detector.os == CHROME_OS;
    $rootScope.platform.IS_LINUX = platformDetector.detector.os == LINUX;
    $rootScope.platform.IS_WINDOWS = platformDetector.detector.os == WINDOWS;
    $rootScope.platform.IS_IPHONE = platformDetector.detector.os == IPHONE;
    $rootScope.platform.IS_IPAD = platformDetector.detector.os == IPAD;
    $rootScope.platform.DEVICE_UUID = window.device ? device.uuid : '11';
    $rootScope.platform.isMobile = function () {
        return $rootScope.platform.IS_ANDROID ||
            $rootScope.platform.IS_IPHONE ||
            $rootScope.platform.IS_IPAD;
    };
    $ionicPlatform.ready(function(){
        //检查微信插件功能
        if (typeof Wechat === "undefined" || !$rootScope.platform.isMobile()) {
            logger.error('没有安装微信分享插件');
            $rootScope.weChatPluginInstalled = false;
        } else {
            $rootScope.weChatPluginInstalled = true;
            if (PRODUCTION===true&&typeof Wechat !== "undefined"){
                Wechat.isInstalled(function (installed) {
                    if (!installed) {
                        logger.debug("用户没有安装微信！");
                        $rootScope.weChatInstalled = false;
                    } else {
                        $rootScope.weChatInstalled = true;
                    }
                });
            }
        }
        //检查微信插件功能
        if (typeof QQ === "undefined" || !$rootScope.platform.isMobile()) {
            logger.error('没有安装QQ分享插件');
            $rootScope.QQPluginInstalled = false;
        } else {
            $rootScope.QQPluginInstalled = true;
        }
    });


    var plat = $rootScope.platform;
    $rootScope.platform.type = plat.IS_ANDROID || plat.IS_IPHONE ? 1 : plat.IS_IPAD ? 1 : plat.IS_WINDOWS ? 1 : 1;
}]);

export default platformDetector;

