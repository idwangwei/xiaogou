/**
 * Created by WangLu on 2017/1/6.
 */

import services from  '../../../m_boot/scripts/services/index';
import BaseService from 'base_components/base_service';
import {
    GROWING_PUB_MSG,
    GROWING_MYSELF_RECORD,
    GROWING_CLASSMATE_RECORD,
    GROWING_CLASSMATE_LIST,
    GROWING_ONE_CLAZZ
} from '../../../m_boot/scripts/redux/actiontypes/actiontypes';

class GrowingService extends BaseService {

    constructor() {
        super(arguments);
        this.showNameCount = 3;
        this.selectedClazz = "";
        this.uploadContent = "";
        this.actionType = {
            mySelf: 1,
            classmate: 2,
            onClazz: 3,
        };
        this.cancelImpeachRequest = null;
        this.pubMsgCancelRequestList = []; //发布页面的请求
        this.classmateCancelRequestList = [];
        this.recordCancelRequestList = [];
    }


    getHeadImg(imgId, gender) {
      /*  let tempHead = gender == 0 ? this.getRootScope().loadImg('growing/head-girl.png') : this.getRootScope().loadImg('growing/head-boy.png');
        if ((!img && typeof(img)!="undefined" && img!=0) || typeof(img) == "undefined"){ //null
           return tempHead;
        }else if(img == "default"){
            return tempHead;
        }*/
        if(imgId == "default" || (!imgId && typeof(imgId)!="undefined" && imgId!=0) || typeof(imgId) == "undefined"){
            imgId = "1";
        }
        let tempHead = this.getRootScope().loadImg('head_images/user_head' + (+imgId) + '.png');
        return tempHead;
    };

    /**
     * 初始化数据列表
     */
    initRecordList(list, userId) {
        angular.forEach(list, (record, index) => {
            let extendData = {};
            extendData.isPraiseNameUnfold = false; //点赞的学生姓名是否展开
            extendData.isFlowerNameUnfold = false; //点赞的学生姓名是否展开
            extendData.imgSrcArr = [];
            if (record.fileUrl) {
                extendData.imgSrcArr = record.fileUrl.split(","); //图片数组
            }
            extendData.flower = this.getNameList(record.flowerUser, userId);
            extendData.praise = this.getNameList(record.praiseUser, userId);
            extendData.impeachFlag = false;
            if (record.headPortraitUrl && record.displayer) {
                extendData.headImg = this.getHeadImg(record.headPortraitUrl, record.gender);
                extendData.isMySelfRecordFlag = userId == record.displayer.id;
            }
            record.extendData = extendData;
            record.explain = decodeURI(record.explain);
        });
        return list;
    }

    /**
     * 获取所有的名字字符串
     * @param nameList
     */
    getNameList(nameList, authId) {
        let foldNameStr = "";
        let unfoldNameStr = "";
        let isFlag = false;
        let mySelfIndex = -1;
        angular.forEach(nameList, (obj, index) => {
            if (!obj) return;
            if (obj.id == authId) {
                isFlag = true;
                mySelfIndex = index;
            }
            if (!unfoldNameStr) {
                unfoldNameStr = obj.name;
            } else {
                unfoldNameStr += "，" + obj.name;
            }
            if (index < this.showNameCount) {
                foldNameStr = unfoldNameStr;
            }
        });
        return {
            foldNameStr: foldNameStr,
            unfoldNameStr: unfoldNameStr,
            flag: isFlag,
            mySelfIndex: mySelfIndex,
        }
    }

