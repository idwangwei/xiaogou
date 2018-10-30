/**
 * Created by ZL on 2017/10/30.
 */
import templ from './page.html';
import _ from 'underscore'
import './style.less'
angular.module("alrSelectDateTime", [])
    .directive('alrSelectDateTime', ['$interval', '$rootScope', function ($interval, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                dateTime: '=',    //秒数
                selectDone:"&"
            },
            template: templ,
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                /*    $scope.showMouthSelect = ()=> {
                 $scope.stopEvent();
                 $scope.hideSelectOptions();
                 $scope.showMouthFlag = true;
                 };
                 $scope.showDateSelect = ()=> {
                 $scope.stopEvent();
                 $scope.hideSelectOptions();
                 $scope.showDateFlag = true;
                 if ($scope.dateTime.mouth == 2) {
                 if ($scope.dateTime.year % 4 == 0 && $scope.dateTime.year % 100 != 0
                 || $scope.dateTime.year % 4 == 0 && $scope.dateTime.year % 100 == 0 && $scope.dateTime.year % 400 == 0) {
                 $scope.dateArr = $scope.dateArrs.slice(0, 29)
                 } else {
                 $scope.dateArr = $scope.dateArrs.slice(0, 28)
                 }
                 } else if ($scope.dateTime.mouth == 4 || $scope.dateTime.mouth == 6 || $scope.dateTime.mouth == 9 || $scope.dateTime.mouth == 11) {
                 $scope.dateArr = $scope.dateArrs.slice(0, 30);
                 } else {
                 $scope.dateArr = $scope.dateArr.slice(0);
                 }

                 };

                 $scope.showHourSelect = ()=> {
                 $scope.stopEvent();
                 $scope.hideSelectOptions();
                 $scope.showHourFlag = true;
                 };

                 $scope.showMinutesSelect = ()=> {
                 $scope.stopEvent();
                 $scope.hideSelectOptions();
                 $scope.showMinutesFlag = true;
                 };*/

                $scope.selectDateTimeBack = ()=> {
                    // $scope.hideSelectOptions();
                    $rootScope.selectDateTimeFlag = false;
                    $scope.dateTime.year = $scope.tempTime.year;
                    $scope.dateTime.mouth = $scope.tempTime.mouth;
                    $scope.dateTime.date = $scope.tempTime.date;
                    $scope.dateTime.hour = $scope.tempTime.hour;
                    $scope.dateTime.minutes = $scope.tempTime.minutes;
                    $scope.selectDone();
                };

                $scope.selectDateTimeDone = ()=> {
                    // $scope.hideSelectOptions();
                    $scope.selectDone();
                    $rootScope.selectDateTimeFlag = false;
                };

                /*$scope.selectDateTimeValue = (type, val)=> {
                 // $scope.stopEvent();
                 $scope.hideSelectOptions();
                 if (type == 'mouth') {
                 $scope.dateTime.mouth = val;
                 } else if (type == 'date') {
                 $scope.dateTime.date = val;
                 } else if (type == 'hour') {
                 $scope.dateTime.hour = val;
                 } else {
                 $scope.dateTime.minutes = val;
                 }
                 };*/

                $scope.selectDateTimeValue = (type, option)=> {
                    if (type == 'mouth') {
                        $scope.changeMouth(option);
                    } else if (type == 'date') {
                        $scope.changeDate(option);
                    } else if (type == 'hour') {
                        $scope.changeHour(option);
                    } else {
                        $scope.changeMinutes(option);
                    }
                };
                $scope.changeYear = (type)=> {
                    if (type == 'next') {
                        $scope.dateTime.year += 1;
                    } else {
                        if (Number($scope.dateTime.year) <= Number($scope.currentD.getFullYear())) return;
                        $scope.dateTime.year -= 1
                    }
                };

                $scope.changeMouth = (type)=> {
                    if (type == 'up') {
                        if ($scope.dateTime.mouth == 12) return;
                        $scope.dateTime.mouth += 1;
                    } else {
                        if (Number($scope.dateTime.year) <= Number($scope.currentD.getFullYear())
                            && Number($scope.dateTime.mouth) <= Number($scope.currentD.getMonth()) + 1)
                            return;
                        if (Number($scope.dateTime.mouth) == 1) return;
                        $scope.dateTime.mouth -= 1
                    }
                };
                $scope.changeDate = (type)=> {
                    if (type == 'up') {
                        if ($scope.dateTime.mouth == 2 && $scope.dateTime.date == 29 && $scope.dateTime.year % 4 == 0 && $scope.dateTime.year % 100 != 0
                            || $scope.dateTime.mouth == 2 && $scope.dateTime.date == 29 && $scope.dateTime.year % 4 == 0 && $scope.dateTime.year % 100 == 0 && $scope.dateTime.year % 400 == 0) {
                            return;
                        } else if ($scope.dateTime.mouth == 2 && $scope.dateTime.date == 28) {
                            return;
                        } else if ($scope.dateTime.mouth == 4 || $scope.dateTime.mouth == 6 || $scope.dateTime.mouth == 9 || $scope.dateTime.mouth == 11) {
                            if ($scope.dateTime.date == 30) return;
                        } else {
                            if ($scope.dateTime.date == 31) return;
                        }
                        $scope.dateTime.date += 1;
                    } else {
                        if (Number($scope.dateTime.date) == 1) return;
                        if (Number($scope.dateTime.year) <= Number($scope.currentD.getFullYear())
                            && Number($scope.dateTime.mouth) <= Number($scope.currentD.getMonth()) + 1
                            && Number($scope.dateTime.date) <= Number($scope.currentD.getDate()))
                            return;
                        $scope.dateTime.date -= 1
                    }
                };
                $scope.changeHour = (type)=> {
                    if (type == 'up') {
                        if (Number($scope.dateTime.hour) == 23) return;
                        $scope.dateTime.hour += 1;
                    } else {
                        if (Number($scope.dateTime.hour) == 0) return;
                        if (Number($scope.dateTime.year) <= Number($scope.currentD.getFullYear())
                            && Number($scope.dateTime.mouth) <= Number($scope.currentD.getMonth()) + 1
                            && Number($scope.dateTime.date) <= Number($scope.currentD.getDate())
                            && Number($scope.dateTime.hour) <= Number($scope.currentD.getHours()))
                            return;
                        $scope.dateTime.hour -= 1
                    }
                };
                $scope.changeMinutes = (type)=> {
                    if (type == 'up') {
                        if (Number($scope.dateTime.minutes) == 59) return;
                        $scope.dateTime.minutes += 1;
                    } else {
                        if (Number($scope.dateTime.minutes) == 0) return;
                        if (Number($scope.dateTime.year) <= Number($scope.currentD.getFullYear())
                            && Number($scope.dateTime.mouth) <= Number($scope.currentD.getMonth()) + 1
                            && Number($scope.dateTime.date) <= Number($scope.currentD.getDate())
                            && Number($scope.dateTime.hour) <= Number($scope.currentD.getHours())
                            && Number($scope.dateTime.minutes) <= Number($scope.currentD.getMinutes()))
                            return;
                        $scope.dateTime.minutes -= 1
                    }
                };


                $scope.hideDiagnose = ()=> {
                    // $scope.hideSelectOptions();
                    $rootScope.selectDateTimeFlag = false;
                };

                /*   $scope.hideSelectOptions = ()=> {
                 $scope.showMouthFlag = false;
                 $scope.showDateFlag = false;
                 $scope.showHourFlag = false;
                 $scope.showMinutesFlag = false;
                 };
                 */
                $scope.stopEvent = ($event)=> {
                    if (typeof $event === 'object' && $event.stopPropagation) {
                        $event.stopPropagation();
                    } else if (event && event.stopPropagation) {
                        event.stopPropagation();
                    }
                };

            }],
            link: function ($scope, element, $attr, ctrl) {
                debugger
                $scope.currentD = new Date();
                $scope.dateTime = $scope.dateTime || {};
                $scope.dateTime.year = $scope.dateTime.year || $scope.currentD.getFullYear();
                $scope.dateTime.mouth = $scope.dateTime.mouth || $scope.currentD.getMonth() + 1;
                $scope.dateTime.date = $scope.dateTime.date || $scope.currentD.getDate();
                $scope.dateTime.hour = $scope.dateTime.hour || $scope.currentD.getHours();
                $scope.dateTime.minutes = $scope.dateTime.minutes || $scope.currentD.getMinutes();
                $scope.tempTime = angular.copy($scope.dateTime);
                /* $scope.mouthArr = _.range(13).slice(1);
                 $scope.dateArrs = _.range(32).slice(1);
                 $scope.dateArr = _.range(32).slice(1);
                 $scope.hourArr = _.range(24);
                 $scope.minutesArr = _.range(60);*/

            }
        };
    }]);
