/**
 * Created by 邓小龙 on 2015/8/25.
 * @description 学生service
 */
import services from './index';
import BaseService from 'base_components/base_service';
import * as types from '../redux/actiontypes/actiontypes';
import {bindActionCreators} from 'redux';
import _sortby from 'lodash.sortby';
import _find from 'lodash.find';
import _each from 'lodash.foreach';
import logger from 'log_monitor';
import DTMgr from 'TdBase/index.js'

class ProfileService extends BaseService {
    constructor() {
        super(arguments);
        this.cancelUnitRequestList = []; //选择教材的请求
    }

    handleLogin_old(formData, callback, scope) {
        return (dispatch, getState) => {
            callback = callback || angular.noop;
            formData = formData || {};
            formData.deviceId = '11';
            formData.deviceType = this.getRootScope().platform.type;
            if (!formData.loginName) formData.loginName = getState().profile_user_auth.user.loginName;


            dispatch({type: types.PROFILE.LOGIN_START});


            this.commonService.commonPost(this.serverInterface.LOGIN, formData).then((data) => {
                this.getRootScope().hideLoadingScene();
                if (data.code == 200) {
                    this.getRootScope().userConfig = data.config;
                    dispatch({type: types.PROFILE.LOGIN_SUCCESS, data: data});
                    callback(true);
                }
                //code:602密码错误|code:604账号错误
                if (data && (data.code == 602 || data.code == 604)) {
                    dispatch({type: types.PROFILE.LOGIN_FAIL});
                    this.commonService.alertDialog(data.msg);
                    if (scope) {
                        scope.isSecondInputError = true;
                        scope.getCodeUrl();
                        scope.getScope().$emit('loginFail', data);//发给 onresumeHandler 处理自动登录等功能
                    }
                    callback(false);
                }
                //code:600需要被其它设备授权(已经被废弃的功能)
                if (data && data.code == 600) {
                    dispatch({type: types.PROFILE.LOGIN_FAIL});
                    this.commonService.setLocalStorage('C_user', {loginName: param.loginName});
                    if (scope) {
                        scope.getScope().$emit('loginFail', data);//发给 onresumeHandler 处理自动登录等功能
                        scope.needQRCode = true;
                    }
                    callback(false);
                }
            }, (data) => {
                this.getRootScope().hideLoadingScene();
                dispatch({type: types.PROFILE.LOGIN_FAIL, payload: data});
                callback(false);
            });
        }
    }

    handleLogin(formData, callback, scope, bootstrapAutoLogin) {
        return (dispatch, getState) => {
            callback = callback || angular.noop;
            formData = formData || {};
            formData.deviceId = '11';
            formData.deviceType = this.getRootScope().platform.type;
            if (!formData.loginName) formData.loginName = getState().profile_user_auth.user.loginName;

            dispatch({type: types.PROFILE.LOGIN_START});
            dispatch({type: types.CLAZZ.FETCH_CLAZZ_LIST_START, withoutWebWorker: true});
            dispatch({type: types.FEATURE_SWITCH.FETCH_FEATURE_SWITCH_START});
            let loginTimes = 0;
            let postData = () => {
                loginTimes++;
                this.commonService.commonPost(this.serverInterface.LOGIN, formData).then((data) => {
                    this.getRootScope().hideLoadingScene();
                    if (data.code == 200) {
                        this.getRootScope().firstShowDignoseAdDialog = true;
                        this.getRootScope().userConfig = data.config;
                        this.getRootScope().sessionID = data.jsessionid;
                        // this.getRootScope().loginRandom = data.login;
                        data.loginName = formData.loginName;
                        dispatch({type: types.PROFILE.LOGIN_SUCCESS, data: data});
                        dispatch({type: types.PROFILE.MODIFY_DURING_NATIONAL_DAY_FLAG, data: data.config});
                        dispatch({type: types.FEATURE_SWITCH.FETCH_FEATURE_SWITCH_SUCCESS});
                        this.getRootScope().hasOralCalculation = data.config.oc;
                        this.getRootScope().hasAreaEvaluation = data.config.areaTeachingResearch;
                        this.getClazzList(data, dispatch, getState);
                        this.fetchFeatureSwitch(data);
                        this.getRewardInfo(dispatch, getState);
                        callback(true);
                        DTMgr.send(data.login,data.loginName);
                        return
                    } else {
                        if (window.LogMonitor) window.LogMonitor.enableUpload = false;

                    }

                    //code:602密码错误|code:604账号错误
                    if (data && (data.code == 602 || data.code == 604)) {
                        dispatch({type: types.PROFILE.LOGIN_FAIL});
                        this.commonService.alertDialog(data.msg);
                        if (scope) {
                            scope.isSecondInputError = true;
                            scope.getCodeUrl();
                            scope.getScope().$emit('loginFail', data);//发给 onresumeHandler 处理自动登录等功能
                        }
                        callback(false);
                        return
                    }
                    //code:600需要被其它设备授权(已经被废弃的功能)
                    if (data && data.code == 600) {
                        dispatch({type: types.PROFILE.LOGIN_FAIL});
                        this.commonService.setLocalStorage('C_user', {loginName: param.loginName});
                        if (scope) {
                            scope.getScope().$emit('loginFail', data);//发给 onresumeHandler 处理自动登录等功能
                            scope.needQRCode = true;
                        }
                        callback(false);
                        return
                    }
                    if (bootstrapAutoLogin && loginTimes < 5) {
                        postData();
                    }
                    
                }, (data) => {
                    this.getRootScope().hideLoadingScene();
                    dispatch({type: types.PROFILE.LOGIN_FAIL, payload: data});
                    dispatch({type: types.CLAZZ.FETCH_CLAZZ_LIST_FAIL, error: data});
                    dispatch({type: types.FEATURE_SWITCH.FETCH_FEATURE_SWITCH_FAIL});
                    // callback(false);
                });
            };
            postData();
        }
    }

