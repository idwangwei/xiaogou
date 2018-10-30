/**
 * Created by 邓小龙 on 2015/11/18.
 */
import directives from './../index';

directives.directive('homeContent', ['$log', function ($log) {
    return {
        restrict: 'EA',
        scope: {
            verticalPad: '@',
            horizontalPad: '@',
            rowCount: '@',
            rowFlex: '@',
            mainTimes: '='
        },
        controller: ['$scope', function ($scope) {
            this.getHomeContentHeight = function () {
                return window.innerHeight - $("#parentConnt").offset().top;
            };
            this.getVerticalPad = function () {
                try {
                    return parseInt($scope.verticalPad);
                } catch (e) {
                    $log.error('parse verticalPad error!');
                    return 0;
                }
            };
            this.getHorizontalPad = function () {
                try {
                    return parseInt($scope.horizontalPad);
                } catch (e) {
                    $log.error('parse horizontalPad error!');
                    return 0;
                }
            };
            this.getRowCount = function () {
                try {
                    var rowCount = parseInt($scope.rowCount);
                    return rowCount >= 3 ? 3 : rowCount;//只支持最多3行，上中下布局。
                } catch (e) {
                    $log.error('parse rowCount error!');
                    return 0;
                }
            };
            this.getRowFlexTotal = function () {
                var rowFlexTotal = 0;
                try {
                    var rowFlex = this.getRowFlex();
                    var rowCount = this.getRowCount();
                    _.each(rowFlex, function (data, index) {
                        if (index <= rowCount) {
                            rowFlexTotal += data;
                        }
                    });
                } catch (e) {
                    $log.error('parse rowCount error!');
                    rowFlexTotal = 0;
                }
                return rowFlexTotal;
            };
            this.getRowFlex = function () {
                var rowFlex = [];
                try {
                    rowFlex = JSON.parse($scope.rowFlex);

                } catch (e) {
                    $log.error('parse rowFlex error!');
                    rowFlex = [];
                }
                if (this.getRowCount() > 0) {
                    var rowCount = this.getRowCount();
                    if (rowFlex.length == 0) {
                        for (var i = 0; i < rowCount; i++) {
                            rowFlex.push(1);
                        }
                    }
                }
                return rowFlex;
            };
            /**
             * 中间区域计算后的实际高度
             */
            this.calMainHeight = function () {
                var rowFlex = this.getRowFlex();
                var rowFlexTotal = this.getRowFlexTotal();
                var rowCount = this.getRowCount();
                var calRowHeight = 0;
                if (rowFlex.length == 3 && rowCount == 3) {//有三行，即为中间区域
                    calRowHeight = this.calHeight() * (rowFlex[1] / rowFlexTotal);
                    calRowHeight = calRowHeight * parseInt($scope.mainTimes);
                }
                /*if(rowFlex.length==2&&rowCount==2){//有三行，即为中间区域
                 calRowHeight=this.calHeight()*(rowFlex[0]/rowFlexTotal);
                 calRowHeight= calRowHeight*parseInt($scope.mainTimes);
                 }*/
                return calRowHeight;
            };

            /**
             * 计算后的实际高度
             */
            this.calHeight = function () {
                return this.getHomeContentHeight() - this.getVerticalPad() * (this.getRowCount() + 1);
            };


        }],
        controllerAs: 'homeCtrl',
        link: function ($scope, element, attrs) {
            if ($scope.homeCtrl.getRowCount() > 0) {
                var rowFlex = $scope.homeCtrl.getRowFlex();
                var rowFlexTotal = $scope.homeCtrl.getRowFlexTotal();
                var childArry = element.children();
                var rowCount = $scope.homeCtrl.getRowCount();
                var calHeight = $scope.homeCtrl.calHeight();
                var verticalPad = $scope.homeCtrl.getVerticalPad();
                var horizontalPad = $scope.homeCtrl.getHorizontalPad();
                var marginValue = verticalPad + "px " + horizontalPad + "px";
                _.each(childArry, function (childEle, index) {
                    if (index < rowCount) {
                        var calRowHeight = calHeight * (rowFlex[index] / rowFlexTotal);
                        if (index == 1 && rowCount == 3) {//有三行，且当前为第二行，即为中间区域
                            calRowHeight = calRowHeight * parseInt($scope.mainTimes);
                        }
                        /*if(index==0&&rowCount==2){//有三行，且当前为第二行，即为中间区域
                         calRowHeight= calRowHeight*parseInt($scope.mainTimes);
                         }*/
                        $(childEle).css({height: calRowHeight, margin: marginValue});
                    }
                });
            }
        }
    }
}]).directive('stuContent', [function () {
    return {
        restrict: 'EA',
        require: '^homeContent',
        scope: {
            stuCount: '=',
            rowFlex: '@'
        },
        controller: ['$scope', function ($scope) {
            this.getRowFlex = function () {
                var rowFlex = [];
                try {
                    rowFlex = JSON.parse($scope.rowFlex);

                } catch (e) {
                    $log.error('parse rowFlex error!');
                    rowFlex = [];
                }
                return rowFlex;
            };
            this.getRowFlexSum = function () {
                var rowFlex = this.getRowFlex();
                var rowFlexSum = 0;
                if (rowFlex.length > 0) {
                    _.each(rowFlex, function (item) {
                        rowFlexSum += item;
                    });
                }
                return rowFlexSum;
            };
            this.getRowFlexArray = function () {
                var rowFlex = this.getRowFlex();
                var rowFlexSum = this.getRowFlexSum();
                var rowFlexArray = [];
                if (rowFlex.length > 0) {
                    _.each(rowFlex, function (item) {
                        rowFlexArray.push(item / rowFlexSum);
                    });
                }
                return rowFlexArray;
            }
        }],
        controllerAs: 'stuCtrl',
        link: function ($scope, element, attrs, homeContentCtrl) {
            var childArry = element.children();
            var vertivalPad = homeContentCtrl.getVerticalPad();
            var stuCount = parseInt($scope.stuCount);
            var mainTotalHeight = homeContentCtrl.calMainHeight() - vertivalPad * (stuCount - 1);//这里需要减去内部margin-top的值。
            var stuHeight = mainTotalHeight / stuCount;
            var rowFlexArray = $scope.stuCtrl.getRowFlexArray();
            if (element.index() == 0) {//因为父级已经设置了margin那么子的第一个row不设置margin-top
                element.css({height: stuHeight});
            } else {
                element.css({height: stuHeight, 'margin-top': vertivalPad});
            }
            _.each(childArry, function (childEle, index) {//目前学生内容就两行，一行头像，一行模块功能。
                if (index == 0 && index < rowFlexArray.length) {
                    $(childEle).css({height: stuHeight * rowFlexArray[index]});
                }
                if (index == 1) {
                    $(childEle).css({height: stuHeight * rowFlexArray[index]});
                }
            });
        }
    }
}]);

