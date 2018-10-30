/**
 * Created by liangqinli on 2016/10/29.
 */
import {Service, Inject, actionCreator} from '../../module';
import {
    RAPID_CALC_COUNT_REQUEST,
    RAPID_CALC_COUNT_SUCCESS,
    RAPID_CALC_COUNT_FAILURE,
    FIGHTER_RANK
} from '../../redux/action_types';
@Service('rapidCalcCountService')
@Inject("$q", "serverInterface", "commonService", '$ngRedux')
class RapidCalcCountService {
    gamePattern = 1;  //1 白天模式，2夜晚模式。目前只有白天模式
    constructor() {
    }

    @actionCreator
    getRapidCalcCount() {
        return (dispatch, getState) => {
            dispatch({type: RAPID_CALC_COUNT_REQUEST});
            var params = {
                classId: getState().rc_selected_clazz.id,
                userId: getState().profile_user_auth.user.userId,
                gamePattern: this.gamePattern
            };
            return this.commonService.commonPost(this.serverInterface.GET_RAPID_CALC_COUNT, params).then((data)=> {
                //console.log('RAPID_CALC_COUNT_REQUEST:  ', data);
                if (data.code === 200 && data.results) {
                    var grades = [[], [], [], [], [], []];
                    data.results.forEach((item) => {
                        //i对应年级
                        for (var i = 0; i < 6; i++) {
                            grades[i].push({
                                name: item.name,
                                gender: item.gender,
                                grade: item.passLevelInfoList[i].grade,
                                passLevel: item.passLevelInfoList[i].passLevel,
                                totalLevel: item.passLevelInfoList[i].totalLevel
                            })
                        }
                    });
                    //console.log('grades:  ', grades);
                    dispatch({
                        type: RAPID_CALC_COUNT_SUCCESS,
                        studentPassInfo: grades
                    })
                } else {
                    dispatch({type: RAPID_CALC_COUNT_FAILURE});
                }
            })
        }
    }

    getRcLevelsName(grade, classId) {
        return this.commonService.commonPost(this.serverInterface.GET_RC_LEVELS_NAME, {grade, classId}).then((data) => {
            if (data.code === 200 && data.result && data.result.length > 0) {
                return data.result;
            } else {
                this.commonService.alertDialog('服务器错误');
                return false;
            }
        })
    }

    /**
     * 获取斗士排行榜数据
     * @param param
     * @returns {function(*, *)}
     */
    @actionCreator
    fetchFighterRankData(param) {
        return (dispatch, getState)=> {
            dispatch({type: FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_START});
            let postInfo = this.commonService.commonPost(this.serverInterface.GET_FIGHTER_RANK, param, true);

            postInfo.requestPromise.then((data)=> {
                if (data.code == 200) {
                    dispatch({
                        type: FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_SUCCESS,
                        payload: {
                            clazzId: param.classId,
                            data: data.result
                        }
                    });
                    return;
                }
                dispatch({type: FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_FAIL});
            }, ()=> {
                dispatch({type: FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_FAIL});
            });
        }
    }
}


export default RapidCalcCountService;