    logout(callback) {
        return (dispatch) => {
            dispatch({type: types.PROFILE.LOGOUT_START});
            this.commonService.commonPost(this.serverInterface.LOGOUT)
                .then((data) => {
                    if (data.code == 200) {
                        dispatch({type: types.PROFILE.LOGOUT_SUCCESS});
                        callback.call(this, true);
                    } else {
                        dispatch({type: types.PROFILE.LOGOUT_FAIL, error: data});
                        callback.call(this, false);
                    }
                });
        }
    }

    fetchClazzList(afterFetchClazzList) {
        afterFetchClazzList = afterFetchClazzList || angular.noop;
        /**
         * 根据服务端接口返回的数据获取服务端已经通过审核的班级列表
         * @param remoteResp
         */
        let getRemotePassedClazzList = (remoteResp) => {
            let passedClazzList = [];
            if (remoteResp.classes && remoteResp.classes.length > 0) {
                remoteResp.classes.forEach(function (item) {
                    if (item.status == 1) {
                        passedClazzList.push(item);
                    }
                });
            }
            return passedClazzList;
        };
        /**
         * 通过从服务器获取的已通过审核的班级列表与本地的做比较，找出已经删除的班级列表
         * @param localPassedClazzList 本地存储的已经通过审核的班级列表
         * @param remotePassedClazzList 从服务器获取的已通过审核的班级列表
         */
        let getDeletedPassedClazzList = (localPassedClazzList, remotePassedClazzList) => {
            let deletedPassedClazzList = [];
            remotePassedClazzList.forEach(rClazz => {
                let has = false;
                localPassedClazzList.forEach(lClazz => {
                    if (rClazz.id == lClazz.id) has = true;
                });
                if (has)
                    deletedPassedClazzList.push(rClazz);
            });
            return deletedPassedClazzList;
        };
        return (dispatch, getState) => {
            let state = getState();
            dispatch({type: types.CLAZZ.FETCH_CLAZZ_LIST_START, withoutWebWorker: true});
            this.commonService
                .commonPost(this.serverInterface.GET_CLASSES, {id: state.profile_user_auth.user.userId})
                .then(data => {
                    if (data.code = 200) {
                        let remotePassedClazzList = getRemotePassedClazzList(data);
                        let localPassedClazzList = state.profile_clazz.passClazzList || [];

                        let deletedPassedClazzList = getDeletedPassedClazzList(localPassedClazzList, remotePassedClazzList);
                        if (deletedPassedClazzList.length) {
                            dispatch({
                                type: types.WORK_LIST.DELETE_CACHED_WORK_LIST,
                                payload: deletedPassedClazzList
                            })
                        }
                        if (!remotePassedClazzList.length) {
                            dispatch({
                                type: types.PROFILE.PROFILE_CHANGE_CLAZZ,
                                clazz: ""
                            });
                            dispatch({
                                type: types.WORK_LIST.WORK_LIST_CHANGE_CLAZZ,
                                payload: ''
                            });
                            dispatch({
                                type: types.GAME_LIST.GAME_LIST_CHANGE_CLAZZ,
                                payload: ''
                            });
                        }
                        //如果是自学班不添加到普通班级的classList
                        var normalClass = [], selfStudyClass = [];
                        if (Object.prototype.toString.apply(data.classes) === '[object Array]' || data.classes instanceof Array) {
                            data.classes.forEach((item) => {
                                if (item.type === 100) normalClass.push(item);
                                if (item.type === 900) selfStudyClass.push(item);
                            })
                        }
                        dispatch({
                            type: types.CLAZZ.FETCH_CLAZZ_LIST_SUCCESS,
                            clazzList: normalClass,
                            passClazzList: remotePassedClazzList,
                            selfStudyClazzList: selfStudyClass
                        });
                        // this.fetchFeatureSwitch(remotePassedClazzList);
                        afterFetchClazzList.call(this, true, data.classes);
                        return;
                    }
                    dispatch({type: types.CLAZZ.FETCH_CLAZZ_LIST_FAIL, error: data});
                    afterFetchClazzList.call(this, false);
                });
        }
    }

