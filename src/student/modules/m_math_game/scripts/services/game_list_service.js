/**
 * Created by qiyuexi on 2018/1/5.
 */
import {Service, actionCreator,Inject} from '../module';
import * as types from './../redux/action_types';
@Service('gameService')
@Inject("$log", "commonService", "mathGameInterface", "$rootScope", "$q", "mathGameFinalData")
class gameService{
    constructor(){
        /**
         * 删除请求的defer列表
         * @type {Array}
         */
        this.cancelRequestDeferList = [];
        /**
         * 获取关卡列表信息
         * @returns {promise}
         */
        this.getPlayGame = function () {
            var params = {
                role: 'S',
                cgceId: this.selectedGame.cgceId,
                cgcId: this.selectedGame.cgcId
            };
            return this.commonService.commonPost(this.mathGameInterface.GET_PLAY_GAME, params);
        };

        /**
         * 判断该游戏是否能玩
         * @returns {promise}
         */
        this.isGameCanPlay = function (params) {
            return this.commonService.commonPost(this.mathGameInterface.IS_GAME_CAN_PLAY, params);
        };


        this.changeClazz = (reSelectClazz)=>(dispatch,getState)=> {     //改变班级
            let state = getState();
            try{
                if(!reSelectClazz || !reSelectClazz.id){
                    dispatch({type: types.GAME_LIST.GAME_LIST_CHANGE_CLAZZ, payload: reSelectClazz  ? reSelectClazz: {}});
                    return ;
                }
            }catch(err){
                console.error(err);
                return;
            }

            let gameList = state.game_list.clazzListWithGames[reSelectClazz.id];
            dispatch({type: types.GAME_LIST.GAME_LIST_CHANGE_CLAZZ, payload: reSelectClazz});
            dispatch({
                type: types.GAME_LIST.CHANGE_GAME_LIST_PAGINATION_INFO,
                payload: {
                    seq: gameList.length?gameList.length:0,
                    needDataNum: state.game_list.maxItemPerPage
                }
            });
            //$rootScope.selectedClazz=reSelectClazz;
        };
        this.changeSeq = ()=> {                     //加载更多改变seq参数
            return function (dispatch, getState) {
                let state = getState();
                dispatch({
                    type: types.GAME_LIST.GAME_LIST_CHANGE_SEQ,
                    seq: state.game_list.gameList.length
                });
            }
        };

        this.fetchGameList = function (loadMore, loadMoreCallback) {
            loadMoreCallback = loadMoreCallback || angular.noop;
            return  (dispatch, getState)=>{
                let defer = this.$q.defer();
                let state = getState();
                let clzId = state.game_list.selectedClazz.id;
                if (!clzId)return loadMoreCallback(loadMore,true);
                let gameList = state.game_list.clazzListWithGames[clzId];
                if (loadMore && (!gameList || gameList.size == 0))return loadMoreCallback(loadMore,true); //如果这个班级没有游戏列表，无需加载更多数据
                let paginationInfo = state.game_list.paginationInfo;
                if (!loadMore) { //如果没有加载更多的选项，则表示更新列表下所有的内容，则需要重新设置分页信息
                    paginationInfo={
                        seq: 0,
                        needDataNum: (gameList && gameList.length > state.game_list.maxItemPerPage) ?
                            gameList.length : state.game_list.maxItemPerPage
                    };
                    dispatch({
                        type: types.GAME_LIST.CHANGE_GAME_LIST_PAGINATION_INFO,
                        payload: paginationInfo
                    });
                }
                let params = {
                    clzId: clzId,
                    subject: 1,
                    category: this.mathGameFinalData.CATEGORY,
                    page: JSON.stringify(paginationInfo)
                };
                //dispatch({type:types.GAME_LIST.CLEAR_GAMES_BY_MONTH});
                dispatch({type: types.GAME_LIST.FETCH_GAME_LIST_START});
                let postInfo = this.commonService.commonPost(this.mathGameInterface.GET_GAME_DATA, params, true);
                this.cancelRequestDeferList.push(postInfo.cancelDefer);
                postInfo.requestPromise.then((data) => {
                    if (data.code != 200) {
                        dispatch({type: types.GAME_LIST.FETCH_GAME_LIST_FAILED, error_getGameList: data});
                        return defer.resolve(false);
                    }
                    var gameList = [];
                    if (data && data.gameGrades.games) {
                        angular.forEach(data.gameGrades.games, function (game) {
                            var levelNumArr = game.levels;

                            //显示游戏的知识点名称
                            if(angular.isArray(levelNumArr) && levelNumArr.length > 0){
                                game.showName = levelNumArr[0].kdName;
                            }
                            else{
                                game.showName = game.name;
                            }

                            gameList.push(game);
                        });
                        dispatch({
                            type: types.GAME_LIST.FETCH_GAME_LIST_SUCCESS,
                            payload: {
                                list: gameList,
                                updateOrAppend: !loadMore
                            }
                        });
 
                        dispatch({
                            type: types.GAME_LIST.CHANGE_GAME_LIST_PAGINATION_INFO,
                            payload: {
                                seq: gameList.length?gameList.length:0,
                                needDataNum: state.game_list.maxItemPerPage
                            }
                        });
                        if (gameList.length >= state.game_list.maxItemPerPage) {
                            loadMoreCallback(loadMore);
                        }
                        else {
                            loadMoreCallback(loadMore, true);
                        }
                    }
                    else {
                        dispatch({
                            type: types.GAME_LIST.FETCH_GAME_LIST_SUCCESS,
                            payload: {
                                list: gameList,
                                updateOrAppend: false
                            }
                        });
                        loadMoreCallback(loadMore, true);
                    }
                    defer.resolve(true);
                },(res)=>{
                    dispatch({type: types.GAME_LIST.FETCH_GAME_LIST_FAILED});
                    loadMoreCallback(loadMore, true);
                    defer.reject(res);
                });
                return defer.promise;
            }
        };
        this.checkGameCanPlay = (game, callback)=>(dispatch, getState)=> {
            callback = callback || angular.noop;
            dispatch({type: types.GAME_LIST.CHECK_IS_GAME_CAN_PLAY_START})
            this.commonService.commonPost(this.mathGameInterface.IS_GAME_CAN_PLAY, {
                cgcId: game.cgcId,
                cgceId: game.cgceId,
                seq: game.cgceSeq
            }).then((data)=> {
                if (data.code == 200 || data.code == 2016 || data.code == 2017 || data.code == 2018) {
                    dispatch({type: types.GAME_LIST.CHECK_IS_GAME_CAN_PLAY_SUCCESS});
                    data.code == 200 ? callback.call(this, true) : callback.call(this, false);
                } else {
                    dispatch({type: types.GAME_LIST.CHECK_IS_GAME_CAN_PLAY_FAIL});
                    callback.call(this, false);
                }
            });
        };
        this.selectGame = (game)=>(dispatch)=> {
            dispatch({type: types.GAME_LIST.GAME_LIST_SELECT_GAME, payload: game});
        };

        this.fetchLevelList = (game, callback)=>(dispatch)=> {
            callback = callback || angular.noop;
            let params = {
                role: 'S',
                cgceId: game.cgceId,
                cgcId: game.cgcId
            };
            dispatch({type: types.GAME_LIST.FETCH_LEVEL_LIST_START});
            this.commonService.commonPost(this.mathGameInterface.GET_PLAY_GAME, params).then((data)=> {
                if (data.code == 200) {
                    dispatch({type: types.GAME_LIST.FETCH_LEVEL_LIST_SUCCESS, payload: data});
                } else if (data.code == 2016 || data.code == 2017) {
                    dispatch({type: types.GAME_LIST.FETCH_LEVEL_LIST_SUCCESS, payload: data});
                } else {
                    dispatch({type: types.GAME_LIST.FETCH_LEVEL_LIST_FAIL, payload: data});
                }
            });
        };



        this.getGameNum = function(gameGuid) {
            if (gameGuid == "aa1" || gameGuid == "aa2" || gameGuid == "aa3" || gameGuid == "aa4") {
                return 11;
            }
            let reg = new RegExp(gameGuid + "([^\\d]|$)");
            for (var key in this.mathGameFinalData.GAME_NUM) {
                for (var i = 0; i < this.mathGameFinalData.GAME_NUM[key].length; i++) {
                    if (this.mathGameFinalData.GAME_NUM[key][i].match(reg)) {
                        return +key;
                    }
                }
            }
            console.log("没有找到" + gameGuid);
        };
    }
}
export default gameService