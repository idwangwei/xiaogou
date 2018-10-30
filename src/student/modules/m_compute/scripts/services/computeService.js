/**
 * Created by qiyuexi on 2018/1/8.
 */
import {Service, actionCreator,Inject} from '../module';
import * as types from './../redux/action_types';
@Service('computeService')
@Inject("$log", "commonService", "computeInterface", "$rootScope", "$q")
class computeService{
    cancelRequestList = [];
    constructor(){}
    changeComputeClazz(clazz) {
        return (dispatch) => {
            dispatch({type: types.COMPUTE.COMPUTE_CHANGE_CLAZZ, payload: clazz ? clazz : {}})
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
            let postInfo = this.commonService.commonPost(this.computeInterface.GET_FIGHTER_RANK, param, true);
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
}
export default computeService;