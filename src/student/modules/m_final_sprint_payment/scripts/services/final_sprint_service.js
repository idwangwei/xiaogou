/**
 * Created by qiyuexi on 2017/12/8.
 */
import {Service, actionCreator,Inject} from '../module';
import * as FINAL_SPRINT from './../redux/action_types';
@Service('finalSprintPaymentService')
@Inject('$q', '$rootScope', 'commonService', 'finalSprintPaymentInterface', '$ngRedux')
class FinalSprintPaymentService {
    finalSprintPaymentInterface;
    orderType = {
        WX_APP: "app",
        WX_SCAN: "scan",
    };
    constructor() {
        this.cancelRequestList = [];
    }

    //GET_FINAL_SPRINT_GOODS_LIST
    /***
     *
     */
    @actionCreator
    fetchFinalSprintPaymentGoods() {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: FINAL_SPRINT.FINAL_SPRINT_GOODS.FETCH_SPRINT_GOODS_LIST_START});
            this.commonService.commonPostSpecial(this.finalSprintPaymentInterface.GET_FINAL_SPRINT_GOODS_LIST, {category: 'XN-FS'})
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
                            goodsList[k].maxDis = desc.maxDis;
                            goodsList[k].promoteBeforeMarkPrice = desc.promoteBeforeMarkPrice;
                            goodsList[k].discountPercent = desc.discountPercent;
                            goodsList[k].discountURLImage = desc.discountURLImage;
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
            me.commonService.commonPost(me.finalSprintPaymentInterface.CREATE_SPRINT_GOODS_ORDER, {
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
            me.commonService.commonPost(me.finalSprintPaymentInterface.SPRINT_GOODS_ORDER_QUERY, {
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

export default FinalSprintPaymentService;