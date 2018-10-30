/**
 * Created by Administrator on 2017/5/3.
 */
import 'ngDecorator/decoratorModule'; //装饰器

import './pages/index';
import './services/index';
import './directives/index';
import "./constants/index";
import './../game_map_music/level_bg_music.mp3';
import gameMapReducers from './redux/index';

let gameMapModule = angular.module('gameMap', [
    'ngDecModule',
    'gameMap.controllers',
    'gameMap.services',
    'gameMap.directives',
    'gameMap.constants'
]);
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
gameMapModule.run(['$state','$rootScope','$window','$timeout',($state,$rootScope,$window,$timeout)=>{
    $rootScope.gameBgMusic = document.getElementById('level_bg_music');

    $rootScope.loadGameMapImg = (imgUrl)=>{
        return require('../game_map_images/' + imgUrl);
    };
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

export {gameMapModule,gameMapReducers}

