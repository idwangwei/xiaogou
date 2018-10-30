/**
 * Created by WangLu on 2017/1/11.
 */
import  controllers from './../index';

controllers.controller('promoteHomeCtrl', ['$scope','$rootScope', '$state', '$log', '$ionicPopup','commonService', 'profileService', 'finalData',
    function ($scope, $rootScope,$state, $log,$ionicPopup, commonService,promoteService,finalData) {

        $scope.user = $rootScope.user;
        $scope.invitateCode = ""; //在rootScope上获取
        $scope.readProtocolFlag = !!window.localStorage.getItem("promoting_read_protocol_flag");
        $scope.flag = true;

        $scope.protocolText =[{
            clauseTitle:"1、服务条款的接受与修改",
            clauses:['1）本协议由您和四川爱里尔科技有限公司（以下简称“爱里尔”）共同签署，在您使用“智算365”软件服务平台并开通付费项目之前，' +
            '请仔细阅读本协议(无民事行为能力人、限制民事行为能力人应在法定监护人陪同下阅读)。'
                ,'2）一旦您使用“智算365”软件服务平台且在支付页面点击“支付”按钮，即表示您已仔细阅读并同意完全接受本协议所有条款和所有条件的约束，' +
                '并自动成为智算365的充值用户。'
                ,'3）注意：您正在购买付费内容，无民事行为能力、限制民事行为能力人应在法定监护人陪同下完成购买。如因监护人监管疏漏导致软件费用的划扣，' +
                '一旦发生退款请求，须第一时间与本公司取得联系，协商后本公司将根据实际情况予以处理。（需要修改）'
                ,'4）智算365有权随时修改本协议，一旦协议发生变更，将在智算365软件服务平台公示的方式通知您；修改后的协议自公示时生效。' +
                '本协议的条款修改后，如果您不同意本协议条款的修改，可以取消并停止继续使用智算365软件服务；如果您继续使用智算365软件服务，' +
                '则视为您已经接受本协议的全部修改。']
        },
        ];

        /**
         * 推广到微信
         */
        $scope.promoteToWeiXin = function () {
            if(!$scope.readProtocolFlag){
                commonService.showAlert("提示", "请您先阅读奖励规则！");
                return;
            }

            if (!$scope.$root.weChatPluginInstalled) {
                commonService.showAlert("提示", "没有安装微信插件！");
                return;
            }
            if (!$scope.$root.weChatInstalled) {
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
                        webpageUrl: finalData.GONG_ZHONG_HAO_QRIMG_URL
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
        $scope.promoteToQQ = function () {
            if(!$scope.readProtocolFlag){
                commonService.showAlert("提示", "请您先阅读奖励规则！");
                return;
            }
            if (!$scope.$root.QQPluginInstalled) {
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
                finalData.GONG_ZHONG_HAO_QRIMG_URL,
                ()=> {
                    commonService.showAlert("提示", "推广邀请信息发送成功！");
                }, (err)=> {
                    commonService.showAlert("提示", err);
                });
        };

        /**
         * 跳转到我的钱包页面
         */
        $scope.gotoMyAssets  = function () {
            if(!$scope.readProtocolFlag){
                commonService.showAlert("提示", "请您先阅读奖励规则！");
                return;
            }
            $state.go("promote_assets");
        };

        /**
         * 显示奖励规则
         */
        $scope.showProtocol = function () {
            if($scope.readProtocolFlag && $scope.flag){
                $scope.flag = false;
                return;
            }
            let protocol = ` <h5 style="text-align: center;">智算365用户购买协议</h5>
                            <div style="width:90% ; height:100% ;margin-left:5% ">
                                <div ng-repeat="text in protocolText">
                                    <p style="font-size: 14px;">{{text.clauseTitle}}</p>
                                    <div ng-repeat="clause in text.clauses">
                                        <p>&nbsp;&nbsp;&nbsp;&nbsp;{{clause}}</p>
                                    </div>
                                </div>
                            </div>
                `;

            $ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
                title: "推广规则",
                template: protocol,
                scope: $scope,
                buttons: [
                    {
                        text: "<b>阅读并同意</b>",
                        type: "button-positive",
                        onTap: e => {
                            $scope.readProtocolFlag = true;
                           window.localStorage.setItem("promoting_read_protocol_flag",$scope.readProtocolFlag);
                            return;
                        }
                    },
                    {
                        text: "再想一想",
                        type: "",
                        onTap: function (e) {
                            $scope.readProtocolFlag = false;
                            window.localStorage.setItem("promoting_read_protocol_flag",$scope.readProtocolFlag);
                            $state.go("home.person_index"); //返回到我的頁面
                            return ;
                        }
                    }
                ]
            });
        };

        $scope.showProtocol();
        $scope.back=function () {
            $state.go("home.person_index");
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);
