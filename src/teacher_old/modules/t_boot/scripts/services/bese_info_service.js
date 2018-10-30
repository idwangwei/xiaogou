/**
 * Created by 邓小龙 on 2015/7/31.
 * @description 基本信息维护的service
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {
    SET_TEACHER_BASE_INFO
    , CHANGE_TEACHER_RELEVANCE_CELLPHONE
    , MODIFY_TEACHER_BASE_INFO_START
    , MODIFY_TEACHER_BASE_INFO_SUCCESS
    , MODIFY_TEACHER_BASE_INFO_FAIL
    , CHANGE_TEACHER_RELEVANCE_CELLPHONE_START
    , CHANGE_TEACHER_RELEVANCE_CELLPHONE_SUCCESS
    , CHANGE_TEACHER_RELEVANCE_CELLPHONE_FAIL
    , FETCH_SECURITY_QUESTION_LIST_START
    , FETCH_SECURITY_QUESTION_LIST_SUCCESS
    , FETCH_SECURITY_QUESTION_LIST_FAIL
    , SET_SECURITY_ANSWER_START
    , SET_SECURITY_ANSWER_SUCCESS
    , SET_SECURITY_ANSWER_FAIL,

} from './../redux/action_typs';

@Inject('$q', '$http', 'serverInterface', 'commonService', '$ngRedux')
class baseInfoService {
    serverInterface;
    commonService;

    /**
     * 保存基本信息
     * @param realName 真实姓名
     * @param gender   性别
     * @returns promise
     */
    @actionCreator
    saveBaseInfo(realName, gender) {
        return (dispatch)=> {
            var param = {
                name: realName,
                gender: gender
            };
            let defer = this.$q.defer();
            dispatch({type: MODIFY_TEACHER_BASE_INFO_START});
            this.commonService.commonPost(this.serverInterface.SAVE_BASE_INFO, param).then((data)=> {
                if (data && data.code == 200) {
                    dispatch({type: SET_TEACHER_BASE_INFO, payload: param});
                    dispatch({type: MODIFY_TEACHER_BASE_INFO_SUCCESS});
                    defer.resolve(data);
                } else {
                    dispatch({type: MODIFY_TEACHER_BASE_INFO_FAIL});
                    defer.reject(data);
                }
            });
            return defer.promise;
        }
    }


    /**
     * 获取基本信息
     */
    getBaseInfo() {
        return this.commonService.commonPost(this.serverInterface.GET_BASE_INFO);
    }

    /**
     * 获取密保信息
     */
    @actionCreator
    getPwProQuestion(param) {
        return (dispatch) => {
            let defer = this.$q.defer();
            dispatch({type: FETCH_SECURITY_QUESTION_LIST_START});
            this.commonService.commonPost(this.serverInterface.GET_PW_PRO_QUESTION, param).then(function (data) {
                if (data /*&& data.code == 200*/) { //该接口返回的data为一个数组，没有code值
                    dispatch({type: FETCH_SECURITY_QUESTION_LIST_SUCCESS});
                    defer.resolve(data);
                } else {
                    dispatch({type: FETCH_SECURITY_QUESTION_LIST_FAIL});
                    defer.reject(data);
                }

            });
            return defer.promise;
        }
    }

    /**
     * 保存密保答案
     * @param param
     */
    @actionCreator
    savePwProQuestion(param) {
        return (dispatch)=> {
            dispatch({type: SET_SECURITY_ANSWER_START});

            this.commonService.commonPost(this.serverInterface.SAVE_PW_PRO_QUESTION, param).then((data)=>{
                if (data && data.code == 200) {
                    dispatch({type: SET_SECURITY_ANSWER_SUCCESS});
                    this.commonService.alertDialog("密保设置保存成功!");
                } else {
                    dispatch({type: SET_SECURITY_ANSWER_FAIL});
                }
            });
        }
    }

    /**
     * 验证密保信息
     * @param param
     */
    checkPwProQuestion(param) {
        return this.commonService.commonPost(this.serverInterface.CHECK_PW_PRO_QUESTION, param);
    }

    /**
     * 保存关联手机号
     * @param param
     */
    @actionCreator
    resetTelephone(param) {
        return (dispatch)=> {
            dispatch({type: CHANGE_TEACHER_RELEVANCE_CELLPHONE_START});
            this.commonService.commonPost(this.serverInterface.RESET_TELEPHONE, param).then((data) => {
                if (data && data.code == 200) {
                    dispatch({type: CHANGE_TEACHER_RELEVANCE_CELLPHONE_SUCCESS});
                    dispatch({type: CHANGE_TEACHER_RELEVANCE_CELLPHONE,payload: param });
                    this.commonService.alertDialog("更换关联手机成功!");
                } else {
                    dispatch({type: CHANGE_TEACHER_RELEVANCE_CELLPHONE_FAIL});
                    this.commonService.alertDialog(data.msg);
                }
            });
        }
    }
}

export default baseInfoService