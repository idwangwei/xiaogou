/**
 * Created by ww 2017/8/9.
 */

import temp from './index.html';
import './index.less';

export default ()=> {
    return {
        restrict: 'E',
        template: temp,
        controller: ['$state', '$scope', '$rootScope','increaseScoreService','$ionicTabsDelegate', ($state, $scope, $rootScope,increaseScoreService,$ionicTabsDelegate)=> {
            $scope.gotoPetPage = ()=>{
                $state.go('pet_page',{urlFrom:$state.current.name});
                $rootScope.$injector.get('$ionicViewSwitcher').nextDirection('forward');

                increaseScoreService.changeFirstPetGuideFlag();
                $rootScope.showPetEnterGuide = false;
            }
            $rootScope.$watch("showPetEnterGuide", () => {
                if ($ionicTabsDelegate._instances.length)
                    $ionicTabsDelegate._instances[0].showBar(!$rootScope.showPetEnterGuide);
            });
        }],
        link: function ($scope, element, attrs, ctrl) {
        }
    }
}
