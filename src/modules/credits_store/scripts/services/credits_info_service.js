/**
 * Author qiyuexi on 2017/11/08.
 * @description  统计service
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import * as CREDITS_TASK from './../redux/action_types';
@Inject('$q', '$rootScope', 'commonService', 'creditsStoreInterface', '$ngRedux')

class CreditsInfoService {
    constructor(){
        this.cancelRequestList=[];
    }
    /**
     * 获取积分列表
     */
    fetchTeaScoreList(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.creditsStoreInterface.GET_TEACHER_SCORE_LIST, param, true);
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

    @actionCreator
    fetchTeaScoreDetail(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: CREDITS_TASK.CREDITS_DETAIL.FETCH_CREDITS_DETAIL_START});
            let post = this.commonService.commonPost(this.creditsStoreInterface.GET_TEACHER_SCORE_DETAIL, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.credits;
                    dispatch({type: CREDITS_TASK.CREDITS_DETAIL.FETCH_CREDITS_DETAIL_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: CREDITS_TASK.CREDITS_DETAIL.FETCH_CREDITS_DETAIL_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: CREDITS_TASK.CREDITS_DETAIL.FETCH_CREDITS_DETAIL_FAIL});
                request = null;
                defer.reject();
            });
            return defer.promise;
        }
    }
    @actionCreator
    setTeaScoreDetail(param){
        return (dispatch, getState)=> {
            dispatch({type: CREDITS_TASK.CREDITS_DETAIL.FETCH_CREDITS_DETAIL_SUCCESS, payload: param});
        }
    }
}

export default CreditsInfoService;
