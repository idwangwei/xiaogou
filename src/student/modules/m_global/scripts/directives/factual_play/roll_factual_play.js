/**
 * Created by ZL on 2016/12/9.
 * 已弃用
 */
import './roll_factual_play.less';

import templ from '../../partials/directive/factual_play/roll_factual_play.html';

define(['../index'], function (directives) {
    directives.directive('rollFactualPlay', ['commonService', '$timeout', '$ngRedux', function (commonService, $timeout, $ngRedux) {
        return {
            restrict: 'E',
            scope: true,
            template: templ,
            controller: ['$scope', 'factualPlayService', function ($scope, factualPlayService) {
                $scope.isIos = factualPlayService.judgeIsIos();

                $scope.isAndroid = factualPlayService.judgeIsAndroid();

                $scope.reslutList = [];

                $scope.classId = factualPlayService.getSelectId();

                $scope.promptStr = "数据加载中";

                $scope.analysisStar = function (star) {
                    if (Math.floor(star) == star) {
                        return "" + star + "颗星";
                    } else {
                        return "" + Math.floor(star) + "星半";
                    }
                };

                this.getResults = function (activeele, classId) {
                    $scope.promptStr = "数据加载中";
                    factualPlayService.getResultList(classId, activeele).then((data) => {
                        if (data && data.code == 200) {
                            $scope.reslutList.length = 0;
                            if (activeele == "trophy_rank") {
                                angular.forEach(data.list, (item)=> {
                                    $scope.reslutList.push(item);
                                });
                            } else {
                                angular.forEach(data.result, (item)=> {
                                    if (item.time) {
                                        let tempDate = new Date(Date.parse(item.time.replace(/-/g, "/")));
                                        let time = "";
                                        let mins = tempDate.getMinutes();
                                        mins = Number(mins) < 10 ? "0" + mins : mins;
                                        time += (tempDate.getMonth() + 1) + "月";
                                        time += tempDate.getDate() + "日 ";
                                        time += tempDate.getHours() + ":";
                                        time += mins;
                                        item.time = time;
                                    } else {
                                        item.time = "";
                                    }


                                    $scope.reslutList.push(item);
                                });
                            }
                            if ($scope.reslutList.length == 0) {
                                $scope.promptStr = "暂时没有数据";
                            }

                        }
                    });
                };
            }],
            link: function ($scope, element, attrs, ctrl) {
                $scope.activeType = attrs.activeele;
                $scope.$watch('ctrl.$ngRedux.getState().trophy_selected_clazz.id', function (newVal) {
                    if (newVal) {
                        ctrl.getResults(attrs.activeele, newVal);
                    }
                })

            }
        }
    }]).service("factualPlayService", ['$q', 'commonService', 'serverInterface', '$ngRedux', function ($q, commonService, serverInterface, $ngRedux) {
        this.reslutList = [];

        this.judgeIsIos = function () {
            return commonService.judgeSYS() == 2;
            // return true;
        };

        this.judgeIsAndroid = function () {
            return commonService.judgeSYS() == 1;
            // return true;
        };

        this.getSelectId = function () {
            return $ngRedux.getState().trophy_selected_clazz.id;
        };

        this.getResultList = function (classId, activeEle) {
            var defer = $q.defer();
            var workClassId = classId;// $ngRedux.getState().trophy_selected_clazz.id;
            var param = {
                classId: workClassId,
                limit: 30,
                minScore: 0
            };
            var serverInF;

            if (activeEle == 'star_rank') {
                serverInF = serverInterface.GET_GAME_REAL_TIME_CAST
            } else if (activeEle == 'fighter_rank') {
                serverInF = serverInterface.GET_SUSUAN_REAL_TIME_CAST;
            } else {
                serverInF = serverInterface.GET_WORK_REAL_TIME_CAST
            }

            commonService.commonPost(serverInF, param).then((data) => {
                debugger
                defer.resolve(data);

            }, function () {
                defer.resolve(false);
            });
            return defer.promise;
        }
    }])

});
