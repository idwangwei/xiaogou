/**
 * Created by WangLu on 2016/12/1.
 */
import lodash_assign from 'lodash.assign';
import {Inject, actionCreator} from '../module';
import {WEIXIN_PAY} from './../redux/actiontypes/actiontypes';
import {DIAGNOSE, UNIT, PROFILE, DIAGNOSE_CAMP} from './../redux/actiontypes/actiontypes';
import {SMART_TRAINING_CAMP} from './../redux/actiontypes/actiontypes';
// import {GAME_GOODS_PAY} from './../../../modules/game_map/scripts/redux/action_types/index';
@Inject('$http', '$q', '$rootScope', 'serverInterface', 'commonService', "$ngRedux", 'profileService')
class WxPayService {
    invite = {
        inviteAccount: '',
        inviteUserId: ''
    };
    orderType = {
        WX_APP: "app",
        WX_SCAN: "scan",
    };
    cancelDiagnoseGoodsMenusRequestList = []; //商品列表的请求

    rewardType = {
        IMPROVE: '1',
        STUDY: '2'
    };
    cancelTrainingCampRequestList = []; //学霸训练营的请求
    /**
     * 创建订单
     * @param productId 商品id
     * @param thirdPay 第三方支付，目前只有微信支付：wechat
     * @param payType 支付方式 "app"：跳转第三方直接支付，"scan"：扫码支付
     * @returns {*}
     */
    // @actionCreator
    createOrder(productId, thirdPay, payType) {
        let me = this;
        return (dispatch)=> {
            var defer = me.$q.defer();
            dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_START});
            me.commonService.commonPost(me.serverInterface.WXPAY_ORDER_CREATE, {
                goodsId: productId,
                thirdPayCode: thirdPay,
                type: payType
            }).then(data=> {
                if (data.code == 200) {
                    dispatch({
                        type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, productId: productId}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data=> {
                dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    // @actionCreator
    createXlyOrder(productId, thirdPay, payType, userId) {
        let me = this;
        return (dispatch)=> {
            var defer = me.$q.defer();
            dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_START});
            me.commonService.commonPost(me.serverInterface.WXPAY_XLY_ORDER_CREATE, {
                goodsIds: productId.toString(),
                thirdPayCode: thirdPay,
                type: payType,
                recommendId: userId
            }).then(data=> {
                if (data.code == 200) {
                    dispatch({
                        type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, productId: productId}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data=> {
                dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 查询订单状态
     * @param orderType 支付方式
     * @returns {*}
     */
    // @actionCreator
    queryOrder(orderType) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            let orderInfo = getState().wxpay_created_order_info[orderType];
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }

            dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_START});
            me.commonService.commonPost(me.serverInterface.WXPAY_ORDER_QUERY, {
                orderNo: orderInfo.orderNo
            }).then((data)=> {
                if (data.code == 200) {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_SUCCESS});
                    dispatch({
                        type: WEIXIN_PAY.CHANGE_WEI_XIN_PAY_ORDER_STATUS,
                        payload: {orderType: orderType, status: data.status}
                    });
                    if (data.status == 0) {
                        // dispatch({type: PROFILE.USER_IS_VIP_DIAGNOSE});
                        //刷新vips

                        me.commonService.commonPost(me.serverInterface.GET_ALL_VIPS_INFO).then((data)=> {
                            if (data.code == 200)dispatch({type: PROFILE.MODIFY_VIPS_INFO, data: data.vips});
                        });

                    }
                    defer.resolve(data);
                } else {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data=> {
                dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        }
    }


    /**
     * 查询团购订单
     * GROUP_BUYING_ORDER
     */
    // @actionCreator
    queryGroupBuyingOrder(orderType) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            let orderInfo = getState().group_buying_created_order_info[orderType];
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }

            dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_ORDER_START});
            me.commonService.commonPost(me.serverInterface.GROUP_BUYING_ORDER, {
                orderNo: orderInfo.orderNo
            }).then((data)=> {
                if (data.code == 200) {
                    dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_ORDER_SUCCESS});
                    dispatch({
                        type: WEIXIN_PAY.CHANGE_GROUP_BUYING_ORDER_STATUS,
                        payload: {orderType: orderType, status: data.status}
                    });
                    if (data.status == 0) {
                        dispatch({type: PROFILE.USER_IS_VIP_DIAGNOSE});
                    }
                    defer.resolve(data);
                } else {
                    dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data=> {
                dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_ORDER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        }
    }

    /**
     * 根据订单号查询团购状态
     * @param orderId
     * @returns {function(*, *)}
     */
    // @actionCreator
    getGroupOrderDetails(orderId) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            me.commonService.commonPost(me.serverInterface.GROUP_BUYING_ORDER, {
                orderNo: orderId
            }).then((data)=> {
                defer.resolve(data);
            }, data=> {
                defer.resolve(data);
            });
            return defer.promise;
        }
    }

    // @actionCreator
    getOrderDetails(orderId) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            me.commonService.commonPost(me.serverInterface.WXPAY_ORDER_QUERY, {
                orderNo: orderId
            }).then((data)=> {
                defer.resolve(data);
            }, data=> {
                defer.resolve(data);
            });
            return defer.promise;
        }
    }

