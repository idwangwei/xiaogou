/**
 * Created by qiyuexi on 2018/1/3.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';

import gameMapReducers from './redux/index';
import * as defaultStates from "./redux/default_states/index"

let gameMapModule = angular.module('m_game_map', [
    'm_game_map.directives',
]);
registerModule(gameMapModule,gameMapReducers,defaultStates);
const hasMusicRoutes = [
    'game_map_scene'
    ,'game_map_level'
    ,'game_map_atlas1'
    ,'game_map_atlas2'
    ,'game_map_atlas3'
    ,'game_map_atlas4'
    ,'game_map_atlas5'
    ,'game_map_atlas6'
];
gameMapModule.run(['$state','$rootScope','$window','$timeout','$ngRedux',($state,$rootScope,$window,$timeout,$ngRedux)=>{
    $rootScope.gameBgMusic = document.getElementById('level_bg_music');

    /*$rootScope.loadGameMapImg = (imgUrl)=>{
        return require('../game_map_images/' + imgUrl);
    };*/
    // $ngRedux.mergeReducer(gameMapReducers,defaultStates,$rootScope.loginName);
    $rootScope.$on('$stateChangeSuccess', function (ev, toState, toStateParams) {
        if(hasMusicRoutes.indexOf(toState.name) > -1){
            $timeout(()=>{
                $rootScope.gameBgMusic.play();
            },10)
        }else {
            $timeout(()=>{
                $rootScope.gameBgMusic.pause();
            },10)
        }
    });

    $window.document.addEventListener("resume", ()=> {
        if (hasMusicRoutes.indexOf($state.current.name) > -1) {
            $timeout(()=>{
                $rootScope.gameBgMusic.play();
            },10)
        }
    });

    $window.document.addEventListener("pause", ()=> {
        if (hasMusicRoutes.indexOf($state.current.name) > -1) {
            $timeout(()=>{
                $rootScope.gameBgMusic.pause();
            },10)
        }
    });

}]);
export {
    gameMapModule
}
export * from 'ngDecoratorForStudent/ng-decorator';