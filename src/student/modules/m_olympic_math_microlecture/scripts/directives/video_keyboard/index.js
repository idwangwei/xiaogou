/**
 * Created by WL on 2017/9/15.
 */
import './style.less';
const DEL_BTN = 'del';
const SURE_BTN = 'sure';
export default function () {
    return {
        restrict: 'AE',
        scope: {
            showKeyboard: '=',
            confirmCallback:'&'
        },
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$timeout','olympicMathMicrolectureFinalData', ($scope, $rootScope, $timeout, olympicMathMicrolectureFinalData) => {
            $scope.inputStr = '';
            $scope.clickKeyboard = ($e) => {
                $e.stopPropagation();
                // $timeout(()=>{
                //     $scope.showKeyboard = false;
                // },100);
            };
            $scope.btnClick = ($e,value)=>{
                $e.stopPropagation();
                if(value == DEL_BTN){
                    $scope.inputStr = $scope.inputStr.slice(0,-1);
                    return
                }
                if(value == SURE_BTN){
                    $timeout(()=>{
                        $scope.showKeyboard = false;
                        $scope.confirmCallback({
                            answer:{
                                type:olympicMathMicrolectureFinalData.ML_TYPE.FILLBLANK,
                                value:$scope.inputStr
                            }
                        });
                        $scope.inputStr = '';
                    },100);
                    return
                }
                $scope.inputStr += value;
            }
        }],
        link: function ($scope, $elem, $attrs) {
        }

    };
}