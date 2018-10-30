/**
 * Created by 邓小龙 on 2016/10/20.
 * @description 主页信息service
 */

import services from  './index';
import BaseService from 'base_components/base_service';
import * as types from '../redux/actiontypes/actiontypes';
class HomeInfoService extends BaseService {
    constructor() {
        super(arguments);
        this.cancelRequestList = [];//取消排行的请求
    }

    /**
     * 选择奖杯排行榜选择班级
     * @param reSelectClazz
     * @returns {function()}
     */
    changeTrophyClazz(reSelectClazz) {
        return (dispatch, getState)=> {     //改变班级
            if (!reSelectClazz)
                reSelectClazz = getState().profile_clazz.passClazzList[0];
            dispatch({type: types.TROPHY_RANK.TROPHY_CHANGE_CLAZZ, payload: reSelectClazz});
        };
    }

    /**
     * 奖杯排行榜选择学年
     * @param startTime
     * @param endTime
     * @returns {function()}
     */
    changeTrophyTime(startTime, endTime) {
        return (dispatch, getState)=> {     //改变班级
            dispatch({type: types.TROPHY_RANK.TROPHY_CHANGE_TIME, payload: {startTime: startTime, endTime: endTime}});
        };
    }

    /**
     * 获取奖杯排行数据
     * @param param
     * @returns {function()}
     */
    fetchTrophyRankData(param) {
        return (dispatch)=> {
            dispatch({type: types.TROPHY_RANK.FETCH_TROPHY_RANK_START});
            let postInfo = this.commonService.commonPost(this.serverInterface.GET_TROPHY_RANK, {
                classId: param.clazzId,
                startTime: param.startTime,
                endTime: param.endTime
            }, true);
            this.cancelRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code == 200) {
                    dispatch({
                        type: types.TROPHY_RANK.FETCH_TROPHY_RANK_SUCCESS,
                        payload: {stateKey: param.stateKey, trophyRankData: data.list}
                    });
                    return;
                }
                dispatch({type: types.TROPHY_RANK.FETCH_TROPHY_RANK_FAIL, payload: data});
            }, ()=> {
                dispatch({type: types.TROPHY_RANK.FETCH_TROPHY_RANK_FAIL});
            });
        }
    }

    /**
     * 获取星星排行榜数据
     * @param param
     * @returns {function(*, *)}
     */
    fetchGameStarRankData(param) {
        return (dispatch, getState)=> {
            dispatch({type: types.GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_START});
            let postInfo = this.commonService.commonPost(this.serverInterface.GET_GAME_STAR_RANK, param, true);
            this.cancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data)=> {
                if (data.code == 200) {
                    dispatch({
                        type: types.GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_SUCCESS,
                        payload: {
                            clazzId: param.classId,
                            data: data.result
                        }
                    });
                    return;
                }
                dispatch({type: types.GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_FAIL});
            }, ()=> {
                dispatch({type: types.GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_FAIL});
            });
        }
    }

    /**
     * 获取斗士排行榜数据
     * @param param
     * @returns {function(*, *)}
     */
    fetchFighterRankData(param) {
        return (dispatch, getState)=> {
            dispatch({type: types.FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_START});
            let postInfo = this.commonService.commonPost(this.serverInterface.GET_FIGHTER_RANK, param, true);
            this.cancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data)=> {
                if (data.code == 200) {
                    dispatch({
                        type: types.FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_SUCCESS,
                        payload: {
                            clazzId: param.classId,
                            data: data.result
                        }
                    });
                    return;
                }
                dispatch({type: types.FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_FAIL});
            }, ()=> {
                dispatch({type: types.FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_FAIL});
            });
        }
    }

    /**
     * 获取寒假作业直播数据
     */
    fetchWinterBroadcastData(){
        let defer = this.$q.defer();
        //publishType:5,limit:50,minScore:0
        this.commonService.commonPost(this.serverInterface.GET_WINTER_BROADCAST_DATA,{limit:50,minScore:0}).then((data)=> {
            if (data.code !== 200) {
                defer.resolve(false);
                return;
            }
            defer.resolve(data);
        },()=>{
            defer.reject();
        });
        // setTimeout(()=>{defer.resolve(false)},2000);

        return defer.promise;
    }
    /**
     * 获取当前签到情况
     */
    getSignInInfo(dispatch,getState) {
            let defer = this.$q.defer();
            dispatch({type: "FETCH_SIGN_INFO_START"});
            this.commonService.commonPostSpecial("/signIn/get").then((data)=> {
                if (data.code === 200) {
                    let sign = data.sign;
                    dispatch({type: "FETCH_SIGN_INFO", payload: sign});
                    dispatch({type: "FETCH_SIGN_INFO_SUCCESS"});

                } else {
                    dispatch({type: "FETCH_SIGN_INFO_FAIL"});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: "FETCH_SIGN_INFO_FAIL"});
                defer.resolve(false);
            });
            return defer.promise;
    }
    doneSignIn(dispatch,getState) {
            // let parms={}
            let defer = this.$q.defer();
            dispatch({type: "SIGN_INFO_START"});
            this.commonService.commonPostSpecial("/signIn/execute").then((data)=> {
                if (data.code === 200) {
                    // this.changeSignInDate(dispatch);
                    let userName = getState().profile_user_auth.user.loginName;
                    dispatch({type: "CHANGE_SIGN_IN_DATE", payload: userName});
                    dispatch({type: "SIGN_INFO_SUCCESS"});
                } else {
                    dispatch({type: "SIGN_INFO_FAIL"});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: "SIGN_INFO_FAIL"});
                defer.resolve(false);
            });
            return defer.promise;
    }
}
HomeInfoService.$inject = [
    "$http"
    , "$q"
    , "$log"
    , "$filter"
    , "$rootScope"
    , "serverInterface"
    , "finalData"
    , "commonService"
    , "$state"
    // , "gameService"
    , "pageRefreshManager"
];

services.service('homeInfoService', HomeInfoService);
