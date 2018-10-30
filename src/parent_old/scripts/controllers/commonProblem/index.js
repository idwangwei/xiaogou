/**
 * Created by ZL on 2017/7/20.
 */
import weChatIcon from './../../../pImages/wechat.ico';
import friendCircle from './../../../pImages/friend-circle.png';
import shareImg from './../../../pImages/officialAccounts/official_accounts_share_img.png';
import  controllers from './../index';
controllers.controller('commonProblem', ['$scope', '$rootScope', '$state', '$timeout', '$ngRedux', 'commonService', '$ionicActionSheet',
    function ($scope, $rootScope, $state, $timeout, $ngRedux, commonService, $ionicActionSheet) {

        $scope.getBase64Image = function (img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            var dataURL = canvas.toDataURL("image/" + ext);
            return dataURL;
        }

        $scope.shareOfficialAccounts = function () {
            let image = new Image();
            image.src = shareImg;
            let me = this;
            image.onload = ()=> {
                var dataURL = me.getBase64Image(image);
                $scope.shareDeal(dataURL);
            }
        }

        $scope.shareDeal = function (base64Img) {
            let userName = $rootScope.user.name;
            let teacherName = userName + "：";
            let shareContent = `我在“智算365”里获得了超多名校资讯和智算365福利，小伙伴们快来加入啊！`;
            $ionicActionSheet.show({
                buttons: [
                    {text: `<img class="reward-share-btn weChat-share-img" src="${weChatIcon}">分享到微信`},
                    {text: `<img class="reward-share-btn friend-circle-share-img" src="${friendCircle}">分享到朋友圈`},
                ],
                titleText: `<div>
                    <div class="reward-share-btn share-title" >${teacherName}</div>
                        <div class="reward-share-btn share-content" >${shareContent}</div>                   
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
                            teacherName,
                            'http://xuexiv.com/img/icon.png',
                            $scope.shareUrl,
                            () => {
                                commonService.showAlert("提示", "分享信息发送成功！");
                            }, (err) => {
                                commonService.showAlert("提示", err);
                            });
                    }
                    if (index == 0) {//点击分享到微信
                        if (!$rootScope.weChatInstalled) {
                            commonService.showAlert("提示", "没有安装微信！");
                            return;
                        }
                        Wechat.share({
                            scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                            message: {
                                title: teacherName,
                                description: shareContent,
                                thumb: "http://xuexiv.com/img/icon.png",
                                mediaTagName: "TEST-TAG-001",
                                messageExt: "这是第三方带的测试字段",
                                messageAction: "<action>dotalist</action>",
                                media: {
                                    type: Wechat.Type.IMAGE,
                                    image: base64Img,
                                }
                            },
                        }, () => {
                            commonService.showAlert("提示", "分享信息发送成功！");
                        }, (reason) => {
                            commonService.showAlert("提示", reason);
                        });
                    }

                    if (index == 1) {//点击分享到微信朋友圈
                        if (!$rootScope.weChatInstalled) {
                            commonService.showAlert("提示", "没有安装微信！");
                            return;
                        }
                        Wechat.share({
                            scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                            message: {
                                title: teacherName,
                                description: shareContent,
                                thumb: "http://xuexiv.com/img/icon.png",
                                mediaTagName: "TEST-TAG-001",
                                messageExt: "这是第三方带的测试字段",
                                messageAction: "<action>dotalist</action>",
                                media: {
                                    type: Wechat.Type.IMAGE,
                                    image: base64Img,
                                }
                            },
                        }, () => {
                            commonService.showAlert("提示", "分享信息发送成功！");
                        }, (reason) => {
                            commonService.showAlert("提示", reason);
                        });
                    }
                    return true;
                }
            });
        }

        $scope.isMobile = function () {
            return $rootScope.platform.isMobile() && $rootScope.weChatPluginInstalled;
        }
        $scope.isIos = function () {
            return $rootScope.platform.IS_IPHONE || $rootScope.platform.IS_IPAD || $rootScope.platform.IS_MAC_OS;
        }

        $scope.back = function () {
            history.back();
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);
