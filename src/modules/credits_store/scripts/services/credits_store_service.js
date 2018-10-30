/**
 * Created by ZL on 2017/11/6.
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import * as CREDITS_TASK from './../redux/action_types';

@Inject('$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state', '$ionicBackdrop', 'creditsStoreInterface', 'creditsInfoService')
class credits_store_service {

    sortType='asc';

    /**
     * 获取当前签到情况
     */
    /* @actionCreator
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
     }*/

    /**
     * 获取教师所有任务
     */
    @actionCreator
    getAllTaskList() {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            this.commonService.commonPostSpecial(this.creditsStoreInterface.GET_TEACHER_ALL_TASK).then((data)=> {
                if (data.code === 200) {
                    let tasks = data.result;
                    dispatch({type: CREDITS_TASK.TEACHER_TASK.FETCH_TASK_LIST_SUCCESS, payload: tasks});

                } else {
                }
                defer.resolve(data);
            }, (res)=> {
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 选择一个任务
     */
    @actionCreator
    selectTask(task) {
        return (dispatch, getState)=> {
            dispatch({type: CREDITS_TASK.TEACHER_TASK.SELECT_TEACHER_TASK, payload: task});
        }
    }

    /**
     * 查看明细——邀请学生加入班级：
     */
    // @actionCreator
    getCreateClassTaskProgress() {
        // return (dispatch, getState)=> {
        let defer = this.$q.defer();
        this.commonService.commonPostSpecial(this.creditsStoreInterface.CREATE_CLAZZ_INVITE_STUDENT_TASK_DETAIL).then((data)=> {
            if (data.code === 200) {
                // let tasks = data.result;
                // dispatch({type: CREDITS_TASK.TEACHER_TASK.FETCH_TASK_LIST_SUCCESS, payload: tasks});

            } else {
            }
            defer.resolve(data);
        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
        // }
    }


    /**
     * 查看明细——邀请教师注册：
     */
    // @actionCreator
    getInviteTeacherTaskProgress() {
        // return (dispatch, getState)=> {
        let defer = this.$q.defer();
        this.commonService.commonPostSpecial(this.creditsStoreInterface.INVITE_OTHER_TEACHER_TASK_DETAIL).then((data)=> {
            if (data.code === 200) {
                // let tasks = data.result;
                // dispatch({type: CREDITS_TASK.TEACHER_TASK.FETCH_TASK_LIST_SUCCESS, payload: tasks});

            } else {
            }
            defer.resolve(data);
        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
        // }
    }

    /**
     * 查看明细——作业：
     */
    // @actionCreator
    getPublishWorkTaskProgress() {
        // return (dispatch, getState)=> {
        let defer = this.$q.defer();
        this.commonService.commonPostSpecial(this.creditsStoreInterface.PUBLISH_WORK_TASK_DETAIL).then((data)=> {
            if (data.code === 200) {
                // let tasks = data.result;
                // dispatch({type: CREDITS_TASK.TEACHER_TASK.FETCH_TASK_LIST_SUCCESS, payload: tasks});

            } else {
            }
            defer.resolve(data);
        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
        // }
    }

    /**
     * 查看明细——游戏：
     */
    // @actionCreator
    getPublishGameTaskProgress() {
        // return (dispatch, getState)=> {
        let defer = this.$q.defer();
        this.commonService.commonPostSpecial(this.creditsStoreInterface.PUBLISH_GAME_TASK_DETAIL).then((data)=> {
            if (data.code === 200) {
                // let tasks = data.result;
                // dispatch({type: CREDITS_TASK.TEACHER_TASK.FETCH_TASK_LIST_SUCCESS, payload: tasks});

            } else {
            }
            defer.resolve(data);
        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
        // }
    }

    /**
     * 查看明细--教学实效奖
     */
    getTeacherTeachTaskProgress() {
        let defer = this.$q.defer();
        this.commonService.commonPostSpecial(this.creditsStoreInterface.TEACHER_TEACH_DETAIL).then((data)=> {
            if (data.code === 200) {
            } else {
            }
            defer.resolve(data);
        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }

    /**
     * 获取任务奖励列表：
     */
    getAwardList() {
        let defer = this.$q.defer();
        this.commonService.commonPostSpecial(this.creditsStoreInterface.GET_ALL_AWARD_LIST).then((data)=> {
            if (data.code === 200) {
                defer.resolve(data);
            } else {
                defer.resolve(false);
            }

        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }

    /**
     * 领取积分
     */
    getTaskAward(awardIds) {
        let defer = this.$q.defer();
        let param = {awardIds: awardIds};
        this.commonService.commonPostSpecial(this.creditsStoreInterface.TASK_GAIN_AWARD, param).then((data)=> {
            if (data.code === 200) {
                defer.resolve(data);
                this.creditsInfoService.fetchTeaScoreDetail();
            } else {
                defer.resolve(false);
            }

        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }


    /**
     * 获取默认收件人 TODO 如果有修改默认收件地址 则 下单完成后要调用该接口更新默认收件人数据
     */
    @actionCreator
    getDefaultReceiver() {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: CREDITS_TASK.GET_DEFAULT_RECEIVER_START});
            this.commonService.commonPostSpecial(this.creditsStoreInterface.GET_DEFAULT_RECEIVER_INFO).then((data)=> {
                if (data.code === 200) {
                    let receiver = data.result;
                    dispatch({type: CREDITS_TASK.GET_DEFAULT_RECEIVER_SUCCESS, payload: receiver});
                    defer.resolve(receiver);
                } else {
                    dispatch({type: CREDITS_TASK.GET_DEFAULT_RECEIVER_FAIL});
                    defer.resolve(false);
                }
            }, (res)=> {
                dispatch({type: CREDITS_TASK.GET_DEFAULT_RECEIVER_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 选择商品
     */
    @actionCreator
    selectCreditsGoods(goods) {
        return (dispatch, getState)=> {
            dispatch({type: CREDITS_TASK.CREDITS_GOODS.SELECT_CREDITS_GOODS, payload: goods});
        }
    }

    /**
     * 获取所有可兑换商品列表
     */
    @actionCreator
    getAllGoodsList(sortType,isfirst, lastkey, count) {
        return (dispatch, getState)=> {
            let param = {};
            param.sort = 'desc';
            if(sortType=='asc') param.sort = 'asc';

            if (isfirst) {
                param.startIndex = 0;
            } else {
                param.startIndex = lastkey;
            }
            param.size = count || 16;

            let defer = this.$q.defer();
            dispatch({type: CREDITS_TASK.CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_START});
            this.commonService.commonPostSpecial(this.creditsStoreInterface.GET_GOODS_LIST, param).then((data)=> {
                if (data.code === 200) {
                    let goodsListInfo = data;
                    let hotGoods = [];
                    if (isfirst || !lastkey || lastkey == 0) { //只有第一次返回热门商品
                        hotGoods = goodsListInfo.hotGoods;
                    }
                    let goods = goodsListInfo.normalGoods;
                    let newLastkey = lastkey||0;
                    newLastkey +=  goods.length;
                    if (isfirst) {
                        dispatch({
                            type: CREDITS_TASK.CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_SUCCESS, payload: {
                                hotSellGoods: hotGoods,
                                goods: goods,
                                lastKey: newLastkey,
                                count: count || 16
                            }
                        });
                    } else {
                        dispatch({
                            type: CREDITS_TASK.CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_MORE, payload: {
                                goods: goods,
                                lastKey: newLastkey,
                                count: count || 16
                            }
                        });
                    }

                    defer.resolve(true);
                } else {
                    dispatch({type: CREDITS_TASK.CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_FAIL});
                    defer.resolve(false);
                }
            }, (res)=> {
                dispatch({type: CREDITS_TASK.CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     *下订单
     */
    createCreditsOrder(goodsId, receiver, setDefault) {
        let param = {};
        param.goodsId = goodsId;
        param.name = receiver.name;
        param.phone = receiver.phone;
        param.address = receiver.address;
        param.setDefault = setDefault;
        let defer = this.$q.defer();
        this.commonService.commonPostSpecial(this.creditsStoreInterface.CREDITS_ORDER, param).then((data)=> {
            if (data.code === 200) {
                defer.resolve(data);
                this.creditsInfoService.fetchTeaScoreDetail();//成功后刷新积分
            } else {
                defer.resolve(false);
            }

        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }

    /**
     *查询订单
     */
    getCreditsOrder(goodsId) {
        // GET_ORDER_DETAIL
        let defer = this.$q.defer();
        this.commonService.commonPostSpecial(this.creditsStoreInterface.GET_ORDER_DETAIL, {goodsId: goodsId}).then((data)=> {
            if (data.code === 200) {
                defer.resolve(data);
            } else {
                defer.resolve(false);
            }

        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }

    /**
     * 确认完成订单
     */
    submitFinishOrder(orderId) {
        let defer = this.$q.defer();
        let param = {};
        param.orderId = orderId;
        this.commonService.commonPostSpecial(this.creditsStoreInterface.FINISH_ORDER, param).then((data)=> {
            if (data.code === 200) {
                defer.resolve(data);
            } else {
                defer.resolve(false);
            }

        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }
}


export default credits_store_service;