/**
 * Created by WangLu on 2017/1/11.
 */
import  controllers from './../index';

controllers.controller('xlyPromoteHomeCtrl', ['$scope', '$rootScope', '$state', '$log', '$ionicPopup', 'commonService', 'profileService', 'finalData',
	function ($scope, $rootScope, $state, $log, $ionicPopup, commonService, promoteService, finalData) {
		
		$scope.user = $rootScope.user;
		$scope.invitateCode = ""; //在rootScope上获取
		$scope.flag = true;
		$scope.qrCodeUrl = "http://www.xuexiv.com/wechat_coach/?#/xly_vip?agentId=" + $scope.user.userId
			+ "&currentTimestamp" + new Date().getTime();
		$scope.qrCodeImg = window.QRCode.generatePNG($scope.qrCodeUrl, {modulesize: 6, margin: 0});//二维码图片
		
		/**
		 * 推广到微信
		 */
		$scope.promoteToWeiXin = function () {
			
			if (!$scope.$root.weChatPluginInstalled) {
				commonService.showAlert("提示", "没有安装微信插件！");
				return;
			}
			if (!$scope.$root.weChatInstalled) {
				commonService.showAlert("提示", "没有安装微信！");
				return;
			}
			
			let inviteContent = `恭喜您获得智算365VIP权限！原价￥2560的“超级学霸计划”享￥498优惠价`;
			Wechat.share({
				scene: Wechat.Scene.SESSION,  // 分享到朋友或群
				message: {
					title: "智算365“超级学霸计划”优惠",
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
				commonService.showAlert("提示", "邀请信息发送成功！");
			}, (reason)=> {
				commonService.showAlert("提示", reason);
			});
		};
		
		/**
		 * 跳转到我的钱包页面
		 */
		$scope.gotoMyAssets = function () {
			
			$state.go("xly_promote_assets");
		};
		
		$scope.back = function () {
			$state.go("home.person_index");
		}
		/*返回注册*/
		$rootScope.viewGoBack = $scope.back.bind($scope);
	}]);
