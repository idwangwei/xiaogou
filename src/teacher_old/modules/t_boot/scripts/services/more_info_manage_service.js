/**
 * Created by 邓小龙 on 2016/11/18.
 */
import _sortby from 'lodash.sortby';
import _find from 'lodash.find';
import _each from 'lodash.foreach';
import {
    TROPHY_CHANGE_CLAZZ,
    TROPHY_CHANGE_TIME,
    FETCH_TROPHY_RANK_START,
    FETCH_TROPHY_RANK_SUCCESS,
    FETCH_TROPHY_RANK_FAIL
} from './../redux/action_typs';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';


import logger from 'log_monitor';

@Inject("$ngRedux","$q","$timeout","serverInterface", "commonService","finalData","$rootScope")

class MoreInfoManageService {
    $ngRedux;
    $q;
    $timeout;
    serverInterface;
    commonService;
    finalData;
    cancelTrophyRequestList = []; //取消奖杯排行的请求


    /**
     * 奖杯排行榜选择班级
     * @param reSelectClazz
     * @returns {function()}
     */
    @actionCreator
    changeTrophyClazz(reSelectClazz) {
        return (dispatch, getState)=> {     //改变班级
            if (!reSelectClazz)
                reSelectClazz = getState().profile_clazz.passClazzList[0];
            dispatch({type: TROPHY_CHANGE_CLAZZ, payload: reSelectClazz});
        };
    }



    /**
     * 奖杯排行榜选择学年
     * @param startTime
     * @param endTime
     * @returns {function()}
     */
    @actionCreator
    changeTrophyTime(startTime,endTime){
        return (dispatch, getState)=> {     //改变班级
            dispatch({type:  TROPHY_CHANGE_TIME, payload: {startTime:startTime,endTime:endTime}});
        };
    }

    /**
     * 获取奖杯排行数据
     * @param param
     * @returns {function()}
     */
    // @actionCreator
    fetchTrophyRankData(param) {
        let me=this;
        // return (dispatch)=> {
            // dispatch({type: FETCH_TROPHY_RANK_START});
            this.getRootScope().isTrophyLoading = true;
            let postInfo = me.commonService.commonPost(me.serverInterface.GET_TROPHY_RANK, {
                classId: param.clazzId,
                startTime: param.startTime,
                endTime: param.endTime
            }, true);
            me.cancelTrophyRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                debugger;
                // param.scope.$broadcast('scroll.refreshComplete');
                if (data.code == 200) {
                    this.getRootScope().isTrophyLoading = false;
                    this.getRootScope().trophyRankData = data.list||[];
                    // dispatch({
                    //     type: FETCH_TROPHY_RANK_SUCCESS,
                    //     payload: {stateKey: param.stateKey, trophyRankData: data.list}
                    // });

                    return;
                }
                this.getRootScope().trophyRankData = [];
                this.getRootScope().isTrophyLoading = false;
                // dispatch({type: FETCH_TROPHY_RANK_FAIL, payload: data});
            }, (res)=> {
                this.getRootScope().isTrophyLoading = false;
                // dispatch({type: FETCH_TROPHY_RANK_FAIL});
                // param.scope.$broadcast('scroll.refreshComplete');
            });
        // }
    }
}

export default MoreInfoManageService;


