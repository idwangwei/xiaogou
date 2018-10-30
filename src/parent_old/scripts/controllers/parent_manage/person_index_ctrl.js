/**
 * Created by 华海川 on 2016/1/14.
 * 家长主页
 */
import controllers from './../index';
import qqIcon from "./../../../pImages/qq.ico";
import weChatIcon from "./../../../pImages/wechat.ico";
import friendCircle from "./../../../pImages/friend-circle.png";
import qrCode from "./../../../pImages/qrcode/officalSiteQrcode.png";


controllers.controller('personIndexCtrl',
    function ($scope, $state, $log, $rootScope, commonService, profileService, $ionicModal, subHeaderService, $ionicPopup, $ionicActionSheet, promoteService, studentService, workStatisticsServices) {
        'ngInject';
        $scope.user = $rootScope.user;
        $scope.user.name = workStatisticsServices.pubWorkStudent.name ?
            (workStatisticsServices.pubWorkStudent.name + '家长')
            :'家长';
        $scope.agencyFlag = promoteService.agencyFlag;
        // $scope.qrCodeUrl = "http://www.xuexiv.com/register?invitationCode=" + $scope.user.userId; //二维码链接
        $scope.qrCodeUrl = "http://cdn.allere.static.xuexiv.com/static/img/gongzhonghao_qr2.png";
        $scope.qrCodeImg = window.QRCode.generatePNG($scope.qrCodeUrl, {modulesize: 6, margin: 0});//二维码图片
    
        $scope.xlyVip = $rootScope.user.agent

        subHeaderService.clearAll();
        promoteService.getPersonIsExtensionnerFlag($scope.user.id).then(data => { //判断用户是不是代理
        });


        $scope.appHelp = function () {
            $ionicPopup.alert({
                title: '常见问题',
                template: `<p style="color: #377AE6">问：使用中有问题？</p>
                <p style="position: relative">答：1. 点击每个页面右上角的 
                    <img ng-src="{{$root.loadImg('common/help_icon.png')}}" alt="" class="common-help-tip" style="top: -3px;left: 188px;"/> 
                    <span style="margin-left: 27px">。</span>
                </p>
                <p>2. 还可用浏览器打开 <span style="-webkit-user-select:initial;">xuexiV.com</span>&nbsp;查看《常见问题》</p>
                `,
                okText: '确定'
            });
        };
        $scope.toProtectEyePage = function () {
            if (window.cordova && window.cordova.InAppBrowser) {
                cordova.InAppBrowser.open("http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg","location=yes");
            }else {
                let alertTemplate = `<p>连续使用电脑15分钟，向窗外看一看可以缓解用眼疲劳哦~</p>`;
                commonService.showAlert("温馨提示",alertTemplate,"我知道了");
            }
        };
        /**
         * 退出当前账号
         * @param toStudent 是否要到学生端
         */
        $scope.logout = function (toStudent) {
            let msg = `
                <p>如果您有多个孩子：</p>
                <p>&nbsp;&nbsp;每个孩子需要使用各自的账号登录学生端哦~</p>`;

            commonService.showConfirm('信息提示', toStudent ? msg : '你确定要退出当前账号吗？').then(function (res) {
                if (!res) {
                    return;
                }
                profileService.logout().then(function (data) {
                    if (data) {
                        $rootScope.student = [];
                        $rootScope.sessionID = '';
                        $rootScope.needAutoLogin = false;
                        localStorage.removeItem('profileInfo');
                        localStorage.removeItem('lastLoginInfo');
                        studentService.clearStuInfo();
                        if (toStudent) {
                            window.localStorage.setItem('currentSystem', JSON.stringify({id: 'student'}));
                            window.location.href = './student_index.html';
                        }
                        else
                            $state.go('system_login');
                        return;
                    }
                    commonService.alertDialog('网络不畅，请稍后再试', 1500);
                });

            });
        };


        $scope.isAllow = {};
        $scope.scanQRCode = function () {        //扫描二维码
            $scope.isAllow.no = false;
            $scope.isAllow.yes = false;
            $scope.isAllow.always = false;
            QRCodeScaner.scan().then(function (result) {
                if (!result.text || result.text == undefined) return;
                $scope.result = result.text;
                if ($scope.result) $scope.Modal.show();
            }, function (error) {
                commonService.alertDialog('网络不畅，请稍后再试', 1500);
            });
        };

        $scope.select = function (allowType) { //选择是否允许登录
            $scope.Modal.hide();
            var params = {
                authorizationId: $scope.result,
                userId: $rootScope.user.userId,
                loginName: $rootScope.user.loginName,
                allowType: allowType
            }
            profileService.allowQRCode(params).then(function (data) {
                if (data.code != 200) {
                    commonService.alertDialog('网络不畅，请稍后再试', 1500);
                }
            });
        };

        $ionicModal.fromTemplateUrl('allowDevice.html', {   //初始化是否允许登录modal页
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.Modal = modal;
            $rootScope.modal.push(modal);
        });

        $scope.help = function () {
            $ionicPopup.alert({
                title: '信息提示',
                template: '<p>点击头像，可修改个人信息和设置第二监护人等。</p>',
                okText: '确定'
            });
        };

        $scope.showInvite = function () {
            let name = $rootScope.student[0].studentName;
            let shareContent = `${name}的家长向您和孩子推荐智算365，点击下载安装。`;
            $ionicActionSheet.show({
                buttons: [
                    {text: `<img class="me weChat-share-img" src="${weChatIcon}">分享到微信`},
                    {text: `<img class="me friend-circle-share-img" src="${friendCircle}">分享到朋友圈`},
                    // {text: `<img class="me qq-share-img" src="${qqIcon}" >分享到QQ`}
                ],
                titleText: `<div>
                    <div class="me share-title">智算365分享：</div>
                        <div class="me share-content">${shareContent}</div>
                    </div>`,
                cancelText: '取消',
                buttonClicked: (index) => {
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
                            () => {
                                //commonService.showAlert("提示", "分享信息发送成功！");
                                $scope.shareSuccess();
                            }, (err) => {
                                commonService.showAlert("提示", err);
                            });
                    }
                    if (index == 0) {//点击分享到微信
                        if (!$scope.$root.weChatInstalled) {
                            commonService.showAlert("提示", "没有安装微信！");
                            return;
                        }
                        Wechat.share({
                            scene: Wechat.Scene.SESSION,  // 分享到朋友或群
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
                                    webpageUrl: $scope.qrCodeUrl,
                                }
                            },
                        }, () => {
                            //commonService.showAlert("提示", "分享信息发送成功！");
                            $scope.shareSuccess();
                        }, (reason) => {
                            commonService.showAlert("提示", reason);
                        });
                    }

                    if (index == 1) {//点击分享到微信朋友圈
                        if (!$scope.$root.weChatInstalled) {
                            commonService.showAlert("提示", "没有安装微信！");
                            return;
                        }
                        Wechat.share({
                            scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                            message: {
                                title: "智算365分享",
                                description: shareContent,
                                thumb: "http://xuexiv.com/img/icon.png",
                                mediaTagName: "TEST-TAG-001",
                                messageExt: "这是第三方带的测试字段",
                                messageAction: "<action>dotalist</action>",
                                media: {
                                    type: Wechat.Type.LINK,
                                    webpageUrl: $scope.qrCodeUrl,
                                    /* webpageUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.allere.eclass"*/
                                }
                            },
                        }, () => {
                            // commonService.showAlert("提示", "分享信息发送成功！");
                            $scope.shareSuccess();
                        }, (reason) => {
                            commonService.showAlert("提示", reason);
                        });
                    }

                    return true;
                }
            });
        };

        $scope.isShowInvite = function () {
            if (typeof Wechat == "undefined") return false; //插件不存在不显示
            if (commonService.judgeSYS() == 1) return true; //安卓系统显示
            if (commonService.judgeSYS() == 3) return false; //非移动端设备不显示

            let appNumVersion = commonService.getAppNumVersion();
            if (!appNumVersion) return false;

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

        /**
         * 跳转到推广页面
         */
        $scope.goToPromote = function () {
            $state.go("promote_home");
            /*  promoteService.canParentPromote($scope.user.userId).then(function (data) {
                  if(data.code==200 && data.flag){
                      $state.go("promote_home");
                      return;
                  }
                  commonService.alertDialog(data.msg);
              });*/

        };

        /**
         * 跳转到用户代理页面
         */
        $scope.goToAgencyHome = function () {
            promoteService.canParentPromote($scope.user.userId).then(data => {
                if (data.code != 200) {
                    return;
                } else {
                    $state.go("promote_agency_home");
                }
            });
        };

        $scope.showQQHelp = function () {
            $ionicPopup.alert({
                title: '温馨提示',
                template: ` 
                     <p style="text-align: center">遇到问题，请加入QQ群：</p>
                     <p><span style="-webkit-user-select:initial;">139549978</span>
                    (智算365使用指导群)，私信群里的指导老师，帮你解决问题。</p> `,
                okText: '确定'
            });
        };

        /**
         * 分享成功后的回调
         */
        $scope.shareSuccess = function () {
            //发送添加积分的请求
            let param = {"parentId": $rootScope.user.userId};
            profileService.parentShareFirst(param).then((data) => {
                if (data.code == 200) {
                    if (data.addSuccess) {
                        $scope.goToLoginPageAfterShare();
                    } else {
                        commonService.showAlert("提示", "分享信息发送成功！");
                    }
                } else {
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
                        $rootScope.student = [];
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

        $scope.goXlyPromote = function () {
            $state.go("xly_promote_home");
        };
        
        /*注冊返回*/
        $rootScope.viewGoBack=function () {
            return "exit";
        }.bind(this)
    });

