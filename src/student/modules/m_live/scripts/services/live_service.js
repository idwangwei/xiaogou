/**
 * Created by qiyuexi on 2018/4/26.
 */
import {Service, actionCreator,Inject} from '../module';
import * as LIVE_TYPE from './../redux/action_types';
@Service('liveService')
@Inject('$q', '$rootScope', 'commonService', 'liveInterface', '$ngRedux', '$state')
class LiveService {
    liveInterface;
    constructor() {
        this.cancelRequestList = [];
    }
    /**
     * 选择的公开课
     */
    @actionCreator
    selectCourse(param) {
        return (dispatch, getState)=> {
            dispatch({type: LIVE_TYPE.SELECT_COURSE, payload: param});
        }
    }
    /**
     * 选择当前展示在顶部的课程
     */
    @actionCreator
    selectMyCourse(param) {
        return (dispatch, getState)=> {
            dispatch({type: LIVE_TYPE.SELECT_MY_COURSE, payload: param});
        }
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
     * 获取公开课列表
     */
    fetchCourseList(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.liveInterface.GET_COURSE_LIST, param, true);
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
     * 发送短信
     */
    sendMsgCode(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.liveInterface.SEND_MSG, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data);
            }
            else {
                defer.reject(false);
            }
        }, ()=> {
            request = null;
            defer.reject();
        });
        return defer.promise;
    };
    /**
     * 验证短信
     */
    verifyMsgCode(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.liveInterface.VERIFY_MSG, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            defer.resolve(data);
        }, ()=> {
            request = null;
            defer.reject();
        });
        return defer.promise;
    };

    /**
     * 获取课程详情信息
     */
    getCourseDetail(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.liveInterface.GET_COURSE_DETAIL, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data.result);
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
     * 获取试卷的所有状态
     * 传入list
     */
    /**
     * 获取课程详情信息
     */
    fetchPaperStatusList(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.liveInterface.GET_PAPER_STATUS_LIST, param, true);
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
            dispatch({type: LIVE_TYPE.LIVE_GOODS.LIVE_GOODS_CREATE_ORDER_START});
            me.commonService.commonPost(me.liveInterface.CREATE_LIVE_GOODS_ORDER, {
                goodsId: productId,
                thirdPayCode: thirdPay,
                type: payType
            }).then(data => {
                if (data.code == 200) {
                    dispatch({
                        type: LIVE_TYPE.LIVE_GOODS.LIVE_GOODS_CREATE_ORDER_SUCCESS,
                        payload: {orderType: payType, orderNo: data.orderNo, order: data.order, productId: productId}
                    });
                    defer.resolve(data);
                } else {
                    dispatch({type: LIVE_TYPE.LIVE_GOODS.LIVE_GOODS_CREATE_ORDER_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: LIVE_TYPE.LIVE_GOODS.LIVE_GOODS_CREATE_ORDER_FAIL});
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
            let orderInfo = getState().live_goods_created_order_info[orderType];
            // let vipsIndexs = getState().select_sprint_goods.finalSprintVips||[];
            if (!orderInfo || (orderInfo && !orderInfo.orderNo)) {
                defer.resolve(false);
                return defer.promise;
            }

            me.commonService.commonPost(me.liveInterface.LIVE_GOODS_ORDER_QUERY, {
                orderNo: orderInfo.orderNo
            }).then((data) => {
                if (data.code == 200) {
                    if (data.status == 0) {

                    }

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

    /*获取付费课程套课列表和价格*/
    fetchCourseLessons(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.liveInterface.GET_COURSE_LESSONS, param, true);
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

    /*获取观看直播的access——token*/
    fetchAccessToken(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.liveInterface.GET_ACCESS_TOKEN, param, true);
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

    /*获取观看点播的url*/
    fetchVideoUrl(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.liveInterface.GET_VIDEO_URL, param, true);
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

    /*设置观看视频的flag*/
    @actionCreator
    setWatchVideoFlag(data){
        return (dispatch) => {
            dispatch({type: LIVE_TYPE.SET_WATCH_VIDEO_FLAG, payload: data});
        };
    }
    /*设置默认课程的标识的flag*/
    @actionCreator
    setCurrentCourseFlag(data){
        return (dispatch) => {
            dispatch({type: LIVE_TYPE.SET_CURRENT_COURSE_FLAG, payload: data});
        };
    }
}

export default LiveService;