/**
 * Created by ww 2017/8/9.
 */

import temp from './index.html';
import './index.less';

export default ()=> {
    return {
        restrict: 'E',
        template: temp,
        scope:{
            foodType:'=',
            showFood:'=',
        },
        controller: ['commonService', '$scope', '$state','$rootScope',(commonService, $scope, $state,$rootScope)=> {
            $scope.hide =()=>{
                $scope.showFood = false;
            }
        }],
        link: function ($scope, element, attrs, ctrl) {
            $scope.foodName = '成长道具+1';
            $scope.foodType = $scope.foodType || 'all';
            $scope.$watch('foodType',(newV,preV)=>{
                switch (newV){
                    case '1':
                        $scope.foodName = '可口饼干+1';
                        break;
                    case '2':
                        $scope.foodName = '美味汉堡+1';
                        break;
                    case '3':
                        $scope.foodName = '星星魔杖+1';
                        break;
                    case 'all':
                    default:
                        $scope.foodName = '成长道具+3';
                }
            });
        }
    }
}
