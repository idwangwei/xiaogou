/**
 * Created by 华海川on 2015/9/7.
 * 游戏管理
 */
import services from './index';
import {
    GAMES_LIST_REQUEST, GAMES_LIST_SUCCESS, GAMES_LIST_FAILURE,
    DEL_GAME_REQUEST, DEL_GAME_SUCCESS, DEL_GAME_FAILURE,
    MOVE_GAME_START, MOVE_GAME_SUCCESS, MOVE_GAME_FAILURE, GAME_STAR_RANK, FORCE_GL_UPDATE, CHANGE_CLAZZ
} from '../redux/action_typs';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';

@Inject('$q', '$http', '$log', '$rootScope', 'serverInterface', 'commonService', '$ngRedux')
class GameManageService {
    gradeList = [];//教师年级列表
    gameList = []; //游戏列表
    clazzArray = [];//班级数组
    /* game = {
     clzOrHome: $rootScope.homeOrClazz.type,
     gameGuid: '',
     gameName: '',
     gameDesc: '',
     isClicked: '',
     gameMode: ''
     }; //一个游戏基本信息*/
    gameInfo = {}; //一个游戏详情
    levelArray = [];   //存关卡数组
    configs = {games: []};//要发布的游戏数据
    getPubGamesParam = {subject: 1, category: this.getRootScope().homeOrClazz.type, clzId: null}; //获取已发布的游戏需要的参数 category:2
    constructor() {
        this.game = {
            clzOrHome: this.getRootScope().homeOrClazz.type,
            gameGuid: '',
            gameName: '',
            gameDesc: '',
            isClicked: '',
            gameMode: ''
        }; //一个游戏基本信息
        //this.getPubGamesParam = {subject: 1, category: this.getRootScope().homeOrClazz.type, clzId: null}; //获取已发布的游戏需要的参数 category:2t
    }

