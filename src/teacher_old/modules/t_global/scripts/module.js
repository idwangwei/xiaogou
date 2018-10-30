/**
 * Created by ZL on 2018/1/16.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
let t_global = angular.module('t_global', ['t_global.directives','t_global.services','t_global.animation']);
registerModule(t_global);
t_global.run(['$rootScope', '$compile', '$ngRedux','commonService', ($rootScope,$compile,$ngRedux,commonService) => {
    $rootScope.loadCreditsStoreImg = (imgUrl)=> {
        return require('../../t_credits_store/images/' + imgUrl);
    };
    $rootScope.loadPersonalQBImg = (imgUrl)=> {
        return require('../../t_personal_qb/images/' + imgUrl);
    };
    $rootScope.loadHomeTeachingWorkImg = (imgUrl)=> {
        return require('../../t_home_teaching_work/images/' + imgUrl);
    };
    if(commonService.isPC()){
        $('body').append($compile($('<scale-btn></scale-btn>'))($rootScope));
        $rootScope.$on('$stateChangeSuccess', function (ev, toState, toStateParams) {
            let scaleBtn = $('body > .scale-btn-default');
            if(toState.name == "system_login"){
                scaleBtn.hide();
            }else {
                scaleBtn.show();
            }
        });
    }
}]);
export {t_global};
export * from 'ngDecoratorForStudent/ng-decorator';