    /**
     * 获取自己的所有记录
     * @param userId
     * @returns {function()}
     */
    getAuthRecords(param, gender) {
        let me = this;
        return (dispatch, getState) => {
            let defer = me.$q.defer();
            let userId = getState().profile_user_auth.user.userId;
            let userGender = getState().profile_user_auth.user.gender;
            let headUrl = getState().growing_myself_record_list.headImg;
            dispatch({type: GROWING_MYSELF_RECORD.FETCH_RECORD_LIST_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_GET_SELF_RECORDS, param, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    let list = data.result.displayRecord || [];
                    let recordList = this.initRecordList(list, userId);
                    let payload = {recordList: recordList, headImg: headUrl, totalCount: data.result.totalCount};
                    dispatch({type: GROWING_MYSELF_RECORD.FETCH_RECORD_LIST_SUCCESS, payload: payload});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: GROWING_MYSELF_RECORD.FETCH_RECORD_LIST_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: GROWING_MYSELF_RECORD.FETCH_RECORD_LIST_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 查看某一个同学的记录
     * @param userId
     * @param classmateId
     * @returns {function()}
     */
    getClassmateRecord(userId, classmateId, userGender) {
        let me = this;
        return (dispatch, getState) => {
            let clazzId = getState().growing_selected_clazz;
            let param = {
                //ownId:userId, //查看的学生的id
                displayerId: classmateId, //被查看的学生的id
                classId: clazzId
            };
            let defer = me.$q.defer();
            dispatch({type: GROWING_CLASSMATE_RECORD.FETCH_RECORD_LIST_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_GET_ONE_CLASSMATE_RECORDS, param, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    let list = data.result || [];
                    let headImg = this.getHeadImg(data.result.headPortraitUrl, userGender);
                    let recordList = this.initRecordList(list, userId);
                    let payload = {recordList: recordList, headImg: headImg};
                    dispatch({type: GROWING_CLASSMATE_RECORD.FETCH_RECORD_LIST_SUCCESS, payload: payload});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: GROWING_CLASSMATE_RECORD.FETCH_RECORD_LIST_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: GROWING_CLASSMATE_RECORD.FETCH_RECORD_LIST_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 获取上传类型的标签
     */
    getRecordLabels() {
        let me = this;
        return (dispatch) => {
            let defer = me.$q.defer();
            dispatch({type: GROWING_PUB_MSG.FETCH_LABEL_LIST_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GET_GROWING_RECORD_LABEL, null, true);
            me.pubMsgCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    dispatch({type: GROWING_PUB_MSG.FETCH_LABEL_LIST_SUCCESS, payload: data.result});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: GROWING_PUB_MSG.FETCH_LABEL_LIST_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: GROWING_PUB_MSG.FETCH_LABEL_LIST_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 获取上传内容的类型
     * @returns {promise}
     */
    getRecordType() {
        let me = this;
        return (dispatch) => {
            let defer = me.$q.defer();
            dispatch({type: GROWING_PUB_MSG.FETCH_TYPE_LIST_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GET_GROWING_RECORD_TYPE, null, true);
            me.pubMsgCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    dispatch({type: GROWING_PUB_MSG.FETCH_TYPE_LIST_SUCCESS, payload: data.result});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: GROWING_PUB_MSG.FETCH_TYPE_LIST_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: GROWING_PUB_MSG.FETCH_TYPE_LIST_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 获取上传内容哪些人可见
     * @returns {promise}
     */
    getRecordStatus() {
        let me = this;
        return (dispatch) => {
            let defer = me.$q.defer();
            dispatch({type: GROWING_PUB_MSG.FETCH_STATUS_LIST_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GET_GROWING_RECORD_STATUS, null, true);
            me.pubMsgCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    dispatch({type: GROWING_PUB_MSG.FETCH_STATUS_LIST_SUCCESS, payload: data.result});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: GROWING_PUB_MSG.FETCH_STATUS_LIST_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: GROWING_PUB_MSG.FETCH_STATUS_LIST_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 发布内容
     * @param formData
     * @returns {function()}
     */
    uploadRecord(formData, clazz) {
        let me = this;
        return (dispatch) => {
            let defer = me.$q.defer();
            dispatch({type: GROWING_PUB_MSG.PUB_MSG_START});
            dispatch({type: GROWING_ONE_CLAZZ.CHANGE_DISPLAY_SELECTED_CLAZZ, payload: clazz});

            let postInfo = me.commonService.commonPost(me.serverInterface.UPLOAD_GROWING_RECORD, formData, true);
            me.pubMsgCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    dispatch({type: GROWING_PUB_MSG.PUB_MSG_SUCCESS});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: GROWING_PUB_MSG.PUB_MSG_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: GROWING_PUB_MSG.PUB_MSG_FAIL});
                defer.resolve(data);
            });
            return defer.promise;

        };
    }

    /**
     * 删除记录
     * @param param
     */
    deleteRecord(param, index, type) {
        let actionType = this.getActionType(type);
        let me = this;
        return (dispatch) => {
            let defer = me.$q.defer();
            dispatch({type: actionType.DELETE_RECORD_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.DELETE_GROWING_RECORD, param, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    dispatch({type: actionType.DELETE_RECORD_SUCCESS, payload: index});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: actionType.DELETE_RECORD_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: actionType.DELETE_RECORD_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    getActionType(type) {
        let actionType = "";
        switch (type) {
            case this.actionType.mySelf:
                actionType = GROWING_MYSELF_RECORD;
                break;
            case this.actionType.classmate:
                actionType = GROWING_CLASSMATE_RECORD;
                break;
            case this.actionType.onClazz:
                actionType = GROWING_ONE_CLAZZ;
                break;
            default:
                break;
        }
        return actionType;
    }

    /**
     * 送花
     * @param param
     */
    sendFlower(param, type, payload) {
        let actionType = this.getActionType(type);
        if (!actionType) return;
        let me = this;
        return (dispatch, getState) => {
            let userId = getState().profile_user_auth.user.userId;
            let userName = getState().profile_user_auth.user.name;
            let defer = me.$q.defer();
            dispatch({type: actionType.SEND_FLOWER_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_SEND_FLOWER, param, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    payload.record.flower++;
                    let user = [{
                        "id": userId,
                        "name": userName
                    }];
                    payload.record.flowerUser = user.concat(payload.record.flowerUser);
                    payload.record.extendData.flower = this.getNameList(payload.record.flowerUser, userId);
                    dispatch({type: actionType.SEND_FLOWER_SUCCESS, payload: payload});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: actionType.SEND_FLOWER_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: actionType.SEND_FLOWER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }


    /**
     * 取消送花
     * @param param
     */
    cancelSendFlower(param, type, payload) {
        let actionType = this.getActionType(type);
        if (!actionType) return;
        let me = this;
        return (dispatch, getState) => {
            let userId = getState().profile_user_auth.user.userId;
            let defer = me.$q.defer();
            dispatch({type: actionType.CANCEL_FLOWER_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_CANCEL_SEND_FLOWER, param, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    payload.record.flower = payload.record.flower - 1 > 0 ? payload.record.flower - 1 : 0;
                    payload.record.flowerUser.splice(payload.record.extendData.flower.mySelfIndex, 1); //删除自己的名字
                    payload.record.extendData.flower = this.getNameList(payload.record.flowerUser, userId);
                    dispatch({type: actionType.CANCEL_FLOWER_SUCCESS, payload: payload});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: actionType.CANCEL_FLOWER_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: actionType.CANCEL_FLOWER_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }


    /**
     * 点赞
     * @param param
     */
    sendPraise(param, type, payload) {
        let actionType = this.getActionType(type);
        if (!actionType) return;
        let me = this;
        return (dispatch, getState) => {
            let userId = getState().profile_user_auth.user.userId;
            let userName = getState().profile_user_auth.user.name;
            let defer = me.$q.defer();
            dispatch({type: actionType.SEND_PRAISE_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_SEND_PRAISE, param, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    payload.record.praise++;
                    let user = [{
                        "id": userId,
                        "name": userName
                    }];
                    payload.record.praiseUser = user.concat(payload.record.praiseUser);
                    payload.record.extendData.praise = this.getNameList(payload.record.praiseUser, userId);
                    dispatch({type: actionType.SEND_PRAISE_SUCCESS, payload: payload});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: actionType.SEND_PRAISE_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: actionType.SEND_PRAISE_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 取消点赞
     * @param param
     */
    cancelSendPraise(param, type, payload) {
        let actionType = this.getActionType(type);
        if (!actionType) return;
        let me = this;
        return (dispatch, getState) => {
            let userId = getState().profile_user_auth.user.userId;
            let defer = me.$q.defer();
            dispatch({type: actionType.CANCEL_PRAISE_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_CANCEL_SEND_PRAISE, param, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    payload.record.praise = payload.record.praise - 1 > 0 ? payload.record.praise - 1 : 0;
                    payload.record.praiseUser.splice(payload.record.extendData.praise.mySelfIndex, 1); //删除自己的名字
                    payload.record.extendData.praise = this.getNameList(payload.record.praiseUser, userId);
                    dispatch({type: actionType.CANCEL_PRAISE_SUCCESS, payload: payload});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: actionType.CANCEL_PRAISE_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: actionType.CANCEL_PRAISE_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 获取举报理由
     * @param userId
     * @returns {function()}
     */
    getImpeachReason(userId) {
        let me = this;
        return (dispatch) => {
            let defer = me.$q.defer();
            dispatch({type: GROWING_CLASSMATE_RECORD.FETCH_IMPEACH_REASON_LIST_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_GET_IMPEACH_REASON, {userId: userId}, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    let payData = {count: data.result.residueCount, reasonList: data.result.impeachType};
                    dispatch({type: GROWING_CLASSMATE_RECORD.FETCH_IMPEACH_REASON_LIST_SUCCESS, payload: payData});
                    defer.resolve(data);
                }
                dispatch({type: GROWING_CLASSMATE_RECORD.FETCH_IMPEACH_REASON_LIST_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: GROWING_CLASSMATE_RECORD.FETCH_IMPEACH_REASON_LIST_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 举报同学
     * @param param
     * @param index
     * @returns {function(*)}
     */
    impeachClassmate(param, index, type) {
        let actionType = this.getActionType(type);
        let me = this;
        return (dispatch) => {
            let defer = me.$q.defer();
            dispatch({type: actionType.IMPEACH_RECORD_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_IMPEACH_CLASSMATE, param, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    dispatch({type: actionType.IMPEACH_RECORD_SUCCESS, payload: index});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: actionType.IMPEACH_RECORD_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: actionType.IMPEACH_RECORD_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 查看全班的发布列表
     */
    getAllClassMateRecordCount(param) {
        let me = this;
        return (dispatch) => {
            let defer = me.$q.defer();
            dispatch({type: GROWING_CLASSMATE_LIST.FETCH_CLASSMATE_LIST_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_GET_ALL_CLASSMATES_RECORDS, param, true);
            me.classmateCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    dispatch({type: GROWING_CLASSMATE_LIST.FETCH_CLASSMATE_LIST_SUCCESS, payload: data.result});
                    defer.resolve(data);
                    return;
                }
                dispatch({type: GROWING_CLASSMATE_LIST.FETCH_CLASSMATE_LIST_FAIL});
                defer.resolve(data);
            }, data => {
                dispatch({type: GROWING_CLASSMATE_LIST.FETCH_CLASSMATE_LIST_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 保存全班列表页面选择的班级
     * @param param
     */
    setSelectedClazz(param) {
        return (dispatch, getState) => {
            dispatch({type: GROWING_CLASSMATE_LIST.CHANGE_SELECT_CLAZZ, payload: param});
            dispatch({type: GROWING_ONE_CLAZZ.CHANGE_DISPLAY_SELECTED_CLAZZ, payload: param});
        }
    }

    setSelectedClassmate(classmateInfo) {
        return (dispatch, getState) => {
            dispatch({type: GROWING_CLASSMATE_RECORD.CHANGE_SELECTED_CLASSMATE, payload: classmateInfo});
        }
    }

    /**
     * 判断学生能不能上传
     * @returns {function()}
     */
    getCanPublishFlag() {
        let me = this;
        return () => {
            let defer = me.$q.defer();
            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_GET_CAN_PUBLISH_FLAG, null, true);
            me.pubMsgCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                defer.resolve(data);
            }, data => {
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 获取朋友圈学生信息
     */
    getAllRecords() {
        let me = this;
        return (dispatch, getState) => {
            let userId = getState().profile_user_auth.user.userId;
            let userGender = getState().profile_user_auth.user.gender;
            let clazzId = getState().growing_one_clazz_record_info.selectedClazz.id;
            let seq = getState().growing_one_clazz_record_info.seq;
            let headId = getState().user_reward_base.avator;
            let defer = me.$q.defer();
            dispatch({type: GROWING_ONE_CLAZZ.FETCH_ONE_CLAZZ_INFO_START});

            let postInfo = me.commonService.commonPost(me.serverInterface.GROWING_GET_ALL_RECORDS, {
                classId: clazzId,
                seq: seq
            }, true);
            me.recordCancelRequestList.push(postInfo.cancelDefer);

            postInfo.requestPromise.then((data) => {
                if (data.code == 200) {
                    let list = data.result.displayList || [];
                    let headImg = this.getHeadImg(headId, userGender);
                    let recordList = this.initRecordList(list, userId);
                    let payload1 = {recordList: recordList, hasMore: data.result.hasMore};
                    dispatch({type: GROWING_ONE_CLAZZ.FETCH_ONE_CLAZZ_INFO_SUCCESS, payload: payload1});

                    //保存用户头像
                    let payload2 = {recordList: [], headImg: headImg, totalCount: 0};
                    dispatch({type: GROWING_MYSELF_RECORD.FETCH_RECORD_LIST_SUCCESS, payload: payload2});
                    defer.resolve(data);
                } else {
                    dispatch({type: GROWING_ONE_CLAZZ.FETCH_ONE_CLAZZ_INFO_FAIL});
                    defer.resolve(data);
                }
            }, data => {
                dispatch({type: GROWING_ONE_CLAZZ.FETCH_ONE_CLAZZ_INFO_FAIL});
                defer.resolve(data);
            });
            return defer.promise;
        };
    }

    /**
     * 修改显示朋友圈消息的班级
     * @param clazz
     * @returns {function(*)}
     */
    changeDisplayClazz(clazz) {
        return (dispatch) => {
            dispatch({type: GROWING_ONE_CLAZZ.CHANGE_DISPLAY_SELECTED_CLAZZ, payload: clazz});
        }
    }
}

GrowingService.$inject = ['$http', '$q', '$rootScope', 'serverInterface', 'commonService', "$ngRedux"];
services.service('growingService', GrowingService);