    /**
     * 获取教师所教班级和默认游戏列表
     * @returns {promise}
     */
    getGameInit() {
        var me = this;
        me.gameList.length = 0;
        var defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.GET_GAME_INIT).then((data) => {
            me.gradeList.length = 0;
            if (data.code != 200) {
                defer.resolve(data);
                return;
            }
            if (data.tbs && data.tbs.length) {
                data.tbs.forEach(function (item) {
                    me.gradeList.push(item);
                });
            }
            defer.resolve(data);
        });
        return defer.promise;
    }

    /**
     * 根据年级获取游戏
     * @param num 年级号
     * @returns {*}
     */
    gameByGrade(id) {
        var me = this;
        var defer = this.$q.defer();
        var param = {tbId: id};
        this.commonService.commonPost(this.serverInterface.GET_GAME_BY_GRADE, param).then((data) => {
            if (data.code != 200) {
                defer.resolve(false);
                return;
            }
            me.gameList.length = 0;
            if (data.games && data.games.length) {
                data.games.forEach(function (item) {
                    me.gameList.push(item);
                });
            }
            defer.resolve(true);
        });
        return defer.promise;
    };


    /**
     * 获取关卡
     * @param gameGuid 游戏id
     */
    getLevels() {
        var defer = this.$q.defer();
        var me = this;
        var param = {gameGuid: me.game.gameGuid};
        this.commonService.commonPost(this.serverInterface.GET_LEVELS, param).then((data) => {
            if (!data) {
                defer.resolve(false);
                return;
            }
            me.levelArray.length = 0;
            if (data.levels && data.levels.length) {
                if (me.game.gameMode == 150) {
                    data.levels.splice(0, 1)
                }
                ; //处理特殊游戏，只能选择一关
                data.levels.forEach(function (level) {
                    level.isClicked = false;
                });
                var array = commonService.setLevel(data.levels);
                array.forEach(function (level) {
                    me.levelArray.push(level);
                });
            }
            defer.resolve(true);
        });
        return defer.promise;
    };

    /**
     * 获取班级列表
     * @returns {promise}
     */


    /**
     * 判断该班级能不能发布
     * @param clazzId 班级id | clzOrHome 课堂还是家庭
     * @returns {promise}
     */
    isPub(clazzId) {
        var param = {clzIds: clazzId, category: this.game.clzOrHome, subject: 1};
        return this.commonService.commonPost(this.serverInterface.ISPUB_GAME, param);
    }

    /**
     * 发布游戏
     * @param param
     */
    pubGame(param) {
        //param.configs=JSON.stringify(this.configs);
        param.category = this.game.clzOrHome;
        return this.commonService.commonPost(this.serverInterface.PUB_GAME, param);
    };

    /**
     * 通过班级id获取改班级已发布游戏
     * @returns {*}
     */
    @actionCreator
    getPubGames(page, refreshFlag) {
        return (dispatch, getState) => {
            this.getPubGamesParam.page = JSON.stringify(page);
            this.getPubGamesParam.clzId = getState().gl_selected_clazz.id;
            dispatch({type: GAMES_LIST_REQUEST})
            return this.commonService.commonPost(this.serverInterface.GET_PUB_GAMES, this.getPubGamesParam).then(
                (data) => {
                    var pubGames = [];
                    if (data.code == 200 && data.cgces) {
                        data.cgces.forEach(function (item) {
                            var levelNums = item.games[0].levelNums;
                            if (levelNums) {
                                levelNums = levelNums.split(',');
                                if (levelNums.length == 1) {
                                    item.showNum = "第" + levelNums[0] + '关';
                                } else {
                                    item.showNum = "第" + levelNums[0] + '-' + levelNums[levelNums.length - 1] + '关';
                                }
                            }
                            item.gameGuid = item.games[0].gameGuid.match(/_(\w+)_/)[1];
                            pubGames.push(item);
                        })
                        dispatch({
                            type: GAMES_LIST_SUCCESS,
                            gameList: pubGames,
                            clzId: this.getPubGamesParam.clzId,
                            moreFlag: pubGames.length >= page.needDataNum,
                            refreshFlag: refreshFlag
                        });
                        return pubGames;
                    } else {
                        dispatch({type: GAMES_LIST_FAILURE});
                        console.error('backend error');
                        return false;
                    }
                },
                (err) => {
                    dispatch({type: GAMES_LIST_FAILURE});
                    console.error('network error');
                    return false;
                }
            )
        }
    }


    /**
     * 获取一个发布游戏的关卡
     * @param id
     */
    getPubGameLevels(id) {
        return this.commonService.commonPost(this.serverInterface.GET_PUB_GAME_LEVELS, {cgceId: id});
    }

    /**
     * 删除已发布游戏
     * @returns {promise}
     */
    @actionCreator
    delGame(id) {

        return (dispatch, getState) => {
            var params = {
                subject: 1, category: this.getPubGamesParam.category,
                clzId: getState().gl_selected_clazz.id,
                cgceIds: id
            };
            dispatch({type: DEL_GAME_REQUEST})
            return this.commonService.commonPost(this.serverInterface.DEL_PUB_GAME, params).then((data) => {
                    if (data.code == 200) {
                        dispatch({
                            type: DEL_GAME_SUCCESS, gameId: id,
                            clzId: getState().gl_selected_clazz.id
                        });
                        this.commonService.alertDialog('删除成功');
                        return true;
                    } else {
                        this.commonService.alertDialog('删除失败，请重试', 1500);
                        dispatch({type: DEL_GAME_FAILURE})
                        console.error('backend error');
                        return false;
                    }

                },
                (err) => {
                    dispatch({type: DEL_GAME_FAILURE});
                    console.error('network error');
                    this.commonService.alertDialog('网络连接不畅，请稍后再试', 1500);
                }
            );
        }
    }

    /**
     * 变更已发布游戏的阅读状态
     * @returns {promise}
     */
    changeGameReadStatus(id) {
        var params = {cgceId: id, userId: this.getRootScope().user.userId};
        this.commonService.commonPost(this.serverInterface.UPDATE_NEW_GAME_STATUS, params);
    };

    /**
     * 移动游戏
     * @param pubGames   移动后的游戏
     * @returns {promise}
     */
    @actionCreator
    moveGame(pubGames, game, fromIndex, toIndex) {
        var configs = [];
        var params = {subject: 1, category: this.getPubGamesParam.category, clzId: ''};
        pubGames.forEach(function (item, index) {
            var data = {
                id: item.id,
                seq: index + 1
            }
            configs.push(data);
        });
        params.configs = JSON.stringify(configs);
        return (dispatch, getState) => {
            params.clzId = getState().gl_selected_clazz.id;
            dispatch({type: MOVE_GAME_START});
            return this.commonService.commonPost(this.serverInterface.UPDATE_PUB_GAME, params).then(data => {
                if (data.code == 200) {
                    dispatch({
                        type: MOVE_GAME_SUCCESS,
                        fromIndex: fromIndex, toIndex: toIndex,
                        game: game,
                        clzId: getState().gl_selected_clazz.id
                    })
                    return true;
                } else {
                    this.commonService.alertDialog('网络连接不畅，请稍后再试');
                    dispatch({type: MOVE_GAME_FAILURE})
                    return false;
                }
            });
        }

    }

    /**
     * 重置游戏
     * @param ids 需要重置的id集合
     * @returns {promise}
     */
    refGame(ids) {
        var params = {category: this.getPubGamesParam.category, clzId: this.getPubGamesParam.clzId, configs: ''};
        var data = {id: ''};
        var configs = [];
        ids.forEach(function (item) {
            data.id = item;
            configs.push(data);
        });
        params.configs = JSON.stringify(configs);
        return this.commonService.commonPost(this.serverInterface.RESET_GAME, params);
    }


    /**
     * 获取cgcId
     * @param gameGuid 游戏id
     */
    getGameCgcId(gameGuid) {
        var defer = $q.defer();
        var me = this;
        this.commonService.commonPost(this.serverInterface.GET_GAME_CGCID, {gameGuid: gameGuid}).then(function (data) {
            if (data) {
                me.game.cgcId = data.cgcId;
                me.game.cgceId = data.cgceId;
                defer.resolve(true);
                return;
            }
            defer.resolve(false);
        })
        return defer.promise;
    }

    /**
     * 获取星星排行榜数据
     * @param param
     * @returns {function(*, *)}
     */
    @actionCreator
    fetchGameStarRankData(param) {
        return (dispatch, getState)=> {
            dispatch({type: GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_START});
            let postInfo = this.commonService.commonPost(this.serverInterface.GET_GAME_STAR_RANK, param, true);
            postInfo.requestPromise.then((data)=> {
                if (data.code == 200) {
                    dispatch({
                        type: GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_SUCCESS,
                        payload: {
                            clazzId: param.classId,
                            data: data.result
                        }
                    });
                    return;
                }
                dispatch({type: GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_FAIL});
            }, ()=> {
                dispatch({type: GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_FAIL});
            });
        }
    }

    @actionCreator
    forceGlUpdate() {
        return (dispatch, getState)=> {
            dispatch({type: FORCE_GL_UPDATE});
        }
    }

    @actionCreator
    changeClazz(id, name) {
        return (dispatch, getState)=> {
            dispatch({type: CHANGE_CLAZZ, id: id, name: name});
        }
    }

}
export default GameManageService;
/*services.service('gameManageService',
 function ($q, $http, $log, $rootScope, serverInterface, commonService) {
 "ngInject";
 this.gradeList = [];//教师年级列表
 this.gameList = []; //游戏列表
 this.clazzList = [];  //班级列表
 this.clazzArray = [];//班级数组
 this.game = {
 clzOrHome: $rootScope.homeOrClazz.type,
 gameGuid: '',
 gameName: '',
 gameDesc: '',
 isClicked: '',
 gameMode: ''
 }; //一个游戏基本信息
 this.gameInfo = {}; //一个游戏详情
 this.levelArray = [];   //存关卡数组
 this.configs = {games: []};//要发布的游戏数据
 this.getPubGamesParam = {subject: 1, category: $rootScope.homeOrClazz.type, clzId: null}; //获取已发布的游戏需要的参数 category:2
 //this.pubGameClazz= commonService.getLocalStorage('pubGameClazz') || {name:null,id:null};
 //this.getPubGameLevelsParam={id:''};

 /!**
 * 获取教师所教班级和默认游戏列表
 * @returns {promise}
 *!/
 this.getGameInit = function () {
 var me = this;
 me.gameList.length = 0;
 var defer = $q.defer();
 commonService.commonPost(serverInterface.GET_GAME_INIT).then(function (data) {
 me.gradeList.length = 0;
 if (data.code != 200) {
 defer.resolve(data);
 return;
 }
 if (data.tbs && data.tbs.length) {
 data.tbs.forEach(function (item) {
 me.gradeList.push(item);
 });
 }
 defer.resolve(data);
 });
 return defer.promise;
 }
 /!**
 * 根据年级获取游戏
 * @param num 年级号
 * @returns {*}
 *!/
 this.gameByGrade = function (id) {
 var me = this;
 var defer = $q.defer();
 var param = {tbId: id};
 commonService.commonPost(serverInterface.GET_GAME_BY_GRADE, param).then(function (data) {
 if (data.code != 200) {
 defer.resolve(false);
 return;
 }
 me.gameList.length = 0;
 if (data.games && data.games.length) {
 data.games.forEach(function (item) {
 me.gameList.push(item);
 });
 }
 defer.resolve(true);
 });
 return defer.promise;
 };


 /!**
 * 获取关卡
 * @param gameGuid 游戏id
 *!/
 this.getLevels = function () {
 var defer = $q.defer();
 var me = this;
 var param = {gameGuid: me.game.gameGuid};
 commonService.commonPost(serverInterface.GET_LEVELS, param).then(function (data) {
 if (!data) {
 defer.resolve(false);
 return;
 }
 me.levelArray.length = 0;
 if (data.levels && data.levels.length) {
 if (me.game.gameMode == 150) {
 data.levels.splice(0, 1)
 }
 ; //处理特殊游戏，只能选择一关
 data.levels.forEach(function (level) {
 level.isClicked = false;
 });
 var array = commonService.setLevel(data.levels);
 array.forEach(function (level) {
 me.levelArray.push(level);
 });
 }
 defer.resolve(true);
 });
 return defer.promise;
 };

 /!**
 * 获取班级列表
 * @returns {promise}
 *!/
 this.getClassList = function () {
 var defer = $q.defer();
 var me = this;
 me.clazzList.length = 0;
 commonService.commonPost(serverInterface.GET_PUB_CLAZZ_LIST).then(function (data) {
 if (!data) {
 defer.resolve(false);
 return;
 }
 if (data.classes && data.classes.length) {
 data.classes.forEach(function (item) {
 item.isClicked = false;
 me.clazzList.push(item);
 });
 }
 defer.resolve(true);
 });
 return defer.promise;
 };

 /!**
 * 判断该班级能不能发布
 * @param clazzId 班级id | clzOrHome 课堂还是家庭
 * @returns {promise}
 *!/
 this.isPub = function (clazzId) {
 var param = {clzIds: clazzId, category: this.game.clzOrHome, subject: 1};
 return commonService.commonPost(serverInterface.ISPUB_GAME, param);
 }

 /!**
 * 发布游戏
 * @param param
 *!/
 this.pubGame = function (param) {
 //param.configs=JSON.stringify(this.configs);
 param.category = this.game.clzOrHome;
 return commonService.commonPost(serverInterface.PUB_GAME, param);
 };

 /!**
 * 通过班级id获取改班级已发布游戏
 * @returns {*}
 *!/

 this.getPubGames = (page, refreshFlag) => {
 return (dispatch, getState) => {
 this.getPubGamesParam.page = JSON.stringify(page);
 this.getPubGamesParam.clzId = getState().gl_selected_clazz.id;
 dispatch({type: GAMES_LIST_REQUEST})
 return commonService.commonPost(serverInterface.GET_PUB_GAMES, this.getPubGamesParam).then(
 (data) => {
 var pubGames = [];
 if (data.code == 200 && data.cgces) {
 data.cgces.forEach(function (item) {
 var levelNums = item.games[0].levelNums;
 if (levelNums) {
 levelNums = levelNums.split(',');
 if (levelNums.length == 1) {
 item.showNum = "第" + levelNums[0] + '关';
 } else {
 item.showNum = "第" + levelNums[0] + '-' + levelNums[levelNums.length - 1] + '关';
 }
 }
 item.gameGuid = item.games[0].gameGuid.match(/_(\w+)_/)[1];
 pubGames.push(item);
 })
 dispatch({
 type: GAMES_LIST_SUCCESS,
 gameList: pubGames,
 clzId: this.getPubGamesParam.clzId,
 moreFlag: pubGames.length >= page.needDataNum,
 refreshFlag: refreshFlag
 });
 return pubGames;
 } else {
 dispatch({type: GAMES_LIST_FAILURE});
 console.error('backend error');
 return false;
 }
 },
 (err) => {
 dispatch({type: GAMES_LIST_FAILURE});
 console.error('network error');
 return false;
 }
 )
 }
 }


 /!**
 * 获取一个发布游戏的关卡
 * @param id
 *!/
 this.getPubGameLevels = function (id) {
 return commonService.commonPost(serverInterface.GET_PUB_GAME_LEVELS, {cgceId: id});
 }
 /!**
 * 删除已发布游戏
 * @returns {promise}
 *!/
 this.delGame = function (id) {

 return (dispatch, getState) => {
 var params = {
 subject: 1, category: this.getPubGamesParam.category,
 clzId: getState().gl_selected_clazz.id,
 cgceIds: id
 };
 dispatch({type: DEL_GAME_REQUEST})
 return commonService.commonPost(serverInterface.DEL_PUB_GAME, params).then((data) => {
 if (data.code == 200) {
 dispatch({
 type: DEL_GAME_SUCCESS, gameId: id,
 clzId: getState().gl_selected_clazz.id
 });
 commonService.alertDialog('删除成功');
 return true;
 } else {
 commonService.alertDialog('删除失败，请重试', 1500);
 dispatch({type: DEL_GAME_FAILURE})
 console.error('backend error');
 return false;
 }

 },
 (err) => {
 dispatch({type: DEL_GAME_FAILURE});
 console.error('network error');
 commonService.alertDialog('网络连接不畅，请稍后再试', 1500);
 }
 );
 }
 }
 /!**
 * 变更已发布游戏的阅读状态
 * @returns {promise}
 *!/
 this.changeGameReadStatus = function (id) {
 var params = {cgceId: id, userId: $rootScope.user.userId};
 commonService.commonPost(serverInterface.UPDATE_NEW_GAME_STATUS, params);
 };

 /!**
 * 移动游戏
 * @param pubGames   移动后的游戏
 * @returns {promise}
 *!/

 this.moveGame = function (pubGames, game, fromIndex, toIndex) {
 var configs = [];
 var params = {subject: 1, category: this.getPubGamesParam.category, clzId: ''};
 pubGames.forEach(function (item, index) {
 var data = {
 id: item.id,
 seq: index + 1
 }
 configs.push(data);
 });
 params.configs = JSON.stringify(configs);
 return (dispatch, getState) => {
 params.clzId = getState().gl_selected_clazz.id;
 dispatch({type: MOVE_GAME_START});
 return commonService.commonPost(serverInterface.UPDATE_PUB_GAME, params).then(data => {
 if (data.code == 200) {
 dispatch({
 type: MOVE_GAME_SUCCESS,
 fromIndex: fromIndex, toIndex: toIndex,
 game: game,
 clzId: getState().gl_selected_clazz.id
 })
 return true;
 } else {
 commonService.alertDialog('网络连接不畅，请稍后再试');
 dispatch({type: MOVE_GAME_FAILURE})
 return false;
 }
 });
 }

 }

 /!**
 * 重置游戏
 * @param ids 需要重置的id集合
 * @returns {promise}
 *!/
 this.refGame = function (ids) {
 var params = {category: this.getPubGamesParam.category, clzId: this.getPubGamesParam.clzId, configs: ''};
 var data = {id: ''};
 var configs = [];
 ids.forEach(function (item) {
 data.id = item;
 configs.push(data);
 });
 params.configs = JSON.stringify(configs);
 return commonService.commonPost(serverInterface.RESET_GAME, params);
 }


 /!**
 * 获取cgcId
 * @param gameGuid 游戏id
 *!/
 this.getGameCgcId = function (gameGuid) {
 var defer = $q.defer();
 var me = this;
 commonService.commonPost(serverInterface.GET_GAME_CGCID, {gameGuid: gameGuid}).then(function (data) {
 if (data) {
 me.game.cgcId = data.cgcId;
 me.game.cgceId = data.cgceId;
 defer.resolve(true);
 return;
 }
 defer.resolve(false);
 })
 return defer.promise;
 }
 });*/
