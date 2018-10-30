/**
 * Created by ZL on 2018/1/31.
 */
import './style.less';
import $ from 'jquery';
export default function () {
    return {
        restrict: 'E',
        scope: {
            showAllCourseFlag: '=',
            changeClazz: '&',
            selectItemObj: '='
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', 'commonService', '$ngRedux',
            function ($scope, $rootScope, $state, commonService, $ngRedux) {
                let courseListObj = $ngRedux.getState().winter_camp_all_courses || {};
                $scope.courseList = courseListObj.courseList || [];
                $scope.courseLists = [];
                /**
                 * 解析数据
                 */
                $scope.analysisCourseListData = ()=> {
                    // this.classCount = _.findLastIndex(this.allCourses, {id: this.selectCourse.id});
                    let unitIndex = 0;
                    let indexObjArr = [];
                    angular.forEach($scope.courseList, (v, k)=> {
                        if ($scope.courseList[k].unitIndex != unitIndex) {
                            unitIndex = $scope.courseList[k].unitIndex;
                            $scope.courseLists.push({unitIndex: unitIndex,unitName: $scope.courseList[k].unitName, list: []});
                        }
                        $scope.courseLists[$scope.courseLists.length - 1].list.push($scope.courseList[k]);
                    });
                };
                $scope.analysisCourseListData();

                $scope.hideAllCourseDiagnose = ($event)=> {
                    if (typeof $event === 'object' && $event.stopPropagation) {
                        $event.stopPropagation();
                    } else if (event && event.stopPropagation) {
                        event.stopPropagation();
                    }
                    $scope.showAllCourseFlag = false;
                };
                $scope.stopEvent = function ($event) {
                    if (typeof $event === 'object' && $event.stopPropagation) {
                        $event.stopPropagation();
                    } else if (event && event.stopPropagation) {
                        event.stopPropagation();
                    }
                }
                $scope.selectClazz = (item)=> {
                    $scope.selectItemObj.clazz = item;
                    if ($scope.changeClazz && typeof $scope.changeClazz === 'function') {
                        $scope.changeClazz(item);
                    }
                    $scope.hideAllCourseDiagnose();
                }
            }],
        link: function ($scope, $element, $attr, ctrl) {
        }
    };
}