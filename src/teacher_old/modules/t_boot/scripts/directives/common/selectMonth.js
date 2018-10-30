/**
 * Created by 邓小龙 on 2015/8/28.
 * @description  选择月份。
 */
define(['./../index'],function(directives){
    directives.directive('selectMonth',['$ionicPopup','$log','commonService','finalData','dateUtil',function($ionicPopup,$log,commonService,finalData,dateUtil){
        return {
            restrict:'EA',
            scope:{
                month:'='
            },
            templateUrl:'./partials/directive/select_month/select_month.html',
            controller:['$scope',function($scope){

                /**
                 * 编辑月份
                 */
                $scope.editMonth=function(){
                    $scope.formData={};
                    $scope.showPopup();
                };

                /**
                 * 上一个月
                 */
                $scope.preMonth=function(){
                    var retInfo= monthInitHandle();
                    if(retInfo){
                        if(retInfo.month==1){
                            $scope.month=(retInfo.year-1)+"-"+"12";
                            return ;
                        }
                        $scope.month=retInfo.year+"-"+(monthFormat(retInfo.month-1));
                    }
                };

                /**
                 * 下一个月
                 */
                $scope.nextMonth=function(){
                    var retInfo=monthInitHandle();
                    if(retInfo){
                        if(retInfo.month==12){
                            $scope.month=(retInfo.year+1)+"-"+"01";
                            return;
                        }
                        $scope.month=retInfo.year+"-"+(monthFormat(retInfo.month+1));
                    }
                };

                /**
                 * 显示定制弹出框
                 */
                $scope.showPopup = function () {
                    $ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
                        template: "<div class='item item-input block-input'>" +
                                  "<input type='text' placeholder='设置月份（如2015-07,可以设置空）' ng-model='formData.month'>" +
                                  '</div>',
                        title: "设置月份",
                        scope: $scope,
                        buttons: [
                            {
                                text: "<b>确定</b>",
                                type: "button-positive",
                                onTap: function (e) {
                                    $scope.formData.flag = true;
                                }
                            },
                            {text: "取消"}

                        ]
                    }).then(function (data) {//弹窗关闭时，处理
                        if ($scope.formData.flag) {//判断是否点击了保存按钮
                            try{
                                var tempArray=$scope.formData.month.split("-");
                                var year=parseInt(tempArray[0]) ;
                                var month=parseInt(tempArray[1]);
                                if(year>1900&&month>0&&month<13){
                                    $scope.month=year+"-"+monthFormat(month);
                                    return;
                                }
                                $scope.month="0000-00";
                            }catch(e){
                                $scope.month="0000-00";
                            }

                        }
                    });
                };

                /**
                 * 月份格式化 如8 格式成08
                 * @param month 月份
                 */
                function monthFormat(month){
                    if(month<10){
                        return "0"+month;
                    }
                    return month;
                }

                /**
                 * 月份初始化处理
                 * @param  month 月份
                 */
                function monthInitHandle(){
                    if(!$scope.month||$scope.month=="0000-00"){
                        $log.log("month is undefined!");//如果month没有定义，就默认当前月
                        var now = new Date();//当前时间
                        var formatStr=dateUtil.dateFormat.prototype.DEFAULT_MONTH_FORMAT;//格式成“2015-08”
                        $scope.month= dateUtil.dateFormat.prototype.format(now,formatStr); //当前月份
                    }
                    var dateArray=$scope.month.split("-");
                    if(!dateArray||dateArray.length<2){
                        $log.log("month is error type!");
                        return;
                    }
                    var year=parseInt(dateArray[0]);
                    var month=parseInt(dateArray[1]) ;
                    return {year:year,month:month};
                }


            }],
            link:function($scope,element,attrs){
            }
        }
    }]);
});