    // @actionCreator
    getPayDetail() {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            dispatch({type: WEIXIN_PAY.FETCH_PAY_DETAIL_START});
            me.commonService.commonPost(me.serverInterface.GET_PAY_DETAIL, null).then((data)=> {
                defer.resolve(data);
                if (data.code != 200) {
                    dispatch({type: WEIXIN_PAY.FETCH_PAY_DETAIL_FAIL});
                    return;
                }
                if (data.code === 200) {
                    // let list = [];
                    // angular.forEach(data.goods, (item)=> {
                    //     item.desc = JSON.parse(item.desc);
                    //     list.push(item);
                    // });


                    dispatch({type: WEIXIN_PAY.FETCH_PAY_DETAIL_SUCCESS});
                    dispatch({type: WEIXIN_PAY.SAVE_PAY_DETAIL, payload: data.orders});
                }
            }, (res)=> {
                dispatch({type: WEIXIN_PAY.FETCH_GOODS_MENUS_FAIL});
            });
            return defer.promise;
        };


    };

    /**
     *  根据订单号查询训练营状态
     */
    // @actionCreator
    getXLYOrderDetails(orderId) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            me.commonService.commonPost(me.serverInterface.XLY_BUYING_ORDER, {
                orderNo: orderId
            }).then((data)=> {
                if (data && data.code == 200 && data.status == 0) {
                    dispatch({type: PROFILE.USER_IS_VIP_DIAGNOSE, payload: {xly: true}});
                }


                let mlcg, mathematicalOlympiad, diagnose;
                if (data.vips) {
                    data.vips.forEach((item)=> {
                        if (item.hasOwnProperty('mlcg')) {
                            mlcg = item.mlcg;
                        }
                        if (item.hasOwnProperty('diagnose')) {
                            diagnose = item.diagnose;
                        }
                        if (item.hasOwnProperty('mathematicalOlympiad')) {
                            mathematicalOlympiad = item.mathematicalOlympiad;
                        }
                    });
                }

                //修改游戏包开通情况
                if (mlcg) {
                    // dispatch({type: GAME_GOODS_PAY.UPDATE_GAME_VIP, data: mlcg});
                    dispatch({type: 'UPDATE_GAME_VIP', data: mlcg});
                }
                //修改诊断天数情况
                if (diagnose) {
                    dispatch({type: PROFILE.USER_IS_VIP_DIAGNOSE, data: diagnose});
                }
                //修改奥数开通情况
                if (mathematicalOlympiad) {
                    dispatch({type: PROFILE.USER_IS_VIP_MATH_OLY, data: mathematicalOlympiad});
                }


                defer.resolve(data);
            }, data=> {
                defer.resolve(data);
            });
            return defer.promise;
        }
    }

    //选择商品
    // @actionCreator
    selectedGood(good, callBack) {
        callBack = callBack || angular.noop;
        return (dispatch)=> {
            dispatch({type: PROFILE.SELECTED_GOOD, payload: good});
            callBack();
        };
    }

    //获取商品菜单
    // @actionCreator
    fetchGoodsMenus() {
        let me = this;
        return (dispatch, getState)=> {
            let url = me.serverInterface.GET_GOODS_MENUS, params = {category: 'XN-ZD'};
            dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseGoodsMenusRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let list = [];
                    angular.forEach(data.goods, (item)=> {
                        item.desc = JSON.parse(item.desc);
                        //todo 国庆大礼包
                        // item.desc.saleFee = 100;
                        // item.desc.saleMsg = '双节5折价';

                        list.push(item);
                    });
                    dispatch({
                        type: DIAGNOSE.FETCH_GOODS_MENUS_SUCCESS,
                        payload: list
                    });
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_FAIL});
            });

        };
    }


    //获取团购商品菜单列表
    // @actionCreator
    fetchGroupBuyingGoodsMenus() {
        let me = this;
        return (dispatch, getState)=> {
            let url = me.serverInterface.GET_GROUP_BUYING_GOODS_MENUS, params = {category: 'XN-ZD'};
            dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_GOODS_MENUS_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseGoodsMenusRequestList.push(postInfo.cancelDefer);//记录请求
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_GOODS_MENUS_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let list = [];
                    let leaderFavorable = [];
                    angular.forEach(data.goods, (item)=> {
                        item.desc = JSON.parse(item.desc);
                        list.push(item);
                    });

                    angular.forEach(data.leaderFavorable, (item)=> {
                        leaderFavorable.push(item);
                    });
                    dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_GOODS_MENUS_SUCCESS});
                    dispatch({
                        type: WEIXIN_PAY.SAVE_GROUP_BUYING_GOODS_LIST,
                        payload: {goods: list, leaderFavorable: leaderFavorable}
                    });
                }
            }, (res)=> {
                dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_GOODS_MENUS_FAIL});
            });

        };
    }

    /**
     * 根据电话号码，查询用户列表
     * @param phone
     * @param callBack
     */
    getUserListByPhone(phone, callBack) {
        let params = {
            type: 'S',
            loginName: phone
        };
        this.commonService.commonPostSpecial(this.serverInterface.GET_USER_LIST_BY_PHONE, params).then((data)=> {
            if (data.code === 200) {
                callBack(data.list);
                return;
            }
            callBack([]);
        }, (res)=> {
            callBack([]);
        });
    }

    /**
     * 团购下单
     * @param totalFee 总价
     * @param goods 就是团购的商品，对象数组
     * @param thirdPay 第三方支付，目前只有微信支付：wechat
     * @param payType 支付方式 "app"：跳转第三方直接支付，"scan"：扫码支付
     */
    // @actionCreator
    createGroupBuyingOrder(totalFee, goods, thirdPay, payType) {
        let me = this;
        return (dispatch)=> {
            var defer = me.$q.defer();
            dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_CREATE_ORDER_START});
            me.commonService.commonPost(me.serverInterface.GET_GROUP_BUYING_ORDER, {
                totalFee: totalFee,
                goods: JSON.stringify(goods),
                thirdPayCode: thirdPay,
                type: payType
            }).then(data=> {
                if (data.code == 200) {
                    dispatch({
                        type: WEIXIN_PAY.FETCH_GROUP_BUYING_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, goods: goods}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data=> {
                dispatch({type: WEIXIN_PAY.FETCH_GROUP_BUYING_CREATE_ORDER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    // @actionCreator
    selectGroupBuyingOrder(goods, callBack) {
        callBack = callBack || angular.noop;
        return (dispatch)=> {
            dispatch({type: WEIXIN_PAY.SAVE_GROUP_BUYING_GOODS, payload: goods});
            callBack();
        };
    }

    /**
     * 查询训练营订单
     * @param orderType
     * @returns {function(*, *)}
     */
    // @actionCreator
    xlyQueryOrder(orderType) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            let param = {};
            let orderInfo = getState().wxpay_created_order_info[orderType];
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }
            param.orderNo = orderInfo.orderNo;

            dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_START});
            me.commonService.commonPost(me.serverInterface.WXPAY_XLY_ORDER_QUERY, param).then((data)=> {
                if (data.code == 200) {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_SUCCESS});
                    dispatch({
                        type: WEIXIN_PAY.CHANGE_WEI_XIN_PAY_ORDER_STATUS,
                        payload: {orderType: orderType, status: data.status}
                    });
                    if (data.status == 0) {//加入了训练营
                        dispatch({type: PROFILE.USER_IS_VIP_XLY, payload: {xly: true}});
                    }


                    let mlcg, mathematicalOlympiad, diagnose;
                    if (data.vips) {
                        data.vips.forEach((item)=> {
                            if (item.hasOwnProperty('mlcg')) {
                                mlcg = item.mlcg;
                            }
                            if (item.hasOwnProperty('diagnose')) {
                                diagnose = item.diagnose;
                            }
                            if (item.hasOwnProperty('mathematicalOlympiad')) {
                                mathematicalOlympiad = item.mathematicalOlympiad;
                            }
                        });
                    }

                    //修改游戏包开通情况
                    if (mlcg) {
                        // dispatch({type: GAME_GOODS_PAY.UPDATE_GAME_VIP, data: mlcg});
                        dispatch({type: "UPDATE_GAME_VIP", data: mlcg});
                    }
                    //修改诊断天数情况
                    if (diagnose) {
                        dispatch({type: PROFILE.USER_IS_VIP_DIAGNOSE, data: diagnose});
                    }
                    //修改奥数开通情况
                    if (mathematicalOlympiad) {
                        dispatch({type: PROFILE.USER_IS_VIP_MATH_OLY, data: mathematicalOlympiad});
                    }

                    defer.resolve(data);
                } else {
                    dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data=> {
                dispatch({type: WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        }
    }

    /**
     * 校验训练营邀请账号是否可用
     * @param recommendTel
     * @returns {*}
     */
    verifyTheInvitees(recommendTel) {
        let defer = this.$q.defer(), param = {};
        if (recommendTel) {
            param.recommendTel = recommendTel;
        }

        this.commonService.commonPost(this.serverInterface.YEAR_CARD_VERIFY_THE_INVITEES, param)
            .then((res)=> {
                if (res.code == 200) {
                    defer.resolve(res);
                } else {
                    defer.resolve(false);
                }
            }, (data)=> {
                defer.reject(data);
            });
        return defer.promise;
    }

    /**
     *获取训练营商品
     */
    // @actionCreator
    fetchCampGoods() {
        let me = this;
        return (dispatch, getState)=> {
            var defer = me.$q.defer();
            let url = me.serverInterface.GET_XLY_GOODS, params = {category: 'XN-XLY'};
            dispatch({type: DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseGoodsMenusRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST_FAIL});
                    return;
                }
                if (data.code === 200) {
                    /*let list = [];
                     angular.forEach(data.goods, (item)=> {
                     item.desc = JSON.parse(item.desc);
                     list.push(item);
                     });
                     dispatch({type: DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST_SUCCESS});
                     dispatch({
                     type: DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST,
                     payload: {list:list}
                     });*/
                    dispatch({type: DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST_SUCCESS});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 获取学霸训练营数据
     * @returns {function(*)}
     */
    // @actionCreator
    getTrainingCampInfo() {
        let me = this;
        return (dispatch) => {
            var defer = me.$q.defer();
            dispatch({type: SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_START});
            let postInfo = me.commonService.commonPost(me.serverInterface.GET_TRAINING_CAMP_INFO, null, true);
            me.cancelTrainingCampRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then(data => {
                if (data.code == 200) {
                    let rtnData = this.parseTrainData(data.base);
                    dispatch({type: SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_SUCCESS, payload: rtnData});
                    defer.resolve(data);
                } else {
                    dispatch({type: SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_FAIL});
                defer.resolve(data);
            });

            return defer.promise;
        };
    }

    parseTrainData(trainData) {
        if (!trainData) return {};
        if (!trainData.invitation) {
            trainData.invitation = [];
        }

        let newArr = [];
        angular.forEach(trainData.invitation, (stu) => {
            let obj = {};
            angular.forEach(stu, (v, k) => {
                let temp = k.substr(3, 4);
                let name = k.replace(temp, "****");
                obj.name = v;
                obj.loginName = name;
            });
            newArr.push(obj);
        });
        trainData.invitation = newArr;
        let tempTime = this.getTrainTime(trainData.joinTime);
        trainData = lodash_assign(trainData, tempTime);

        return trainData;
    }

    getTrainTime(joinTime) {
        let obj = {};
        /*    let newDate = new Date(joinTime);
         newDate.setTime(joinTime);
         let year = newDate.getFullYear();
         let month = newDate.getMonth() + 1;
         let day = newDate.getDate();
         let startTime = year + "-" + month + "-" + day;
         let endTime = (year + 3) + "-" + month + "-" + day;
         obj.joinTime = startTime;
         obj.endTime = endTime;*/

        let date = joinTime.split(" ")[0];
        let dateArr = date.split('-');
        dateArr[0] = parseInt(dateArr[0]) + 3;
        obj.joinTime = date;
        obj.endTime = dateArr.join('-');
        return obj;
    }


    /**
     * 获取奖励
     * @param rewardType 奖励类型 1----领取邀请两个人的奖励   2----时间满三年的奖励
     * @returns {function(*, *)}
     */
    // @actionCreator
    getTrainCampReward(rewardType) {
        let me = this;
        return (dispatch, getState) => {
            let defer = me.$q.defer();

            let trainData = getState().smart_training_camp_info;
            dispatch({type: SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_REWARD_START});
            let param = {
                rewardType: rewardType
            };

            let postInfo = me.commonService.commonPost(me.serverInterface.GET_TRAINING_CAMP_REWARD, param, true);
            me.cancelTrainingCampRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then(data => {
                if (data.code == 200) {
                    dispatch({type: SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_REWARD_SUCCESS,});

                    if (data.success) {
                        let rtnData = me.changeData(trainData, rewardType);
                        dispatch({type: SMART_TRAINING_CAMP.CHANGE_SMART_TRAINING_CAMP_INFO, payload: rtnData});
                    }
                    defer.resolve(data);
                } else {
                    dispatch({type: SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_REWARD_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_REWARD_FAIL});
                defer.resolve(data);
            });

            return defer.promise;
        };
    }


    changeData(stateData, type) {
        if (type == this.rewardType.STUDY) {
            stateData.studyReward = true;
        } else if (type == this.rewardType.IMPROVE) {
            stateData.progressReward = true;
        }
        return stateData;
    }

    getXlyAllGoodsInfo() {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.FETCH_XLY_GOODS_INFO).then(data=> {
            if (data.code === 200) {
                defer.resolve(data);
            } else {
                defer.resolve(false);
            }
        }, data=> {
            defer.resolve(false);
        }, ()=> {
            defer.reject();
        });
        return defer.promise;
    }

    /**
     * 获取诊断提分的商品列表
     */
    // @actionCreator
    fetchIncreaseScoreGoodsMenus(selectedGrade) {
        let me = this;
        return (dispatch, getState)=> {
            let url = me.serverInterface.GET_GOODS_MENUS, params = {category: 'XN-TF'};
            dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_START});
            let postInfo = me.commonService.commonPost(url, params, true);
            me.cancelDiagnoseGoodsMenusRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data)=> {
                if (data.code != 200) {
                    dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_FAIL});
                    return;
                }
                if (data.code === 200) {
                    let list = [], pre = [];
                    if (!selectedGrade) {
                        selectedGrade = getState().diagnose_selected_grade || getState().diagnose_selected_grade.num || 1;
                    }
                    //返回的商品列表，服务器排序是根据id位数排序，id位数与年级数对应
                    //处理数据，将第一关商品（20个考点）和当前学期及后一个学期的商品排前面
                    data.goods.forEach((item)=> {
                        item.desc = JSON.parse(item.desc);
                        item.selected = false;
                        let itemGrade = +item.desc.grade;
                        item.desc.fee = Number(item.totalFee / 100).toFixed();
                        if (itemGrade >= selectedGrade || itemGrade == 0) {
                            pre.push(item)
                        } else {
                            list.push(item);
                        }
                    });
                    pre.sort((item1, item2)=> {
                        return item1.desc.grade - item2.desc.grade
                    });
                    list.splice(0, 0, ...pre);
                    dispatch({
                        type: DIAGNOSE.FETCH_INCREASE_SCORE_GOODS_MENUS_SUCCESS,
                        payload: list
                    });
                }
            }, (res)=> {
                dispatch({type: DIAGNOSE.FETCH_GOODS_MENUS_FAIL});
            });

        };
    }

    // @actionCreator
    paySuccessModifyVips() {
        let defer = this.$q.defer();
        return (dispatch, getState)=>{
            this.commonService.commonPost(this.serverInterface.GET_ALL_VIPS_INFO).then((data)=>{
                if(data.code == 200)dispatch({type: PROFILE.MODIFY_VIPS_INFO, data: data.vips});
                defer.resolve(data);
            });
            return defer.promise;
        }
    }
}

export default WxPayService;



