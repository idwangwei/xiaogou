/**
 * Created by ww on 2017/12/19.
 */
import './style.less';

export default function () {
    return {
        restrict: 'AE',
        scope: {
            optionArr:'=',
            confirmCallback:'&'
        },
        template: require('./page.html'),
        controller: ['$scope','olympicMathMicrolectureFinalData', ($scope,olympicMathMicrolectureFinalData) => {
            $scope.btnClick = ($e,index)=>{
                $e.stopPropagation();
                $e.preventDefault();
                $scope.confirmCallback({
                    answer: {
                        type: olympicMathMicrolectureFinalData.ML_TYPE.SELECT,
                        value: index
                    }
                })
            };
            $scope.clickOptionPage= ($event)=>{
                $event.stopPropagation();
                $event.preventDefault();
            }
        }],
        link: function ($scope, $elem, $attrs) {

        }
    };
}