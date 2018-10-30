/**
 * Created by WangLu on 2017/1/11.
 */
import  controllers from './../index';

controllers.controller('xlyPromoteAssetsCtrl', ['$scope', '$rootScope', '$state', '$log', 'commonService', 'promoteService', 'ionicDatePicker', 'dateUtil',
	function ($scope, $rootScope, $state, $log, commonService, promoteService, ionicDatePicker, dateUtil) {
		
		$scope.user = $rootScope.user;
		$scope.money = 0;
		promoteService.personDirectPagePosition = 0;
		
		$scope.vipsInfo = {
			"count": 0,
			"totalMoney": 0,
			"orders": [
				{
					"realName": "~",
					"userName": "~",
					"school": "~",
					"grade": "~",
					"orderTime": "~"
				}
			]
		};
		$scope.queryParam = {
			userId: $scope.user.userId,
			startTime: "",
			endTime: "",
			sortColumn: "time",
			sortType: 'desc',
			pageIndex: 0,
			pageSize: 20
		};
		$scope.showLoadMore = true;
		$scope.isSetSortType = false;
		
		$scope.getPromoteAsset = function (param) {
			param.sortType = $scope.isSetSortType ? 'asc' : 'desc';
			promoteService.getXlyPromoteDetails(param).then(data=> {
				if (data.code != 200) {
						$scope.queryParam.pageIndex -= 1;
					commonService.alertDialog(data.msg || "网络连接不畅，请稍后重试...");
					return;
				}
				$scope.vipsInfo.count = data.count;
				$scope.vipsInfo.totalMoney = (data.totalMoney/100).toFixed(2);
				if (param.pageIndex == 1) {
					$scope.vipsInfo.orders = data.orders;
					if(!$scope.vipsInfo.orders.length){
							$scope.vipsInfo.orders.push({
									"realName": "~",
								"userName": "~",
								"school": "~",
								"grade": "~",
								"orderTime": "~"
							})
					}
				} else {
					$scope.vipsInfo.orders.push(...data.orders);
				}
				$scope.showLoadMore = data.orders && data.orders.length >= param.pageSize;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			}, ()=> {
				$scope.queryParam.pageIndex -= 1;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
		};
		
		$scope.clickWithdrawCashBtn = function () {
			let messageStr;
			if ($scope.money < 200) {
				messageStr = '首次满200才可提现'
			} else {
				messageStr = '请拨打电话028-86956907，进行人工提现。'
			}
			commonService.showAlert(
				'提示信息',
				`<p style="text-align: center">${messageStr}</p>`
			);
		};
		
		
		$scope.back = function () {
			$state.go("xly_promote_home")
		};
		$scope.selectDone = function () {
			
		};
		
		$scope.openDatePicker = function (flag) {
			ionicDatePicker.openDatePicker({
				closeOnSelect: true,
				callback: function (val) {  //Mandatory
					let formatUtil = new dateUtil.dateFormat();
					let formatStr = formatUtil.format(new Date(val), formatUtil.DEFAULT_DATETIME_FORMAT);
					flag ? $scope.queryParam.endTime = formatStr : $scope.queryParam.startTime = formatStr;
				},
			});
		};
		/*返回注册*/
		$rootScope.viewGoBack = $scope.back.bind($scope);
		$scope.doRefresh = function () {
			$scope.queryParam.pageIndex = 1;
			$scope.getPromoteAsset($scope.queryParam);
		};
		$scope.loadMoreData = function () {
			$scope.queryParam.pageIndex += 1;
			$scope.getPromoteAsset($scope.queryParam);
		};
		$scope.setSortType = function (type) {
			$scope.isSetSortType = $scope.queryParam.sortColumn == type ? !$scope.isSetSortType : $scope.isSetSortType;
			$scope.queryParam.sortColumn = type;
			$scope.doRefresh();
		}
	}]);
