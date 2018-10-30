/**
 * Created by ZL on 2018/1/15.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import rewardReducers from './redux/index';
import * as defaultStates from './redux/default_states/index';

let m_olympic_math_home = angular.module('m_olympic_math_home', [
    "m_olympic_math_home.directives"
]);
m_olympic_math_home.run(['$rootScope','$compile',($rootScope,$compile)=>{

    //显示奥数升级广告
    if($rootScope.compileOlympicChangeAdToHomePage === undefined){
        let ad = $('<olympic-change-ad></olympic-change-ad>');
        $('body ion-nav-view .home').append(ad);
        $compile(ad)($rootScope);
        $rootScope.compileOlympicChangeAdToHomePage = true;
    }
}]);


registerModule(m_olympic_math_home,rewardReducers,defaultStates);
export {m_olympic_math_home};
export * from 'ngDecoratorForStudent/ng-decorator';