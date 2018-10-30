
import directives from '../index';
import qqIcon from "../../../tImages/qq.ico";
import weChatIcon from "../../../tImages/wechat.ico";


directives.directive('shareBtn', ['commonService','$ionicActionSheet','finalData', function (commonService, $ionicActionSheet,finalData) {
    return {
        restrict: 'E',
        replace: true,
        template: `<span id="shareBtn" ng-click="showShareMenu()" ng-bind-html="tpl" 
            ng-show="$root.platform.isMobile()&&$root.weChatPluginInstalled && isShowIosShare()"></span>`,
        scope: {
            shareContent: '@',
            tpl: '@',
            shareUrl:'@',
            clazzId:'@',
            teacherName:'@'
        },
        controller: ['$scope', function ($scope) {//TODO 发送的链接换成二维码的链接
            $scope.showShareMenu = function () {
                var shareContent = $scope.shareContent;
                var shareURL = $scope.shareUrl ?
                        $scope.shareUrl+'?clazzId='+$scope.clazzId+'&teacherName='+encodeURI($scope.teacherName)
                        :finalData.GONG_ZHONG_HAO_QRIMG_URL;
                
                $ionicActionSheet.show({
                    //buttons:btnArr,
                    buttons: [
                        {text: `<img class="weChat-share-img" src="${weChatIcon}">通知到微信`},
                        {text: `<img class="qq-share-img" src="${qqIcon}">通知到QQ`}
                    ],
                    titleText: `<div>
                    <div class="share-title">通知内容：</div>
                        <div class="share-content">${shareContent}</div>
                    </div>`,
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        if (index == 1) {//点击分享到QQ
                            QQ.setOptions({
                                appId: '1105576253',
                                appName: 'XiaoGou',
                                appKey: 'IaDN9O8abL0FJ6gT'
                            });
                            QQ.share(shareContent,
                                '智算365通知',
                                'http://xuexiv.com/img/icon.png',
                                    shareURL,
                                ()=> {
                                    commonService.showAlert("提示", "通知成功！");
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
                                    title: "智算365",
                                    description: shareContent,
                                    thumb: "http://xuexiv.com/img/icon.png",
                                    mediaTagName: "TEST-TAG-001",
                                    messageExt: "这个字段没有用",
                                    messageAction: "<action>dotalist</action>",
                                    media: {
                                        type: Wechat.Type.WEBPAGE,
                                        webpageUrl: shareURL
                                    }
                                },
                            }, function () {
                                commonService.showAlert("提示", "通知成功！");
                            }, function (reason) {
                                commonService.showAlert("提示", reason);
                            });
                        }

                        return true;
                    }
                });
            };
            $scope.isShowIosShare = function(){
                return commonService.judgeAppVersion();
            }
        }],
        link: function ($scope, element, attrs) {

        }
    }
}]);