    getClazzList(data, dispatch, getState) {
        /**
         * 根据服务端接口返回的数据获取服务端已经通过审核的班级列表
         * @param remoteResp
         */
        let getRemotePassedClazzList = (remoteResp) => {
            let passedClazzList = [];
            if (remoteResp.classes && remoteResp.classes.length > 0) {
                remoteResp.classes.forEach(function (item) {
                    if (item.status == 1) {
                        passedClazzList.push(item);
                    }
                });
            }
            return passedClazzList;
        };
        /**
         * 通过从服务器获取的已通过审核的班级列表与本地的做比较，找出已经删除的班级列表
         * @param localPassedClazzList 本地存储的已经通过审核的班级列表
         * @param remotePassedClazzList 从服务器获取的已通过审核的班级列表
         */
        let getDeletedPassedClazzList = (localPassedClazzList, remotePassedClazzList) => {
            let deletedPassedClazzList = [];
            remotePassedClazzList.forEach(rClazz => {
                let has = false;
                localPassedClazzList.forEach(lClazz => {
                    if (rClazz.id == lClazz.id) has = true;
                });
                if (has)
                    deletedPassedClazzList.push(rClazz);
            });
            return deletedPassedClazzList;
        };
        let state = getState();
        let remotePassedClazzList = getRemotePassedClazzList(data);
        let localPassedClazzList = state.profile_clazz.passClazzList || [];

        let deletedPassedClazzList = getDeletedPassedClazzList(localPassedClazzList, remotePassedClazzList);
        if (deletedPassedClazzList.length) {
            dispatch({
                type: types.WORK_LIST.DELETE_CACHED_WORK_LIST,
                payload: deletedPassedClazzList
            })
        }
        if (!remotePassedClazzList.length) {
            dispatch({
                type: types.PROFILE.PROFILE_CHANGE_CLAZZ,
                clazz: ""
            });
            dispatch({
                type: types.WORK_LIST.WORK_LIST_CHANGE_CLAZZ,
                payload: ''
            });
            dispatch({
                type: types.GAME_LIST.GAME_LIST_CHANGE_CLAZZ,
                payload: ''
            });
        }
        //如果是自学班不添加到普通班级的classList
        var normalClass = [], selfStudyClass = [];
        if (Object.prototype.toString.apply(data.classes) === '[object Array]' || data.classes instanceof Array) {
            data.classes.forEach((item) => {
                if (item.type === 100) normalClass.push(item);
                if (item.type === 900) selfStudyClass.push(item);
            })
        }
        dispatch({
            type: types.CLAZZ.FETCH_CLAZZ_LIST_SUCCESS,
            clazzList: normalClass,
            passClazzList: remotePassedClazzList,
            selfStudyClazzList: selfStudyClass
        });
    }

