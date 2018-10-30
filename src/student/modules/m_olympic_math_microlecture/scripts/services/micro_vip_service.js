/**
 * Created by qiyuexi on 2017/12/27.
 */
import {Inject, actionCreator,Service} from '../module';
import * as MICRO_TASK from './../redux/action_types';
@Service('microVipService')
@Inject('$q', '$rootScope', 'commonService', 'olympicMathMicrolectureInterface', '$ngRedux')

class MicroVipService {
    orderType = {
        WX_APP: "app",
        WX_SCAN: "scan",
    };
    constructor() {
        this.cancelRequestList = [];
    }
    /*获取商品列表*/
    @actionCreator
    fetchMicroVipList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: MICRO_TASK.MICRO_VIP_LIST.FETCH_MICRO_GOODS_LIST_START});
            let post = this.commonService.commonPost(this.olympicMathMicrolectureInterface.GET_VIP_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.goods;
                    dispatch({type: MICRO_TASK.MICRO_VIP_LIST.FETCH_MICRO_GOODS_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: MICRO_TASK.MICRO_VIP_LIST.FETCH_MICRO_GOODS_LIST_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: MICRO_TASK.MICRO_VIP_LIST.FETCH_MICRO_GOODS_LIST_FAIL});
                request = null;
                defer.resolve(false);
            });
            return defer.promise;
        }
    }
    /*利用商品解锁资源*/
    openVipResource(param){
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.olympicMathMicrolectureInterface.VIP_OPEN_RESOURCE, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                let tasks=data.result;
                defer.resolve(tasks);
            }
            else {
                defer.reject(data.msg);
            }
        }, ()=> {
            request = null;
            defer.reject("网络异常，请稍后再试");
        });
        return defer.promise;
    }
    /**
     * 选中的商品信息
     * @param goodsInfo
     * @returns {function(*)}
     */
    @actionCreator
    selectMicroGoods(goodsInfo) {
        return (dispatch) => {
            dispatch({type: MICRO_TASK.MICRO_VIP_LIST.SELECT_MICRO_GOODS, payload: goodsInfo});
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
            dispatch({type: MICRO_TASK.MICRO_VIP_LIST.MICRO_GOODS_CREATE_ORDER_START});
            me.commonService.commonPost(me.olympicMathMicrolectureInterface.CREATE_MICRO_GOODS_ORDER, {
                goodsId: productId,
                thirdPayCode: thirdPay,
                type: payType
            }).then(data => {
                if (data.code == 200) {
                    dispatch({
                        type:MICRO_TASK.MICRO_VIP_LIST.MICRO_GOODS_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, productId: productId}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: MICRO_TASK.MICRO_VIP_LIST.MICRO_GOODS_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: MICRO_TASK.MICRO_VIP_LIST.MICRO_GOODS_CREATE_ORDER_FAIL});
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
            let orderInfo = getState().micro_goods_created_order_info[orderType];
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }
            me.commonService.commonPost(me.olympicMathMicrolectureInterface.MICRO_GOODS_ORDER_QUERY, {
                orderNo: orderInfo.orderNo
            }).then((data) => {
                if (data.code == 200) {
                    dispatch({
                        type: MICRO_TASK.MICRO_VIP_LIST.CHANGE_MICRO_GOODS_CREATE_ORDER_STATUS,
                        payload: {orderType: orderType, status: data.status}
                    });
                    /*if (data.status == 0) {
                        dispatch({
                            type: 'USER_IS_VIP_FINAL_SPRINT',
                            payload: {finalSprint:vipsIndexs}
                        });
                    }*/
                    defer.resolve(data);
                } else {
                    defer.resolve(data);
                }
            }, data => {
                defer.reject(data);
            });
            return defer.promise;
        }
    }
}
export default MicroVipService