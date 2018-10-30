/**
 * Created by qiyuexi on 2017/12/20.
 */
import {Inject, actionCreator,Service} from '../module';
import * as MICRO_TASK from './../redux/action_types';
@Service('microUnitService')
@Inject('$q', '$rootScope', 'commonService', 'olympicMathMicrolectureInterface', '$ngRedux')

class MicroUnitService {
    constructor(){
        this.cancelRequestList=[];
    }
    /*获取年级列表*/
    @actionCreator
    fetchMicroGradeList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: MICRO_TASK.MICRO_GRADE_LIST.FETCH_MICRO_GRADE_LIST_START});
            let post = this.commonService.commonPost(this.olympicMathMicrolectureInterface.GET_GRADE_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.result;
                    dispatch({type: MICRO_TASK.MICRO_GRADE_LIST.FETCH_MICRO_GRADE_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: MICRO_TASK.MICRO_GRADE_LIST.FETCH_MICRO_GRADE_LIST_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: MICRO_TASK.MICRO_GRADE_LIST.FETCH_MICRO_GRADE_LIST_FAIL});
                request = null;
                defer.resolve(false);
            });
            return defer.promise;
        }
    }
    /*获取单元列表*/
    @actionCreator
    fetchMicroUnitList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: MICRO_TASK.MICRO_UNIT_LIST.FETCH_MICRO_UNIT_LIST_START});
            let post = this.commonService.commonPost(this.olympicMathMicrolectureInterface.GET_UNIT_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.result;
                    dispatch({type: MICRO_TASK.MICRO_UNIT_LIST.FETCH_MICRO_UNIT_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: MICRO_TASK.MICRO_UNIT_LIST.FETCH_MICRO_UNIT_LIST_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: MICRO_TASK.MICRO_UNIT_LIST.FETCH_MICRO_UNIT_LIST_FAIL});
                request = null;
                defer.resolve(false);
            });
            return defer.promise;
        }
    }
    /*存储选择的年级*/
    @actionCreator
    selectMicroUnitGrade(param){
        return (dispatch, getState)=> {
            dispatch({type: MICRO_TASK.MICRO_GRADE_LIST.SAVE_SELECT_MICRO_UNIT_GRADE, payload: param});
        }
    }
    /*存储选择的单元*/
    @actionCreator
    selectMicroUnitItem(param){
        return (dispatch, getState)=> {
            dispatch({type: MICRO_TASK.MICRO_UNIT_LIST.SAVE_SELECT_MICRO_UNIT_ITEM, payload: param});
        }
    }
    /*获取例子列表*/
    @actionCreator
    fetchMicroExampleList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: MICRO_TASK.MICRO_EXAMPLE_LIST.FETCH_MICRO_EXAMPLE_LIST_START});
            let post = this.commonService.commonPost(this.olympicMathMicrolectureInterface.GET_EXAMPLE_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.result;
                    tasks.forEach((v,k)=>{
                      let num=v.starNumber;
                      let arr=[]
                      for(var i=1;i<=5;i++){
                        if(num>=i){
                          arr[i-1]="full"
                        }else if(num<i){
                          if(i-num==0.5){
                            arr[i-1]="half"
                          }else{
                            arr[i-1]="empty"
                          }
                        }
                      }
                      v.starArr=arr.slice();
                    })
                    dispatch({type: MICRO_TASK.MICRO_EXAMPLE_LIST.FETCH_MICRO_EXAMPLE_LIST_SUCCESS, payload: tasks});
                    defer.resolve(data);
                }
                else {
                    dispatch({type: MICRO_TASK.MICRO_EXAMPLE_LIST.FETCH_MICRO_EXAMPLE_LIST_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: MICRO_TASK.MICRO_EXAMPLE_LIST.FETCH_MICRO_EXAMPLE_LIST_FAIL});
                request = null;
                defer.resolve(false);
            });
            return defer.promise;
        }
    }
    /*存储选择的例子*/
    @actionCreator
    selectMicroExampleItem(param){
        return (dispatch, getState)=> {
            dispatch({type: MICRO_TASK.MICRO_EXAMPLE_LIST.SAVE_SELECT_MICRO_EXAMPLE_ITEM, payload: param});
        }
    }
    /*存储支付列表返回按钮的url*/
    @actionCreator
    savePayBackUrl(param){
        return (dispatch, getState)=> {
            dispatch({type: MICRO_TASK.MICRO_VIP_LIST.SAVE_MICRO_PAY_BACK_URL, payload: param});
        }
    }
    /*获取例子详情*/
    @actionCreator
    fetchMicroExampleDetail(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: MICRO_TASK.MICRO_EXAMPLE_DETAIL.FETCH_MICRO_EXAMPLE_DETAIL_START});
            let post = this.commonService.commonPost(this.olympicMathMicrolectureInterface.GET_EXAMPLE_DETAIL, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.result;
                    dispatch({type: MICRO_TASK.MICRO_EXAMPLE_DETAIL.FETCH_MICRO_EXAMPLE_DETAIL_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: MICRO_TASK.MICRO_EXAMPLE_DETAIL.FETCH_MICRO_EXAMPLE_DETAIL_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: MICRO_TASK.MICRO_EXAMPLE_DETAIL.FETCH_MICRO_EXAMPLE_DETAIL_FAIL});
                request = null;
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /*领取能量*/
    acceptAward(param){
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.olympicMathMicrolectureInterface.ACCEPT_AWARD, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve();
            }
            else {
                defer.reject(false);
            }
        }, ()=> {
            request = null;
            defer.reject(false);
        });
        return defer.promise;
    }
    /*设置做题标记*/
    @actionCreator
    setDoQuestionMark(param){
        return (dispatch, getState)=> {
            dispatch({type: MICRO_TASK.MICRO_DO_QUESTION_MARK, payload: param});
        }
    }
}

export default MicroUnitService;