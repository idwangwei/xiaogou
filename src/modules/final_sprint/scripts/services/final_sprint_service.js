/**
 * Created by qiyuexi on 2017/12/8.
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import * as FINAL_SPRINT from './../redux/action_types';
@Inject('$q', '$rootScope', 'commonService', 'finalSprintInterface', '$ngRedux')

class FinalSprintService {
    finalSprintInterface;
    orderType = {
        WX_APP: "app",
        WX_SCAN: "scan",
    };
    constructor() {
        this.cancelRequestList = [];
    }


    /**
     * 获取所有周的所有试卷信息
     */
    @actionCreator
    fetchPaperList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: FINAL_SPRINT.PAPER_LIST.FETCH_PAPER_LIST_START});
            let post = this.commonService.commonPost(this.finalSprintInterface.GET_PAPER_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data;
                    dispatch({type: FINAL_SPRINT.PAPER_LIST.FETCH_PAPER_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: FINAL_SPRINT.PAPER_LIST.FETCH_PAPER_LIST_FAIL});
                    defer.resolve();
                }
            }, ()=> {
                dispatch({type: FINAL_SPRINT.PAPER_LIST.FETCH_PAPER_LIST_FAIL});
                request = null;
                defer.resolve();
            });
            return defer.promise;
        }
    }
    /**
     * 获取试卷的所有状态
     * 传入list
     */
    @actionCreator
    fetchPaperStatusList(param) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: FINAL_SPRINT.STATUS_LIST.FETCH_STATUS_LIST_START});
            let post = this.commonService.commonPost(this.finalSprintInterface.GET_PAPER_STATUS_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.status;
                    dispatch({type: FINAL_SPRINT.STATUS_LIST.FETCH_STATUS_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: FINAL_SPRINT.STATUS_LIST.FETCH_STATUS_LIST_FAIL});
                    defer.resolve();
                }
            }, ()=> {
                dispatch({type: FINAL_SPRINT.STATUS_LIST.FETCH_STATUS_LIST_FAIL});
                request = null;
                defer.resolve();
            });
            return defer.promise;
        }
    };

    /**
     * 开启周的相关信息
     */
    @actionCreator
    fetchSprintInfo(param) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: FINAL_SPRINT.SPRINT_INFO.FETCH_SPRINT_INFO_START});
            let post = this.commonService.commonPost(this.finalSprintInterface.GET_SPRINT_INFO, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.permission;
                    dispatch({type: FINAL_SPRINT.SPRINT_INFO.FETCH_SPRINT_INFO_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: FINAL_SPRINT.SPRINT_INFO.FETCH_SPRINT_INFO_FAIL});
                    defer.resolve();
                }
            }, ()=> {
                dispatch({type: FINAL_SPRINT.SPRINT_INFO.FETCH_SPRINT_INFO_FAIL});
                request = null;
                defer.resolve();
            });
            return defer.promise;
        }
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.finalSprintInterface.GET_SPRINT_INFO, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data.permission);
            }
            else {
                defer.resolve(false);
            }
        }, ()=> {
            request = null;
            defer.reject();
        });
        return defer.promise;
    };

    /**
     * 设置选择了那一周
     */
    @actionCreator
    selectPaper(param) {
        return (dispatch, getState)=> {
            dispatch({type: FINAL_SPRINT.PAPER_LIST.SELECT_PAPER_BY_WEEK, payload: param});
        }
    }

    /**
     * 设置第一次登录为false
     */
    @actionCreator
    setFirstComeInFalse() {
        return (dispatch, getState)=> {
            dispatch({type: FINAL_SPRINT.FIRST_COME_IN, payload: false});
        }
    }

    /**
     * 获取分数相关数据
     */
    fetchScoreInfo(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.finalSprintInterface.GET_SCORE_INFO, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data);
            }
            else {
                defer.resolve(false);
            }
        }, ()=> {
            request = null;
            defer.reject();
        });
        return defer.promise;
    };

    /**
     * 获取知识点相关信息
     */
    fetchKnowledgeInfo(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.finalSprintInterface.GET_KNOWLEDGE_INFO, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data.knowledgeUnit);
            }
            else {
                defer.resolve(false);
            }
        }, ()=> {
            request = null;
            defer.reject();
        });
        return defer.promise;
    };

    //GET_FINAL_SPRINT_GOODS_LIST
    /***
     *
     */
    @actionCreator
    fetchFinalSprintGoods() {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.FETCH_SPRINT_GOODS_LIST_START});
            this.commonService.commonPostSpecial(this.finalSprintInterface.GET_FINAL_SPRINT_GOODS_LIST, {category: 'XN-FS'})
                .then((data)=> {
                    if (data && data.code == 200 && data.goods) {
                        let goodsList = [];
                        angular.forEach(data.goods, (v, k)=> {
                            goodsList[k] = {};
                            let desc = JSON.parse(data.goods[k].desc);
                            let descArr = desc.goodsDesc.split(/\n/) || [];
                            goodsList[k].id = data.goods[k].id;
                            goodsList[k].totalFee = data.goods[k].totalFee;
                            goodsList[k].fee = Math.floor(Number(data.goods[k].totalFee)/100);
                            goodsList[k].goodsDesc = descArr.slice(0);
                            goodsList[k].title = desc.title;
                        });
                        dispatch({
                            type: FINAL_SPRINT.FINAL_SPRINT_GOODS.FETCH_SPRINT_GOODS_LIST_SUCCESS,
                            payload: goodsList
                        });
                    } else {
                        dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.FETCH_SPRINT_GOODS_LIST_FAIL});
                    }
                    defer.resolve(true);
                }, ()=> {
                    defer.reject(false);
                    dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.FETCH_SPRINT_GOODS_LIST_FAIL});
                });
            return defer.promise;
        }
    }




    /**
     * 选中的商品信息
     * @param goodsInfo
     * @returns {function(*)}
     */
    @actionCreator
    selectSprintGoods(goodsInfo) {
        return (dispatch) => {
            dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SELECT_SPRINT_GOODS, payload: goodsInfo});
        };
    }
    /**
     * 設置sharding_clazz
     */
    @actionCreator
    setSharingInfo(data) {
        return (dispatch) => {
            dispatch({type: "WORK_LIST_CHANGE_CLAZZ", payload: data});
        };
    }
    /**
     * 設置diagnose_selected_clazz
     */
    @actionCreator
    setDiagnoseSelectedClazz(data) {
        return (dispatch) => {
            dispatch({type: "DIAGNOSE_CHANGE_CLAZZ", payload: data});
        };
    }
    /**
     * 清空wl_clazz_list_with_works
     */
    @actionCreator
    setWorkList(data) {
        return (dispatch) => {
            dispatch({
                type: "FETCH_WORK_LIST_SUCCESS",
                payload: data
            });
        };
    }
    /**
     * 创建订单
     * @param productId 商品id
     * @param thirdPay 第三方支付，目前只有微信支付：wechat
     * @param payType 支付方式 "app"：跳转第三方直接支付，"scan"：扫码支付
     * @returns {*}
     */
    @actionCreator
    createOrder(productId, thirdPay, payType) {
        let me = this;
        return (dispatch) => {
            var defer = me.$q.defer();
            dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SPRINT_GOODS_CREATE_ORDER_START});
            me.commonService.commonPost(me.finalSprintInterface.CREATE_SPRINT_GOODS_ORDER, {
                goodsId: productId,
                thirdPayCode: thirdPay,
                type: payType
            }).then(data => {
                if (data.code == 200) {
                    dispatch({
                        type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SPRINT_GOODS_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, productId: productId}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SPRINT_GOODS_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SPRINT_GOODS_CREATE_ORDER_FAIL});
                defer.reject(data);
            });
            return defer.promise;
        };
    }

    /**
     * 查询订单状态
     * @param orderType 支付方式
     * @returns {*}
     */
    @actionCreator
    queryOrder(orderType) {
        let me = this;
        return (dispatch, getState) => {
            let defer = me.$q.defer();
            let orderInfo = getState().sprint_goods_created_order_info[orderType];
            let vipsIndexs = getState().select_sprint_goods.finalSprintVips||[];
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }

            dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SPRINT_GOODS_QUERY_ORDER_INFO_START});
            me.commonService.commonPost(me.finalSprintInterface.SPRINT_GOODS_ORDER_QUERY, {
                orderNo: orderInfo.orderNo
            }).then((data) => {
                if (data.code == 200) {
                    dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SPRINT_GOODS_QUERY_ORDER_INFO_SUCCESS});
                    dispatch({
                        type: FINAL_SPRINT.FINAL_SPRINT_GOODS.CHANGE_SPRINT_GOODS_CREATE_ORDER_STATUS,
                        payload: {orderType: orderType, status: data.status}
                    });
                    if (data.status == 0) {
                        dispatch({
                            type: 'USER_IS_VIP_FINAL_SPRINT',
                            payload: {finalSprint:vipsIndexs}
                        });
                    }

                    defer.resolve(data);
                } else {
                    dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SPRINT_GOODS_QUERY_ORDER_INFO_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.SPRINT_GOODS_QUERY_ORDER_INFO_FAIL});
                defer.reject(data);
            });
            return defer.promise;
        }
    }

}

export default FinalSprintService;