/**
 * Created by Administrator on 2017/5/4.
 */
import {Inject, actionCreator} from '../module';
import * as REWARD from './../redux/action_types';

@Inject('$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state', '$ionicBackdrop', 'rewardInterface', 'profileService')
class sign_in_service {

    /**
     * 修改当日签到状态
     */
    /*@actionCreator
     changeSignInDate(dispatch) {
     return (dispatch)=> {
     dispatch({type: REWARD.CHANGE_SIGN_IN_DATE});
     }
     }*/

    cancelRequestList = [];

    /**
     * 获取当前签到情况
     */
    @actionCreator
    getSignInInfo() {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: REWARD.FETCH_SIGN_INFO_START});
            this.commonService.commonPostSpecial(this.rewardInterface.GET_SIGN_IN_INFO).then((data)=> {
                if (data.code === 200) {
                    let sign = data.sign;
                    dispatch({type: REWARD.FETCH_SIGN_INFO, payload: sign});
                    dispatch({type: REWARD.FETCH_SIGN_INFO_SUCCESS});

                } else {
                    dispatch({type: REWARD.FETCH_SIGN_INFO_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: REWARD.FETCH_SIGN_INFO_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }


    /**
     * 签到
     */
    @actionCreator
    doneSignIn() {
        return (dispatch, getState)=> {
            // let parms={}
            let defer = this.$q.defer();
            dispatch({type: REWARD.SIGN_INFO_START});
            this.commonService.commonPostSpecial(this.rewardInterface.SIGN_IN_EXECUTE).then((data)=> {
                if (data.code === 200) {
                    // this.changeSignInDate(dispatch);
                    let userName = getState().profile_user_auth.user.loginName;
                    dispatch({type: REWARD.CHANGE_SIGN_IN_DATE, payload: userName});
                    dispatch({type: REWARD.SIGN_INFO_SUCCESS});
                } else {
                    dispatch({type: REWARD.SIGN_INFO_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: REWARD.SIGN_INFO_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 获取每日任务信息
     */
    @actionCreator
    getDayTaskInfo() {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: REWARD.FETCH_DAY_TASK_INFO_START});
            this.commonService.commonPostSpecial(this.rewardInterface.GET_DAY_TASK).then((data)=> {
                if (data.code === 200) {
                    let tasks = data.task;
                    dispatch({type: REWARD.FETCH_DAY_TASK_INFO, payload: tasks});
                    dispatch({type: REWARD.FETCH_DAY_TASK_INFO_SUCCESS});

                } else {
                    dispatch({type: REWARD.FETCH_DAY_TASK_INFO_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: REWARD.FETCH_DAY_TASK_INFO_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 领取任务奖励
     */
    @actionCreator
    getTaskAward(taskId) {
        return (dispatch, getState)=> {
            let params = {'taskId': taskId};
            let defer = this.$q.defer();
            dispatch({type: REWARD.GET_DAY_TASK_INFO_START});
            this.commonService.commonPostSpecial(this.rewardInterface.GET_TASK_AWARD, params).then((data)=> {
                if (data.code === 200) {
                    dispatch({type: REWARD.GET_DAY_TASK_INFO_SUCCESS});
                } else {
                    dispatch({type: REWARD.GET_DAY_TASK_INFO_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: REWARD.GET_DAY_TASK_INFO_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 获取兑换商品列表
     */
    @actionCreator
    getGoodsList() {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: REWARD.FETCH_REWARD_GOODS_LIST_START});
            this.commonService.commonPostSpecial(this.rewardInterface.GET_GOODS_LIST).then((data)=> {
                if (data.code === 200) {
                    dispatch({type: REWARD.FETCH_REWARD_GOODS_LIST_SUCCESS});
                } else {
                    dispatch({type: REWARD.FETCH_REWARD_GOODS_LIST_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: REWARD.FETCH_REWARD_GOODS_LIST_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 获取兑换商品列表
     */
    @actionCreator
    exchangeGoods(goodsId) {
        return (dispatch, getState)=> {
            let params = {
                'goodsId': goodsId
                // id: goodsId
            };
            let defer = this.$q.defer();
            dispatch({type: REWARD.EXCHANGE_REWARD_GOODS_START});
            this.commonService.commonPostSpecial(this.rewardInterface.BUY_GOODS, params).then((data)=> {
                if (data.code === 200) {
                    dispatch({type: REWARD.EXCHANGE_REWARD_GOODS_SUCCESS});
                } else {
                    dispatch({type: REWARD.EXCHANGE_REWARD_GOODS_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: REWARD.EXCHANGE_REWARD_GOODS_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 切换称号
     * @param group
     * @returns {function(*, *)}
     */
    @actionCreator
    changeLevelNameGroup(group) {
        return (dispatch, getState)=> {
            let params = {
                title: group
            };
            let defer = this.$q.defer();
            dispatch({type: REWARD.CHANGE_LEVEL_NAME_START});
            this.commonService.commonPostSpecial(this.rewardInterface.CHANGE_USER_HEAD, params).then((data)=> {
                if (data.code === 200) {
                    if (data.updateOk) {
                        let level = getState().user_reward_base.level;
                        let nameList = getState().level_name_list.levelNameList;
                        let levelData = this.profileService.analyzeRewardLevelData(nameList, level, group);
                        dispatch({
                            type: "FETCH_LEVEL_NAME_LIST",
                            payload: {nameList: nameList, levelData: levelData}
                        });
                    }
                    dispatch({type: REWARD.CHANGE_LEVEL_NAME, payload: group});
                    dispatch({type: REWARD.CHANGE_LEVEL_NAME_SUCCESS});
                } else {
                    dispatch({type: REWARD.CHANGE_LEVEL_NAME_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: REWARD.CHANGE_LEVEL_NAME_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 获取称号列表
     */
    /*   @actionCreator
     getLevelNameList() {
     return (dispatch, getState)=> {
     let defer = this.$q.defer();
     dispatch({type: REWARD.FETCH_LEVEL_NAME_LIST_START});
     this.commonService.commonPostSpecial(this.rewardInterface.LEVEL_NAME_LIST).then((data)=> {
     if (data.code === 200) {
     let nameList = data.titles;
     dispatch({type: REWARD.FETCH_LEVEL_NAME_LIST, payload:nameList});
     dispatch({type: REWARD.FETCH_LEVEL_NAME_LIST_SUCCESS});

     } else {
     dispatch({type: REWARD.FETCH_LEVEL_NAME_LIST_FAIL});
     }
     defer.resolve(data);
     }, (res)=> {
     dispatch({type: REWARD.FETCH_LEVEL_NAME_LIST_FAIL});
     defer.resolve(data);
     });
     return defer.promise;
     }
     }*/

    @actionCreator
    getClazzLevelNameRank(clazzId) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: REWARD.FETCH_LEVEL_NAME_RANK_LIST_START});
            let postInfo = this.commonService.commonPost(this.rewardInterface.GET_LEVEL_NAME_RANK_LIST, {classId: clazzId}, true);
            me.cancelRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code === 200) {
                    let levelList = getState().level_name_list.levelAnalyzeData;
                    let group = getState().user_reward_base.title || 1;
                    let newList = this.analyzeClazzLevelNameList(data.studentTitle, levelList, group);
                    dispatch({type: REWARD.FETCH_LEVEL_NAME_RANK_LIST_SUCCESS, payload: newList});
                } else {
                    dispatch({type: REWARD.CLEAR_LEVEL_NAME_RANK_LIST, payload: []});
                    dispatch({type: REWARD.FETCH_LEVEL_NAME_RANK_LIST_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: REWARD.CLEAR_LEVEL_NAME_RANK_LIST, payload: []});
                dispatch({type: REWARD.FETCH_LEVEL_NAME_RANK_LIST_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    analyzeClazzLevelNameList(clazzLevelList, levelList, group) {
        let len = levelList.length;
        angular.forEach(clazzLevelList, (stu) => {
            for (let i = 0; i < len; i++) {
                if (stu.level >= levelList[i].startLevel && stu.level >= levelList[i].endLevel) {
                    stu.imgIndex = i;
                    stu.group = group;
                }
            }

        });
        return clazzLevelList;
    }

    @actionCreator
    clearClazzLevelNameRank() {
        return (dispatch)=> {
            dispatch({type: REWARD.CLEAR_LEVEL_NAME_RANK_LIST, payload: []});
        };
    }

    /**
     * 设置作业列表的urlFrom 到store保存
     * @param reSelectGrade
     * @returns {function()}
     */
    @actionCreator
    changeUrlFromForStore(urlFrom) {
        return (dispatch, getState)=> {
            dispatch({type: 'CHANGE_WORK_LIST_URL_FROM', payload: {urlFrom: urlFrom}});
        };
    }

    @actionCreator
    changeClazz(reSelectClazz) {
        return (dispatch, getState)=> {
            try {
                //改变班级
                if (!reSelectClazz)
                    reSelectClazz = getState().profile_clazz.clazzList[0];
            } catch (err) {
                reSelectClazz = {};
            }

            dispatch({type: 'WORK_LIST_CHANGE_CLAZZ', payload: reSelectClazz});
            this.getRootScope().selectedClazz = reSelectClazz;
        }
    };
}


export default sign_in_service;