    changeClazz(clazz) {
        return (dispatch) => dispatch({
            type: types.PROFILE.PROFILE_CHANGE_CLAZZ,
            clazz: clazz
        });
    }

    handleTagStructure(data, selectedUnit) {
        let retArray = [];
        data.forEach((material) => {
            material.subTags.forEach((subTag, index) => {
                console.log("index:", index);
                subTag.parentTagText = material.text;
                if (!selectedUnit && index == 0)
                    subTag.selected = true;
                if (selectedUnit && selectedUnit.unitTagId === subTag.id)
                    subTag.selected = true;
                retArray.push(subTag);
            });
        });
        return retArray;
    }


    /**
     * 获取所有的教材列表
     * @returns {promise}
     */
    getTextbookList() {
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            let diagnose_selected_clazz = getState().diagnose_selected_clazz;
            dispatch({type: types.UNIT.FETCH_TEXTBOOK_LIST_START});
            let postInfo = this.commonService.commonPost(this.serverInterface.GET_TEXTBOOK_LIST,
                {
                    /*grade: diagnose_selected_clazz.grade,*/
                    depth: 4
                },
                true);
            this.cancelUnitRequestList.push(postInfo.cancelDefer);
            postInfo.requestPromise.then((data) => {
                if (data.code = 200) {
                    _each(data.detail, (v) => {//每一个教材版本设置展开flag(展开教材)
                        v.isOpened = false;
                        v.subTags = _sortby(v.subTags, 'seq'); //教材以seq排序
                        _each(v.subTags, (v2) => { //每一个教材设置带版本的显示名字
                            v2.name = '【' + v.text + '】 ' + v2.text;
                            v2.subTags = _sortby(v2.subTags, 'seq');//教材章节以seq排序
                            _each(v2.subTags, function (v3) {
                                v3.subTags = _sortby(v3.subTags, 'seq'); //章节的单元以seq排序
                                v3.isOpened = false
                            });//每个教材下的单元设置展开flag(展开知识章节)
                        })

                    });

                    dispatch({type: types.UNIT.FETCH_TEXTBOOK_LIST_SUCCESS, payload: data.detail});
                    return defer.resolve(true);
                }
                dispatch({type: types.UNIT.FETCH_TEXTBOOK_LIST_FAIL});
                return defer.resolve(false);
            }, () => {
                dispatch({type: types.UNIT.FETCH_TEXTBOOK_LIST_FAIL});
                return defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 选择教材
     */
    selectTextbook(textbook) {
        return (dispatch, getState) => {
            let textbooks = getState().unit.textbooks;
            let currentTextbook = null;

            //没有指定教材就默认选择第一个版本的第一本教材
            if (!textbook) {
                currentTextbook = textbooks[0] && textbooks[0]['subTags'] && textbooks[0]['subTags'][0];
            }
            //指定了教材id
            else {
                _find(textbooks, (version) => {
                    return currentTextbook = _find(version.subTags, {id: textbook.id});
                });

                _each(currentTextbook.subTags, (serverUnit) => {
                    let localUnit = _find(textbook.subTags, {id: serverUnit.id});
                    serverUnit.isOpened = localUnit && localUnit.isOpened;
                })
            }

            dispatch({type: types.UNIT.SELECT_TEXTBOOK_WORK, payload: currentTextbook});
            return currentTextbook && currentTextbook.id
        }
    }


    fetchUnitList() {
        let me = this;
        return function (dispatch, getState) {
            let state = getState();
            dispatch({type: types.UNIT.FETCH_UNIT_START});
            me.commonService.commonPost(me.serverInterface.GET_UNIT, {depth: 3}).then((data) => {
                if (!data) {
                    dispatch({type: types.UNIT.FETCH_UNIT_FAIL, error: data});
                    return;
                }
                if (data) {
                    let unitList = me.handleTagStructure(data, state.unit.selectedUnit);
                    dispatch({
                        type: types.UNIT.FETCH_UNIT_SUCCESS,
                        unitList: unitList
                    });
                    return;
                }

            });
        }
    };

    changeUnit(reSelectUnit) {
        return (dispatch) => {
            dispatch({
                type: types.UNIT.CHANGE_UNIT,
                unit: reSelectUnit
            });
        }
    }


    fetchAchievementList(startTime, endTime) {
        return (dispatch) => {
            let defer = this.$q.defer();
            let achievements = [];
            for (var praise in this.finalData.PRAISE_MAP) {
                var param = {
                    num: 0,
                    type: praise,
                    text: this.finalData.PRAISE_MAP[praise].text,
                    imgUrl: this.finalData.PRAISE_MAP[praise].img,
                    achStyle: this.finalData.PRAISE_MAP[praise].bgColor,
                    id: this.finalData.PRAISE_MAP[praise].id
                };
                achievements.push(param);
            }
            achievements = this.$filter('orderBy')(achievements, 'id');
            dispatch({type: types.ACHIEVEMENT.FETCH_ACHIEVEMENT_START, payload: achievements});
            this.commonService.commonPost(this.serverInterface.GET_ACHIEVEMENT, {
                startTime: startTime,
                endTime: endTime
            }).then((data) => {
                if (data.code == 200) {
                    achievements.forEach(function (item) {
                        item.num = 0;
                        for (var type in data.encourage) {
                            if (item.type == type) {
                                item.num = data.encourage[type];
                            }
                        }
                    });
                    dispatch({type: types.ACHIEVEMENT.FETCH_ACHIEVEMENT_SUCCESS, payload: achievements});
                    defer.resolve(true);
                }
                else {
                    dispatch({type: types.ACHIEVEMENT.FETCH_ACHIEVEMENT_FAIL, payload: data});
                    defer.resolve(false);
                }
            }, (error) => {
                defer.reject(error)
            });

            return defer.promise;
        }
    }

    /**
     * 奖杯排行榜选择班级
     * @param reSelectClazz
     * @returns {function()}
     */
    changeTrophyClazz(reSelectClazz) {
        return (dispatch, getState) => {     //改变班级
            if (!reSelectClazz)
                reSelectClazz = getState().profile_clazz.passClazzList[0];
            dispatch({type: types.TROPHY_RANK.TROPHY_CHANGE_CLAZZ, payload: reSelectClazz});
        };
    }

    fetchTrophyRankData(param) {
        return (dispatch) => {
            dispatch({type: types.TROPHY_RANK.FETCH_TROPHY_RANK_START});
            this.commonService.commonPost(this.serverInterface.GET_TROPHY_RANK, {
                classId: param.clazzId,
                startTime: param.startTime,
                endTime: param.endTime
            }).then((data) => {
                debugger;
                param.scope.$broadcast('scroll.refreshComplete');
                if (data.code == 200) {
                    dispatch({
                        type: types.TROPHY_RANK.FETCH_TROPHY_RANK_SUCCESS,
                        payload: {stateKey: param.stateKey, trophyRankData: data.list}
                    });
                    return;
                }
                dispatch({type: types.TROPHY_RANK.FETCH_TROPHY_RANK_FAIL, payload: data});
            }, (error) => {
                dispatch({type: types.TROPHY_RANK.FETCH_TROPHY_RANK_FAIL, payload: data});
                param.scope.$broadcast('scroll.refreshComplete');
            });
        }
    }

    handleAutoLogin(user) {
        let defer = this.$q.defer();
        this.autoLoginCancelDeferQueue = this.autoLoginCancelDeferQueue || [];
        let handleAutoLoginSuccess = (data) => {
            this.autoLoginCancelDeferQueue.forEach((cancelDefer) => cancelDefer.reject(true));
            this.autoLoginCancelDeferQueue.splice(0, this.autoLoginCancelDeferQueue.length);
            if (data.code == 200) {
                // let clazzList = this.$ngRedux.getState().profile_clazz.passClazzList;
                // this.fetchFeatureSwitch(clazzList);
                this.fetchFeatureSwitch(data);

                this.getRootScope().sessionID = data.jsessionid;
                this.getRootScope().userConfig = data.config;
                this.pageRefreshManager.update(this.$state.current, this.$state.params);
                this.$ngRedux.dispatch({type: types.PROFILE.MODIFY_DURING_NATIONAL_DAY_FLAG, data: data.config});
                this.getRootScope().hasOralCalculation = data.config.oc;
                this.getRootScope().hasAreaEvaluation = data.config.areaTeachingResearch;
                DTMgr.send(data.login,data.loginName);
                defer.resolve();
            } else {
                if (window.LogMonitor) window.LogMonitor.enableUpload = false;
            }

        };
        let handleAutoLoginFail = () => {
            //this.handleAutoLogin();
            this.autoLoginCancelDeferQueue.forEach((cancelDefer) => cancelDefer.reject(true));
            this.autoLoginCancelDeferQueue.splice(0, this.autoLoginCancelDeferQueue.length);
            this.getRootScope().needAutoLogin = false;
            this.$state.go('system_login');
        };

        if (this.autoLoginCancelDeferQueue.length) {//如果队列中有自动的请求，就直接返回，而不是再次触发自动登录
            defer.resolve();
        } else {//如果队列中没有自动的请求，就出发自动登录
            let requestInfo = this.commonService.commonPost(this.serverInterface.LOGIN, {
                loginName: user.loginName,
                deviceId: '11',
                deviceType: this.getRootScope().platform.type
            }, true);
            requestInfo.requestPromise.then(handleAutoLoginSuccess, handleAutoLoginFail);
            this.autoLoginCancelDeferQueue.push(requestInfo.cancelDefer);
        }

        return defer.promise;
    };

    /*changeComputeClazz(clazz) {
        return (dispatch) => {
            dispatch({type: types.COMPUTE.COMPUTE_CHANGE_CLAZZ, payload: clazz ? clazz : {}})
        }
    }*/

    fetchFeatureSwitch_old(clazzList) {
        let classids = ((list) => {
            let resList = [];
            list.forEach((clz) => {
                resList.push(clz.id);
            });
            return resList.join(',');
        })(clazzList);

        function switchLogMonitor(enable) {
            if (window.LogMonitor)
                window.LogMonitor.enableUpload = enable;
        }

        this.$ngRedux.dispatch({type: types.FEATURE_SWITCH.FETCH_FEATURE_SWITCH_START});
        this.commonService.commonPost(this.serverInterface.GET_FEATURE_SWITCH, {classids: classids}).then((data) => {
            let enable = false;
            if (data.code == 200) {
                this.$ngRedux.dispatch({type: types.FEATURE_SWITCH.FETCH_FEATURE_SWITCH_SUCCESS});
                let configs = data.configs;
                for (let key in configs) {
                    try {
                        let cfg = JSON.parse(configs[key]);
                        if (cfg && cfg.log == "enable") {
                            enable = true;
                        }
                    } catch (e) {
                        logger.error(e.message);
                    }
                }
            } else {
                this.$ngRedux.dispatch({type: types.FEATURE_SWITCH.FETCH_FEATURE_SWITCH_FAIL});
            }
            switchLogMonitor(enable);
        });
    }

    fetchFeatureSwitch(data) {
        let enable = false;
        let configs = data.configs;
        for (let key in configs) {
            try {
                let cfg = JSON.parse(configs[key]);
                if (cfg && cfg.log == "enable") {
                    enable = true;
                }
            } catch (e) {
                logger.error(e.message);
            }
        }
        if (window.LogMonitor) window.LogMonitor.enableUpload = enable;
    }

    getUserListByPhone(phone, callBack) {
        let params = {
            type: 'S',
            loginName: phone
        };
        this.commonService.commonPostSpecial(this.serverInterface.GET_USER_LIST_BY_PHONE, params).then((data) => {
            if (data.code === 200) {
                callBack(data.list);
                return;
            }
            callBack([]);
        }, (res) => {
            callBack([]);
        });
    }

    /**
     * 确认学生是否拥有魔法任务的奥数权限（登录成功后，用户配置会随登录接口返回存入rootScope.userConfig中，根据userConfig判断）
     * @returns {boolean}
     */
    checkStudentOlyAuthorityFromTeacher() {
        let uc = this.getRootScope().userConfig;
        const hasAuthority = 'enable';
        if (!uc) {
            return false
        }

        for (let param in uc) {
            if (!uc.hasOwnProperty(param) || typeof uc[param] !== 'string') {
                continue;
            }
            try {
                if (JSON.parse(uc[param]).OMath === hasAuthority) {
                    return true
                }
            } catch (e) {
            }
        }
        return false;
    }

    /**
     * 获取积分，经验详情
     */
    getRewardInfo(dispatch, getState) {
        dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE_START});
        this.commonService.commonPost(this.serverInterface.GET_REWARD_INFO).then((data) => {
            if (data.code === 200) {
                dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE_SUCCESS});
                let creditsInfo = data.creditsInfo;
                // creditsInfo.level = 25;//TODO 测试数据
                dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE, payload: creditsInfo});
                this.getLevelNameList(dispatch, getState, creditsInfo.level);
            } else {
                dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE_FAIL});
            }
        }, (error) => {
            dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE_FAIL});
        });
    }

    getRewardInfoServer() {
        return (dispatch) => {
            let defer = this.$q.defer();
            dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE_START});
            this.commonService.commonPost(this.serverInterface.GET_REWARD_INFO).then((data) => {
                if (data.code === 200) {
                    dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE_SUCCESS});
                    let creditsInfo = data.creditsInfo;
                    // creditsInfo.level = 25;//TODO 测试数据
                    dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE, payload: creditsInfo});
                    // this.getLevelNameList(dispatch, getState, creditsInfo.level);
                    defer.resolve(data);
                } else {
                    dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE_FAIL});
                    defer.resolve(data);
                }
            }, (error) => {
                dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }

    }

    getLevelNameList(dispatch, getState, level) {
        dispatch({type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST_START});
        // let group = getState().level_name_list_group.group;
        let group = getState().user_reward_base.title || 1;
        this.commonService.commonPostSpecial(this.serverInterface.LEVEL_NAME_LIST).then((data) => {
            if (data.code === 200) {
                let nameList = data.titles;
                let levelData = this.analyzeRewardLevelData(nameList, level, group);
                let currentLevel = this.getLevelNameAndImg(levelData, level);
                dispatch({
                    type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST,
                    payload: {nameList: nameList, levelData: levelData}
                });
                dispatch({
                    type: types.REWARD_INFO.CHANGE_USER_REWARD_BASE,
                    payload: {currenLevelName: currentLevel.name, currenLevelImgIndex: currentLevel.img}
                });
                dispatch({type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST_SUCCESS});

            } else {
                dispatch({type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST_FAIL});
            }
        }, (res) => {
            dispatch({type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST_FAIL});
        });
    }

    /*
        getLevelNameListServer(level) {
            return (dispatch)=>{
                let defer = this.$q.defer();
                dispatch({type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST_START});
                this.commonService.commonPostSpecial(this.serverInterface.LEVEL_NAME_LIST).then((data)=> {
                    if (data.code === 200) {
                        let nameList = data.titles;
                        let levelData = this.analyzeRewardLevelData(nameList, level);
                        let currentLevel = this.getLevelNameAndImg(levelData, level);
                        dispatch({
                            type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST,
                            payload: {nameList: nameList, levelData: levelData}
                        });
                        dispatch({
                            type: types.REWARD_INFO.CHANGE_USER_REWARD_BASE,
                            payload: {currenLevelName: currentLevel.name, currenLevelImgIndex: currentLevel.img}
                        });
                        dispatch({type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST_SUCCESS});
                        defer.resolve(data);
                    } else {
                        dispatch({type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST_FAIL});
                        defer.resolve(data);
                    }
                }, (res)=> {
                    dispatch({type: types.REWARD_INFO.FETCH_LEVEL_NAME_LIST_FAIL});
                    defer.resolve(false);
                });
                return defer.promise;
            }

        }*/

    analyzeRewardLevelData(nameList, currentLevel, currentGroup) {
        // let myLevel = 25;//this.rewardBase.level;TODO
        let myLevel = currentLevel;//this.rewardBase.level;
        let names = [];
        let levelData = [];
        let group = currentGroup;
        if (!group) group = 1;
        angular.forEach(nameList, (v, k) => {
            if (nameList[k][0].group.toString() == group.toString()) names = angular.copy(nameList[k]);
        });
        if (names.length == 0) return;

        //解析一组数据
        levelData.length = 0;
        levelData.push(names[0]);
        levelData[0].startLevel = 0;
        levelData[0].endLevel = names[0].level;
        levelData[0].status = myLevel >= levelData[0].endLevel ? '1' : (myLevel > levelData[0].startLevel ? '2' : '3'); //1表示已获得，2表示正在获得中，3表示未获得
        levelData[0].isShowBg = false;

        for (let i = 1; i < names.length; i++) {
            let temp = levelData[levelData.length - 1];
            if (temp.name != names[i].name) {
                levelData.push(names[i]);
                temp = levelData[levelData.length - 1];
                temp.startLevel = names[i].level;
                temp.status = myLevel + 1 >= names[i].level ? '1' : '3';
                temp.isShowBg = false;
            }
            temp.endLevel = names[i].level;
            if (myLevel < temp.endLevel && temp.status != '3') {
                temp.status = '2';
                if (levelData[levelData.length - 2]) {
                    levelData[levelData.length - 2].isShowBg = true;
                }
                temp.isShowBg = false;
            }
        }
        return levelData;
    }

    /*修改能量值*/
    changeRewardCredits(num){
        return (dispatch,getState) => {
            let param=getState().user_reward_base;
            param.credits+=num;
            dispatch({type: types.REWARD_INFO.GET_USER_REWARD_BASE, payload: param});
        }
    }

    getLevelNameAndImg(levelAnalyzeData, currentLevel) {
        let level = currentLevel;//+this.rewardBase.level;
        let currentlevelName = '';
        let currentlevelImgIndex = '';
        for (let i = 0; i < levelAnalyzeData.length; i++) {
            let startL = levelAnalyzeData[i].startLevel;
            let endL = levelAnalyzeData[i].endLevel;
            if (level >= startL && level < endL) {
                if (i == 0) {
                    currentlevelName = levelAnalyzeData[0].name;
                    currentlevelImgIndex = 1;//'levelName/' + 'levelName1.png'
                } else {
                    currentlevelName = levelAnalyzeData[i - 1].name;
                    currentlevelImgIndex = i;//'levelName/' + 'levelName' + i + '.png';
                }
            }
            if (level == endL) {
                currentlevelName = levelAnalyzeData[i].name;
                currentlevelImgIndex = i + 1;//'levelName/' + 'levelName' + (i + 1) + '.png';
            }
        }
        return {name: currentlevelName, img: currentlevelImgIndex}
    }

    changeHeadImg(dispatch, imgIndex) {
        // return (dispatch)=> {
        //     let defer = this.$q.defer();
        dispatch({type: types.REWARD_INFO.UPDATE_USER_REWARD_BASE_START});
        let param = {avator: imgIndex};
        this.commonService.commonPost(this.serverInterface.CHANGE_USER_HEAD, param).then((data) => {
            if (data.code == 200) {
                dispatch({type: types.REWARD_INFO.UPDATE_USER_REWARD_BASE_SUCCESS});
                dispatch({
                    type: types.REWARD_INFO.UPDATE_USER_REWARD_BASE,
                    payload: imgIndex
                });
                return;
            }
            dispatch({type: types.REWARD_INFO.UPDATE_USER_REWARD_BASE_FAIL});
            // defer.resolve(data);
        }, (error) => {
            // defer.resolve(data);
            dispatch({type: types.REWARD_INFO.UPDATE_USER_REWARD_BASE_FAIL});
        });
        // return defer.promise;
        // }
    }

    getMsgFormTeacher(groupId) {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.GET_TEACHER_MSG, {groupId: groupId}).then((data) => {
            if (data.code === 200) {
                defer.resolve(data);
            } else {
                defer.resolve(data);
            }
        }, (error) => {
            defer.resolve(false);
        });
        return defer.promise;
    }

    saveTeacherMsgInfo(createTime) {
        return (dispatch) => {
            dispatch({
                type: types.CLAZZ.SAVE_TEACHER_MSG,
                payload: createTime
            })
        }
    }

    changeFirstSubmitWorkAfterUpdateFlag(){
        return (dispatch) => {
            dispatch({type: types.DIAGNOSE.CHANGE_FIRST_SUBMIT_WORK_AFTER_UPDATE_FLAG})
        }
    }
    changeCheckedOlympicChangeAdFlag(){
        this.$ngRedux.dispatch({type: types.PROFILE.CHANGE_CHECKED_OLYMPIC_CHANGE_AD_FLAG})
    }
}

ProfileService.$inject = [
    "$http"
    , "$q"
    , "$log"
    , "$filter"
    , "$rootScope"
    , "serverInterface"
    , "finalData"
    , "commonService"
    , "$state"
    // , "gameService"
    , "pageRefreshManager"
    , "$ngRedux"
];

services.service('profileService', ProfileService);
