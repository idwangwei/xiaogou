/**
 * Created by WL on 2017/6/2.
 */
import directives from '../index';
import "./style.less";
import btnRecommend from "./../../../tImages/workStuList/send_msg_to_student02.png";
import btnRecommendOk from "./../../../tImages/workStuList/recommend_ok.png";
import qqIcon from "./../../../tImages/qq.ico";
import weChatIcon from "./../../../tImages/wechat.ico";
import friendCircle from "./../../../tImages/friend-circle.png";
import shareImg from "./../../../tImages/diagnose/share_img_to_p.png";


directives.directive('recommendTraining', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        replace: false,
        template: require('./recommend_training_pets.html'),
        scope: {
            fromUrl:'@'
        },
        controller: ['$scope', '$rootScope', '$state', 'commonService', '$ionicActionSheet', '$ionicPopup','$window','finalData',
            function ($scope, $rootScope, $state, commonService, $ionicActionSheet, $ionicPopup,$window,finalData) {
                $scope.isShowRecommendFlag = true;
                $scope.btnRecommend = btnRecommend;
                $scope.btnRecommendOk = btnRecommendOk;
                $scope.user = $rootScope.user;
                //$scope.shareUrl = "http://www.xuexiv.com/register?invitationCode="+ $scope.user.userId; //推广链接
                $scope.shareUrl = finalData.GONG_ZHONG_HAO_QRIMG_URL;

                // $scope.title = "学霸驯宠记——提分神器";
                // $scope.describe = "该功能由教研员团队精心打造，紧扣教材和考纲，帮助学生诊断未掌握的考点，强化提分。多地实践证明，能大幅提升<em style='font-weight: bold'>整班成绩</em>和<em style='font-weight: bold'>区域排名</em>。";
                // $scope.tip = "应广大老师迫切要求，我们推出了“学霸培养计划”，让学生能够免费使用“学霸驯宠记”。";
                // $scope.alertBoxContent = "“学霸驯宠”能诊断孩子还有哪些考点未掌握，并可强化提分。家长自愿开通。";
                $scope.title = "诊断提分";
                $scope.subTitle = '考点全覆盖，查漏补缺';
                $scope.describe = '该功能由教研员团队精心打造，紧扣教材和考纲，帮助每个学生诊断未掌握的考点，针对性出题，强化提分。多地实践证明，能大幅提升整班成绩和区域排名。';
                // $scope.tip = '应广大老师迫切要求，学生可以免费使用该功能。';
                $scope.tip = '学生能免费使用“诊断提分”版块';
                $scope.alertBoxContent = '学生端的“诊断提分”功能能诊断孩子还有哪些考点未掌握，并可快速提分，家长自愿开通。';
                $scope.hideRecommendTable = function () {
                    $timeout(function () {
                        $(".recommend-training-back-drop").css("display", "none");
                        $scope.isShowRecommendFlag = true;
                    }, 300);
                    let bottom = -400;
                    let height = $(".recommend-training-area").height();
                    let pos = $window.innerWidth;
                    if(pos > 700){
                        bottom = bottom - pos / 2 ;
                    }
                    $(".recommend-training-area").css("bottom", bottom);
                };

                $scope.showRecommendTable = function (e,stuId) {
                    $scope.stuId = stuId;
                    $(".recommend-training-back-drop").css("display", "block");
                    $timeout(function () {
                        $(".recommend-training-area").css("bottom", 0);
                    },0);
                };

                $scope.$parent.$on("recommend.show", $scope.showRecommendTable.bind($scope));
                $scope.$parent.$on("recommend.hide", $scope.hideRecommendTable.bind($scope));

                $scope.gotoXly = function () {
                    $state.go("xly_select",{backUrl:$scope.fromUrl,stuId:$scope.stuId});//TODO
                };

                $scope.recommendUse = function () {
                    $scope.hideRecommendTable();
                    if(commonService.judgeSYS() == 3) { //非移动端设备不显示
                        $timeout(()=> {
                            $scope.isShowRecommendFlag = false;
                            $scope.showRecommendTable();
                        },300);
                        return;
                    }
                    $scope.recommendUseIos();
                };

                $scope.getBase64Image =function(img) {
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
                    var dataURL = canvas.toDataURL("image/" + ext);
                    return dataURL;
                }

                $scope.recommendUseIos = function() {
                    let image = new Image();
                    image.src = shareImg;
                    image.onload = ()=> {
                        var dataURL = $scope.getBase64Image(image);
                        this.shareDeal(dataURL);
                    }
                }


                    // <div class="reward-share-btn share-content selectable" >${shareContent}</div>
                $scope.shareDeal = function (base64Img) {
                    // let teacherName = $scope.user.name+"老师：";
                    let teacherName = "各位老师：";
                    // let shareContent = `“学霸驯宠”能诊断孩子还有哪些考点未掌握，并可强化提分。家长自愿开通。`;
                    // let shareContent = `学生端的”提分“功能能诊断孩子还有哪些考点未掌握，并可快速提分。去免费领取该功能三年使用权，家长自愿开通。`;
                    let shareContent = `根据最近作业完成情况，有部分孩子考点掌握不理想。每次作业的下方都会显示孩子的薄弱考点，请关注，并督促孩子查漏补缺。`;
                    $ionicActionSheet.show({
                        buttons: [
                            {text: `<img class="reward-share-btn weChat-share-img" src="${weChatIcon}">发到微信`},
                            {text: `<img class="reward-share-btn friend-circle-share-img" src="${friendCircle}">发到朋友圈`},
                            {text: `<img class="reward-share-btn qq-share-img" src="${qqIcon}" >请手动复制到QQ群`}
                        ],
                        titleText: `<div class="selectable">
                    <div class="reward-share-btn share-title" >各位家长：</div>
                        <div class="reward-share-btn share-content" >${shareContent}</div>
                    </div><div class="sub-title-remind-teacher">(长按可复制)</div>`,
                        cancelText: '取消',
                        buttonClicked: (index) => {
                            if (index == 2) {
                                /*QQ.setOptions({
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
                                    });*/
                                commonService.showAlert("提示", "请手动复制到QQ群");
                            }
                            if (index == 0) {//点击分享到微信
                                if (!$scope.$root.weChatInstalled) {
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
                                           /* type: Wechat.Type.WEBPAGE,
                                            webpageUrl: $scope.shareUrl,*/
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
                                if (!$scope.$root.weChatInstalled) {
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
                                           /* type: Wechat.Type.LINK,
                                            webpageUrl: $scope.shareUrl,*/
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
                };


                $scope.howToUseFree = function () {

                }

            }],
        link: function ($scope, element, attrs) {
            $scope.$on('$destroy', () => {

            });
        },

    }
}]);