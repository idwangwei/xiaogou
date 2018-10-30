/**
 * Created by qiyuexi on 2018/2/2.
 */
/**
 * Created by qiyuexi on 2017/12/8.
 */
import {Service, actionCreator,Inject} from '../module';
import {BARGAIN} from './../redux/actiontypes/actiontypes';
@Service('bargainService')
@Inject('$q', '$rootScope', 'commonService', 'serverInterface', '$ngRedux', '$state')
class BargainService {
    serverInterface;
    commonService
    constructor() {
        this.cancelRequestList = [];
    }

    /**
     * 获取砍价的详情
     */
    @actionCreator
    fetchBargainDetail(param) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: BARGAIN.FETCH_BARGAIN_DETAIL_START});
            let post = this.commonService.commonPost(this.serverInterface.BARGAIN_GET_DETAIL, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data;
                    dispatch({type: BARGAIN.FETCH_BARGAIN_DETAIL_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type:BARGAIN.FETCH_BARGAIN_DETAIL_FAIL});
                    defer.resolve();
                }
            }, ()=> {
                dispatch({type: BARGAIN.FETCH_BARGAIN_DETAIL_FAIL});
                request = null;
                defer.resolve();
            });
            return defer.promise;
        }
    };

    /**
     * 获取砍价状态
     */
    fetchBargainStatus(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.serverInterface.BARGAIN_GET_STATUS, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data.result);
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
     * 创建砍价任务
     */
    createBargainTask(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.serverInterface.BARGAIN_CREATE, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data.result);
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

}

export default BargainService;