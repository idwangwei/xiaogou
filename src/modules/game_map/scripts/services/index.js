/**
 * Created by Administrator on 2017/5/2.
 */


import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import * as GAME_MAP from './../redux/action_types';
import _find from 'lodash.find';

@Inject('$q','$ngRedux', 'commonService', 'serverInterface', 'gameMapInterface','finalData')
class GameLevelService {
    $q;
    commonService;
    serverInterface;
    gameMapInterface;
    finalData;
    cancelRequestList = [];

    getGameNum(gameGuid){
        if(gameGuid=="aa1" ||gameGuid=="aa2" ||gameGuid=="aa3" ||gameGuid=="aa4"){
            return 11;
        }

        var reg=new RegExp(gameGuid+"([^\\d]|$)");
        for(var key in this.finalData.GAME_NUM){
            for(var i=0;i<this.finalData.GAME_NUM[key].length;i++){
                if(this.finalData.GAME_NUM[key][i].match(reg)){
                    return +key;
                }
            }
        }
        console.log("没有找到"+gameGuid);
    }


    /**
     * 获取指定游戏包的关卡详情
     * @param param
     * @returns {function(*, *)}
     */
    @actionCreator
    getLevelInfo(param) {
        param = param || {};

        return (dispatch, getState)=> {
            let defer = this.$q.defer();

            dispatch({type: GAME_MAP.FETCH_LEVEL_INFO_START});
            this.commonService.commonPost(this.gameMapInterface.GET_GAME_MAP_LEVEL_INFO, param).then((data)=> {
                if (data.code === 200) {
                    let levelsWithoutFirst = [], //除去第一关的关卡信息
                        firstLevel = {}, //第一关的关卡信息
                        passBox = {}, //通过宝箱信息
                        currentStuLevel = 1; //玩家当前所在关卡

                    if(data.levelScence){
                        let boxes = data.levelScence.boxes,
                            levels = data.levelScence.levels,
                            positionGuid = data.levelScence.avatorPosition;

                        if(levels[0]){
                            firstLevel = {
                                id: levels[0].guid,
                                star: levels[0].star,
                                desc: levels[0].knowledgePoint,
                                levelNum: levels[0].seq,
                                canPlay: levels[0].canPlay,
                                bgImgIndex: undefined,
                            };
                        }

                        //关卡从高到低排序
                        for (let i = levels.length-1; i >= 0; i--) {
                            if(positionGuid == levels[i].guid){
                                currentStuLevel = levels[i].seq;
                            }

                            //宝箱放在对应的关卡之后
                            let levelBox = _find(boxes,{position:levels[i].guid});
                            if(levelBox){
                                if(levelsWithoutFirst.length == 0){
                                    passBox.hasInsertBox =  true;
                                    passBox.boxCanOpen =  levelBox.canOpen;
                                    passBox.boxCard =  levelBox.card;
                                    passBox.boxCredits =  levelBox.credits;
                                    passBox.boxId =  levelBox.id;
                                    passBox.boxOpen =  levelBox.opened;
                                }else {
                                    levelsWithoutFirst[levelsWithoutFirst.length-1].hasInsertBox =  true;
                                    levelsWithoutFirst[levelsWithoutFirst.length-1].boxCanOpen =  levelBox.canOpen;
                                    levelsWithoutFirst[levelsWithoutFirst.length-1].boxCard =  levelBox.card;
                                    levelsWithoutFirst[levelsWithoutFirst.length-1].boxCredits =  levelBox.credits;
                                    levelsWithoutFirst[levelsWithoutFirst.length-1].boxId =  levelBox.id;
                                    levelsWithoutFirst[levelsWithoutFirst.length-1].boxOpen =  levelBox.opened;
                                }
                            }


                            if(i != 0){
                                levelsWithoutFirst.push({
                                    id: levels[i].guid, //关卡Id
                                    star: levels[i].star, //关卡星星
                                    desc: levels[i].knowledgePoint, //关卡描述
                                    levelNum: levels[i].seq, //该关卡为第几关
                                    canPlay: levels[i].canPlay, //关卡是否可以玩
                                    bgImgIndex: i % 3 === 2 ? Math.floor(i/3) % 6 : undefined, //关卡背景图下标
                                });
                            }
                        }
                    }

                    dispatch({
                        type: GAME_MAP.FETCH_LEVEL_INFO_SUCCESS,
                        payload: {
                            levelsWithoutFirst:levelsWithoutFirst,
                            firstLevel:firstLevel,
                            currentStuLevel:currentStuLevel||levelsWithoutFirst[0].seq,
                            passBox:passBox,
                            mapId:param.mainScenceId
                        }
                    });
                    if(data.mlcg)dispatch({type:GAME_MAP.GAME_GOODS_PAY.UPDATE_GAME_VIP, data:data.mlcg})

                } else {
                    dispatch({type: GAME_MAP.FETCH_LEVEL_INFO_FAIL});
                }
                defer.resolve();
            }, ()=> {
                dispatch({type: GAME_MAP.FETCH_LEVEL_INFO_FAIL});
                defer.reject();
            });
            return defer.promise;
        }
    }

    @actionCreator
    openBox(param,isPassBox,mapId){
        param = param || {};

        return (dispatch, getState)=> {
            let defer = this.$q.defer();

            dispatch({type: GAME_MAP.OPEN_GAME_LEVEL_BOX_START});
            this.commonService.commonPost(this.gameMapInterface.OPEN_GAME_BOX, param).then((data)=> {
                if (data.code === 200) {

                    dispatch({
                        type: GAME_MAP.OPEN_GAME_LEVEL_BOX_SUCCESS,
                        payload:{
                            boxId:param.boxId,
                            isPassBox:isPassBox,
                            mapId:mapId
                        }
                    });

                    if(data.opened){
                        dispatch({
                            type: GAME_MAP.CHANGE_GAME_LEVEL_BOX_STATUS,
                        });
                    }
                    defer.resolve(true);
                } else {
                    dispatch({type: GAME_MAP.OPEN_GAME_LEVEL_BOX_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: GAME_MAP.OPEN_GAME_LEVEL_BOX_FAIL});
                defer.reject();
            });
            return defer.promise;
        }
    }
}

import gameGoodsPayServer from './gameGoodsPayServer';
import gameMapInfoServer from './gameMapInfoServer';
angular.module('gameMap.services', [])
    .service('gameLevelService', GameLevelService)
    .service('gameGoodsPayServer', gameGoodsPayServer)
    .service('gameMapInfoServer', gameMapInfoServer);

