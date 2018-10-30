/**
 * Created by ZL on 2017/12/11.
 */
import './style.less';
import $ from 'jquery';
export default function () {
    return {
        restrict: 'E',
        scope: {

        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$timeout', '$state', 'stuWorkReportService', '$ionicPopup', '$ngRedux', '$ionicViewSwitcher', '$ionicScrollDelegate',
            function ($scope, $rootScope, $timeout, $state, stuWorkReportService, $ionicPopup, $ngRedux, $ionicViewSwitcher, $ionicScrollDelegate) {
              $scope.closeAd=function () {
                $rootScope.showMonitorAd=false;
              }
              $scope.listData=[];
              $scope.fetchMonitorInfo=function () {
                let clazzId=$ngRedux.getState().wl_selected_clazz.id
                stuWorkReportService.fetchMonitorInfo({
                  groupId:clazzId
                }).then((data)=>{
                  let list=JSON.parse(data.content)
                  list.forEach((v,k)=>{
                    v.timeDis=formatTime(v.startTime,v.stopTime)
                  })
                  $scope.listData=list;
                })
              }
              function formatTime(time1,time2) {
                let date=new Date(time1.replace(/-/g,"/"));
                let mon=date.getMonth()+1;
                let day=date.getDate();
                let a=time1.slice(11,16)
                let b=time2.slice(11,16)
                return [`${mon}月${day}日`,a+"-"+b]
              }
            }],
        link: function ($scope, $element, $attr, ctrl) {
          $scope.fetchMonitorInfo();
        }
    };
}