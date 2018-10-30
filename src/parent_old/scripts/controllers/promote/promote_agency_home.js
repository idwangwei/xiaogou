/**
 * Created by WangLu on 2017/1/16.
 */
import  controllers from './../index';
import * as QRCode from './qr';

controllers.controller('promoteAgencyHomeCtrl', ['$scope','$rootScope', '$state', '$log', 'commonService', 'promoteService',
    function ($scope, $rootScope,$state, $log, commonService,promoteService) {
        $scope.agencyFlag = promoteService.agencyFlag;

        $scope.user = $rootScope.user;
        $scope.isShowPtotocolFlag = promoteService.agencyFlag.canApplyAgency && !promoteService.agencyFlag.isAgency; //是否显示奖励规则
        $scope.isShowQrCodeFlag = false; //是否显示二维码
        $scope.btnReadProtocol = window.localStorage.getItem($scope.user.loginName+"/read_proxy_protocol_flag"); //是否已经阅读了规则
        $scope.btnReadProtocol = promoteService.agencyFlag.isAgency; //是否已经阅读了规则
        $scope.qrCodeUrl = "http://www.xuexiv.com/register?invitationCode="+ $scope.user.userId; //二维码链接
        $scope.qrCodeImg = window.QRCode.generatePNG($scope.qrCodeUrl, {modulesize: 6, margin: 6});//二维码图片
        /*  $scope.protocolText = [{
            clauseTitle:"第一条  推广和获得提成的流程",
            clauses:['1.家长账号提交申请，成为推广代理，将会获得一个专属二维码。'
                ,'2.让其他人扫一扫您的二维码绑定，成为您的粉丝。'
                ,'3.没有智算365账号的粉丝扫描二维码后需要完成注册。'
                ,'4.粉丝一旦付费购买增值功能，您就可以获得提成。'
                ,'5.您的粉丝也可以不购买，也可以不是推广代理。'
                ,'6.粉丝邀请更多人加入使用，您可以从粉丝的进一步推广中提成。'
                ,'7.两个推广代理之间不能同时是对方的粉丝。'
                ,'8.代理应以正当合法的方式推广，否则责任自负。'
                ,'9.教师账号没有权限申请代理。']
        },{
            clauseTitle:"第二条  实名制",
            clauses:['1.该推广账号的姓名应为实名，手机号必须是名下有效的手机号，以便提现时电话确认身份。'
            ,'2.提现时需要提供与账号姓名一致的身份证信息和银行卡号，身份证信息与银行卡号的信息必须准确无误且一致。']
        }];*/
        $scope.protocolText = [{
            clauseTitle:"第一条 如何取得代理资格?",
            clauses:['点击本页下方＂同意协议＂即可。只有家长才能申请，老师和学生没有权限申请。']
        },{
            clauseTitle:"第二条 如何代理？",
            clauses:['1、提交申请后，将会获得一个代理二维码。'
                ,'2、让其他人扫一扫您的二维码绑定为粉丝。'
                ,'3、粉丝，或粉丝的粉丝，在此之后购买智算365服务，您即可获得提成。']
        },{
            clauseTitle:"第三条 如何提现？",
            clauses:['1、代理账号的姓名应为实名，手机号必须是名下有效的手机号，以便提现时电话确认身份。'
                ,'2、提现时需要提供与账号姓名一致的身份证信息和银行卡号。'
                ,'3、首次提现需要达到200元方可提现，以后每次提现需达到整百才能提。']
        }];

        $scope.toggleQrShowFlag = function (event) {
            if(event){
                event.stopPropagation();
            }
            $scope.isShowQrCodeFlag = !$scope.isShowQrCodeFlag;
        };

        $scope.toggleProtocolShowFlag = function (event) {
            if(event){
                event.stopPropagation();
            }
            $scope.isShowPtotocolFlag = !$scope.isShowPtotocolFlag;
        };

        $scope.toggleReadBtn = function (event) {
            if(event){
                event.stopPropagation();
            }
            $scope.btnReadProtocol = !$scope.btnReadProtocol;
            // window.localStorage.setItem($scope.user.loginName+"/read_proxy_protocol_flag",$scope.btnReadProtocol);
        };

        /**
         * 关闭协议
         */
        $scope.closeProtocolBack = function () {
            $scope.toggleProtocolShowFlag();
            if(!this.agencyFlag.isAgency){
                $state.go("home.person_index"); //跳转回我的页面
            }
        };

        /**
         * 申请代理
         */
        $scope.applyPromoteAgency = function (event) {
            event.stopPropagation();
            if(!$scope.btnReadProtocol){
                //commonService.alertDialog("请先阅读推广协议！");
                return;
            }
            promoteService.applyForAgency($scope.user.userId).then(data=>{
                if(data){ //code不是200说明申请失败
                    $scope.toggleProtocolShowFlag(); //关闭协议
                }else{
                    $state.go("home.person_index"); //跳转回我的页面
                }
            })
            
        };

        /**
         * 推广到微信
         */
        $scope.shareToWeiXin = function () {
            if (!$rootScope.weChatPluginInstalled) {
                commonService.showAlert("提示", "没有安装微信插件！");
                return;
            }
            if (!$rootScope.weChatInstalled) {
                commonService.showAlert("提示", "没有安装微信！");
                return;
            }
            let name = $rootScope.student[0].studentName;
            let inviteContent = `${name}的家长向您推荐智算365，点击下载安装。`;
            Wechat.share({
                scene: Wechat.Scene.SESSION ,  // 分享到朋友或群
                message: {
                    title: "智算365推广邀请",
                    description: inviteContent,
                    thumb: "http://xuexiv.com/img/icon.png",
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "这是第三方带的测试字段",
                    messageAction: "<action>dotalist</action>",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: $scope.qrCodeUrl
                    }
                },
            }, ()=> {
                commonService.showAlert("提示", "推广邀请信息发送成功！");
            }, (reason)=> {
                commonService.showAlert("提示", reason);
            });
        };

        /**
         * 推广到QQ
         */
        $scope.shareToQQ = function () {
            if (!$rootScope.QQPluginInstalled) {
                commonService.showAlert("提示", "没有安装QQ插件！");
                return;
            }
            QQ.setOptions({
                appId: '1105576253',
                appName: 'XiaoGou',
                appKey: 'IaDN9O8abL0FJ6gT'
            });
            let name = $rootScope.student[0].studentName;
            let inviteContent = `${name}的家长向您推荐智算365，点击下载安装。`;
            QQ.share(inviteContent,
                '智算365推广邀请',
                'http://xuexiv.com/img/icon.png',
                $scope.qrCodeUrl,
                ()=> {
                    commonService.showAlert("提示", "推广邀请信息发送成功！");
                }, (err)=> {
                    commonService.showAlert("提示", err);
                });
        };

        $scope.isShowInvite = function()  {
            if(typeof Wechat ==   "undefined") return false; //插件不存在不显示
            if(commonService.judgeSYS() == 1) return true; //安卓系统显示
            if(commonService.judgeSYS() == 3) return false; //非移动端设备不显示

            let appNumVersion = commonService.getAppNumVersion();
            if(!appNumVersion)return false;

            let ver = "1.8.8";
            let verArr = ver.split(".");
            let appVerArr = appNumVersion.split(".");
            while(appVerArr.length < verArr.length){
                appVerArr.push(0);
            }
            let isShow = true;
            for(let i = 0 ; i<appVerArr.length; i++){
                if(Number(appVerArr[i]) > Number(verArr[i])){
                    break;
                }else if(Number(appVerArr[i]) < Number(verArr[i])){
                    isShow = false;
                    break;
                }
            }
            return isShow;
        };

        $scope.back=function () {
            $state.go("home.person_index");
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);




