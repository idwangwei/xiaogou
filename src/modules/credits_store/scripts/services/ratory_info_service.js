/**
 * Created by qiyuexi on 2017/11/13.
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import * as CREDITS_TASK from './../redux/action_types';
@Inject('$q', '$rootScope', 'commonService', 'creditsStoreInterface', '$ngRedux')

class RatoryInfoService {
    constructor(){
        this.cancelRequestList=[];
    }
    /**
     * 获取奖品信息列表
     */
    @actionCreator
    fetchRatoryList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: CREDITS_TASK.RATORY_INFO.FETCH_RATORY_INFO_START});
            let post = this.commonService.commonPost(this.creditsStoreInterface.GET_RATORY_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.result;
                    dispatch({type: CREDITS_TASK.RATORY_INFO.FETCH_RATORY_INFO_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: CREDITS_TASK.RATORY_INFO.FETCH_RATORY_INFO_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: CREDITS_TASK.RATORY_INFO.FETCH_RATORY_INFO_FAIL});
                request = null;
                defer.reject();
            });
            return defer.promise;
        }
    }

    /**
     * 获取中奖信息
     */
    fetchRatoryInfo(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.creditsStoreInterface.GET_RATORY_INFO, param, true);
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

}

export default RatoryInfoService;