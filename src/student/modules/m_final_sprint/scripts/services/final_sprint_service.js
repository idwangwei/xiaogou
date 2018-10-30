/**
 * Created by qiyuexi on 2017/12/8.
 */
import {Service, actionCreator,Inject} from '../module';
import * as FINAL_SPRINT from './../redux/action_types';
@Service('finalSprintService')
@Inject('$q', '$rootScope', 'commonService', 'finalSprintInterface', '$ngRedux', '$state')
class FinalSprintService {
    finalSprintInterface;
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

}

export default FinalSprintService;