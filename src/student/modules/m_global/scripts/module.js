/**
 * Created by ZL on 2018/1/5.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import globalReducers from './redux/index';
import * as defaultStates from "./redux/default_states/default_states"
let m_global = angular.module('m_global', [
    // 'm_global.services',
]);
registerModule(m_global,globalReducers, defaultStates);
m_global.run(['$rootScope', '$ngRedux', ($rootScope) => {
    $rootScope.loadImg = function (imgUrl) {
        return require('../sImages/' + imgUrl);
    };
    $rootScope.loadComputeImg = (imgUrl) => {
        return require('../../m_compute/images/' + imgUrl);
    };
    /*$rootScope.loadDiagnoseImg = (imgUrl) => {
        return require('../../m_diagnose/images/' + imgUrl);
    };*/
    $rootScope.loadFinalSprintImg = (imgUrl) => {
        return require('../../m_final_sprint/images/' + imgUrl);
    };
    $rootScope.loadFinalSprintPaymentImg = (imgUrl) => {
        return require('../../m_final_sprint_payment/images/' + imgUrl);
    };
    $rootScope.loadGameMapImg = (imgUrl)=> {
        return require('../../m_game_map/game_map_images/' + imgUrl);
    };
    /*$rootScope.loadHolidayWorkImg = (imgUrl)=> {
        return require('../../m_holiday_work/images/' + imgUrl);
    };*/
    $rootScope.loadMathGameImg = (imgUrl) => {
        return require('../../m_math_game/images/' + imgUrl);
    };
    $rootScope.loadRewardImg = (imgUrl)=> {
        return require('../../m_reward/reward_images/' + imgUrl);
    };
    $rootScope.loadMicrolectureImg = (imgUrl)=> {
        return require('../../m_olympic_math_microlecture/images/' + imgUrl);
    };
    $rootScope.loadOlympicMathImg = (imgUrl)=> {
        return require('../../m_olympic_math_home/images/' + imgUrl);
    };
    $rootScope.loadWinterCampImg = (imgUrl)=> {
        return require('../../m_winter_camp/images/' + imgUrl);
    };
    $rootScope.loadLiveImg = (imgUrl)=> {
        return require('../../m_live/images/' + imgUrl);
    };
    $rootScope.loadQEDImg = (imgUrl)=> {
        return require('../../m_question_every_day/images/' + imgUrl);
    };
}]);
export {m_global};

export * from 'ngDecoratorForStudent/ng-decorator';