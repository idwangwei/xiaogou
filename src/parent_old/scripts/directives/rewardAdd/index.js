/**
 * Created by WL on 2017/5/4.
 */
import './style.less';
import add_share from './images/add_share.png';
import add_tip from './images/add_tip.png';
import colorLeft from './images/color_bar6.png';
import colorRight from './images/color_bar7.png';
import qqIcon from "./images/qq.ico";
import weChatIcon from "./images/wechat.ico";
import friendCircle from "./images/friend-circle.png";

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template:require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', 'commonService', '$ionicActionSheet','profileService','$ionicPopup',
            function ($scope, $rootScope, $state , commonService ,$ionicActionSheet,profileService,$ionicPopup) {
            $scope.content1 = "分享智算365，邀请新家长注册使用智算365，您的孩子会获得能量奖励！";
            $scope.content2 = "在学生端的能量中心里可以使用能量兑换“学霸驯宠使用券”，免费开通特权！";
            $scope.content3 = "学霸驯宠记，精准诊断孩子的薄弱考点，智能推送习题，针对性练习直至掌握，孩子的快速提升法宝！";

            $scope.tipContent = [
                "奖励规则：",
                "首次推广到群，您的孩子获得200能量；",
                "每次推广注册一名新家长，您的孩子即可获得400能量！"
            ];

            $scope.addShare = add_share;
            $scope.addShareContent = add_tip;
            $scope.colorLeft = colorLeft;
            $scope.colorRight = colorRight;
            $rootScope.showRewardAdFlag = false;
            $scope.user = $rootScope.user;
            $scope.qrCodeUrl = "http://www.xuexiv.com/register?invitationCode="+ $scope.user.userId; //二维码链接
            $scope.qrCodeImg = window.QRCode.generatePNG($scope.qrCodeUrl, {modulesize: 6, margin: 0});//二维码图片

            $scope.hideRewardAd = function () {
                $rootScope.showRewardAdFlag = false;
            };

            $scope.isShowShareBtn = function () {
                if (typeof Wechat == "undefined") return false; //插件不存在不显示
                if (commonService.judgeSYS() == 1) return true; //安卓系统显示
                if (commonService.judgeSYS() == 3) return false; //非移动端设备不显示

                let appNumVersion = commonService.getAppNumVersion();
                if (!appNumVersion)return false;

                let ver = "1.8.8";
                let verArr = ver.split(".");
                let appVerArr = appNumVersion.split(".");
                while (appVerArr.length < verArr.length) {
                    appVerArr.push(0);
                }
                let isShow = true;
                for (let i = 0; i < appVerArr.length; i++) {
                    if (Number(appVerArr[i]) > Number(verArr[i])) {
                        break;
                    } else if (Number(appVerArr[i]) < Number(verArr[i])) {
                        isShow = false;
                        break;
                    }
                }
                return isShow;
            };

            $scope.showShareBtn = function() {
                let name = $rootScope.student[0].studentName;
                let shareContent = `${name}的家长向您和孩子推荐智算365，点击下载安装。`;
                $ionicActionSheet.show({
                    buttons:[
                        {text: `<img class="reward-share-btn weChat-share-img" src="${weChatIcon}">分享到微信`},
                        {text: `<img class="reward-share-btn friend-circle-share-img" src="${friendCircle}">分享到朋友圈`},
                        {text: `<img class="reward-share-btn qq-share-img" src="${qqIcon}" >分享到QQ`}
                    ],
                    titleText: `<div>
                    <div class="reward-share-btn share-title">智算365分享：</div>
                        <div class="reward-share-btn share-content">${shareContent}</div>
                        <img class="reward-share-btn share-qrcode" src="${$scope.qrCodeImg}">
                    </div>`,
                    cancelText: '取消',
                    buttonClicked: (index)=> {
                        if (index == 2) {
                            QQ.setOptions({
                                appId: '1105576253',
                                appName: 'XiaoGou',
                                appKey: 'IaDN9O8abL0FJ6gT'
                            });
                            QQ.share(shareContent,
                                '智算365邀请',
                                'http://xuexiv.com/img/icon.png',
                                $scope.qrCodeUrl,
                                /* 'http://a.app.qq.com/o/simple.jsp?pkgname=com.allere.eclass',*/
                                ()=> {
                                    //commonService.showAlert("提示", "分享信息发送成功！");
                                    $scope.shareSuccess();
                                }, (err)=> {
                                    commonService.showAlert("提示", err);
                                });
                        }
                        if (index == 0) {//点击分享到微信
                            if (!$scope.$root.weChatInstalled) {
                                commonService.showAlert("提示", "没有安装微信！");
                                return;
                            }
                            Wechat.share({
                                scene: Wechat.Scene.SESSION ,  // 分享到朋友或群
                                message: {
                                    title: "智算365邀请",
                                    description: shareContent,
                                    thumb: "http://xuexiv.com/img/icon.png",
                                    mediaTagName: "TEST-TAG-001",
                                    messageExt: "这是第三方带的测试字段",
                                    messageAction: "<action>dotalist</action>",
                                    media: {
                                        type: Wechat.Type.WEBPAGE,
                                        /*webpageUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.allere.eclass"*/
                                        webpageUrl:$scope.qrCodeUrl,
                                    }
                                },
                            }, ()=> {
                                //commonService.showAlert("提示", "分享信息发送成功！");
                                $scope.shareSuccess();
                            }, (reason)=> {
                                commonService.showAlert("提示", reason);
                            });
                        }

                        if (index == 1) {//点击分享到微信朋友圈
                            if (!$scope.$root.weChatInstalled) {
                                commonService.showAlert("提示", "没有安装微信！");
                                return;
                            }
                            Wechat.share({
                                scene: Wechat.Scene.TIMELINE ,  // 分享到朋友或群
                                message: {
                                    title: "智算365分享",
                                    description: shareContent,
                                    thumb: "http://xuexiv.com/img/icon.png",
                                    mediaTagName: "TEST-TAG-001",
                                    messageExt: "这是第三方带的测试字段",
                                    messageAction: "<action>dotalist</action>",
                                    media: {
                                        type: Wechat.Type.LINK,
                                        webpageUrl:$scope.qrCodeUrl,
                                        /* webpageUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.allere.eclass"*/
                                    }
                                },
                            }, ()=> {
                                //commonService.showAlert("提示", "分享信息发送成功！");
                                $scope.shareSuccess();
                            }, (reason)=> {
                                commonService.showAlert("提示", reason);
                            });
                        }

                        return true;
                    }
                });
            };

            /**
             * 分享成功后的回调
             */
            $scope.shareSuccess = function () {
                //发送添加积分的请求
                let param = {"parentId": $rootScope.user.userId};
                profileService.parentShareFirst(param).then((data)=>{
                    if(data.code == 200){
                        if(data.addSuccess){
                            $scope.goToLoginPageAfterShare();
                        }else{
                            commonService.showAlert("提示", "分享信息发送成功！");
                        }
                    }else{
                        commonService.alertDialog('网络不畅，请稍后再试', 1500);
                    }
                })
            };

            /**
             * 分享后积分添加成功
             */
            $scope.goToLoginPageAfterShare = function () {
                let contentTemplate = `
                <p>分享成功！学生端积分+200！</p>
                <p>其他人点击您的链接注册后，学生端积分将继续增长。</p>`;

                var confirmPromise = $ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
                    template: contentTemplate,
                    title: "提示",
                    buttons: [
                        {
                            text: "<b>确定</b>",
                            type: "button-positive",
                            onTap: function (e) {
                                return true;
                            }
                        },
                        {
                            text: "<b>去学生端</b>",
                            type: "",
                            onTap: function (e) {
                                return false;
                            }
                        }

                    ]
                });

                confirmPromise.then(function (res) {
                    if (res) { //确定
                        return;
                    }
                    //点击去学生端
                    profileService.logout().then(function (data) {
                        if (data) {
                            $rootScope.student=[];
                            $rootScope.sessionID = '';
                            $rootScope.needAutoLogin = false;
                            localStorage.removeItem('profileInfo');
                            localStorage.removeItem('lastLoginInfo');
                            studentService.clearStuInfo();
                            window.localStorage.setItem('currentSystem', JSON.stringify({id: 'student'}));
                            window.location.href = './student_index.html';
                            return;
                        }
                        commonService.alertDialog('网络不畅，请稍后再试', 1500);
                    });

                });
            };

        }],
        link: function ($scope, $element, $attrs) {

        }
    };
}
