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
            petType:'@',
            petPhase:'@',
            petGrowthValue:'@'
        },
        controller: ['commonService', '$scope', '$state','$rootScope',(commonService, $scope, $state,$rootScope)=> {}],
        link: function ($scope, element, attrs, ctrl) {
            let $ele = $(element);
            let $petImg = $ele.find('.pet-img');
            //添加对应宠物对应阶段的显示图片pet-0-0
            $petImg.addClass(`pet-${$scope.petType}-${$scope.petPhase}`);

            let removeEatAnimation = ()=>{
                $petImg.removeClass(`eat-pet-${$scope.petType}-${$scope.petPhase}`);
                $petImg.off('animationend',removeEatAnimation);
                $petImg.off('webkitAnimationEnd',removeEatAnimation);
            };
            let removeUpdateAnimation = ()=>{
                $petImg.removeClass('pet-phase-update');
                $petImg.off('animationend',removeUpdateAnimation);
                $petImg.off('webkitAnimationEnd',removeUpdateAnimation);
            };

            //监听pet成长值的变化,
            $scope.$watch('petGrowthValue',(newV,preV)=>{
                if(newV!==undefined && newV !== preV){
                    //eat-pet-0-1添加对应宠物对应阶段的吃东西的动画
                    $petImg.addClass(`eat-pet-${$scope.petType}-${$scope.petPhase}`);

                    $petImg.on('animationend',removeEatAnimation);
                    $petImg.on('webkitAnimationEnd',removeEatAnimation);
                }
            });

            //监听pet成长阶段的变化,
            $scope.$watch('petPhase',(newV,preV)=>{
                if(newV && preV && newV !== preV){
                    //播放进化的动画
                    $petImg.removeClass(`pet-${$scope.petType}-${preV}`);
                    $petImg.addClass(`pet-${$scope.petType}-${newV}`);

                    $petImg.removeClass(`pet-phase-update`);
                    $petImg.addClass(`pet-phase-update`);

                    $petImg.on('animationend',removeUpdateAnimation);
                    $petImg.on('webkitAnimationEnd',removeUpdateAnimation);
                }
            });

            $scope.$on('$destroy', ()=> {
                element.off();
            });
        }
    }
}
