/**
 * Created by 彭建伦 on 2015/7/29.
 */
import BaseService from 'baseComponentForT/base_service';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {
    FETCH_CLAZZ_LIST_START
    ,FETCH_CLAZZ_LIST_SUCCESS
    ,FETCH_CLAZZ_LIST_FAIL
    ,TOGGLE_CLAZZ_APPLY_TUNNEL_START
    ,TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS
    ,TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL
    ,CHANGE_SELECT_CLAZZ_DETAIL_START
    ,CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS
    ,CHANGE_SELECT_CLAZZ_DETAIL_FAIL
    ,CHANGE_CLAZZ_INFO_START
    ,CHANGE_CLAZZ_INFO_SUCCESS
    ,CHANGE_CLAZZ_INFO_FAIL
    ,ADD_CLAZZ_START
    ,ADD_CLAZZ_SUCCESS
    ,ADD_CLAZZ_FAIL
    ,FETCH_ADDING_STU_LIST_START
    ,FETCH_ADDING_STU_LIST_SUCCESS
    ,FETCH_ADDING_STU_LIST_FAIL
    ,DEAL_ADD_STU_REQUEST_START
    ,DEAL_ADD_STU_REQUEST_SUCCESS
    ,DEAL_ADD_STU_REQUEST_FAIL
    ,FETCH_ADDED_STU_LIST_START
    ,FETCH_ADDED_STU_LIST_SUCCESS
    ,FETCH_ADDED_STU_LIST_FAIL
    ,FETCH_STUDENT_DETAIL_START
    ,FETCH_STUDENT_DETAIL_SUCCESS
    ,FETCH_STUDENT_DETAIL_FAIL
    ,DELETE_STUDENT_START
    ,DELETE_STUDENT_SUCCESS
    ,DELETE_STUDENT_FAIL
    ,CHANGE_STU_LEVEL_LIST
    ,CHANGE_STU_LEVEL_START
    ,CHANGE_STU_LEVEL_SUCCESS
    ,CHANGE_STU_LEVEL_FAIL
    ,SET_ADD_CLAZZ_STATUS
    ,CHANGE_CLAZZ_LIST_INFO
    ,MODIFY_USER_VISITOR

}  from './../redux/action_typs';
import _assign from 'lodash.assign';

@Inject ( '$http', '$q', '$rootScope',  'serverInterface', 'commonService', "$ngRedux",'teacherProfileService')


class ClazzService extends BaseService {
    serverInterface;
    commonService;
    $q;
    $http;
    Students = {};
    classParam = '';
    studentParam = {stuId: '', clazzId: '', stuNum: 0, listType: ''};

    constructor() {
        super(arguments);
    }

    /**
     * @description 获取班级已加入的学生列表
     * @param clazzId 班级ID
     * @param status status=[0 审核中；1 通过；-1 拒绝；-2 忽略]
     */
    @actionCreator
    getClazzStudentListByStatus(clazzId, status) {
        return (dispatch)=> {
            dispatch({type:FETCH_ADDING_STU_LIST_START});
            var defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.GET_CLAZZ_STUDENT_LIST_BY_STATUS, {
                classId: clazzId,
                status: status
            }).then((data)=>{
                if (data) {
                    dispatch({type:FETCH_ADDING_STU_LIST_SUCCESS});
                    defer.resolve(data);
                } else {
                    dispatch({type:FETCH_ADDING_STU_LIST_FAIL});
                    defer.resolve(data);
                }
            });
            return defer.promise;
        }
    }

    /**
     * @description 获取教师创建的班级列表
     */
    @actionCreator
    getClazzList() {
        return (dispatch,getState)=> {
            let defer = this.$q.defer();
            let user = getState().profile_user_auth.user;
            dispatch({type:FETCH_CLAZZ_LIST_START});
            this.commonService.commonPost(this.serverInterface.GET_CLAZZ_LIST).then((data)=>{
                let isModifyUserVisitor = false;
                if (data.code == 200) {
                    data.classes.forEach(function (item) {
                        item.openStatus = {
                            open: item.status == 1 ,
                            close: item.status == 0 || item.status == 2
                        };
                        if(item.checkedNum >= 20){isModifyUserVisitor = true}
                    });
                    defer.resolve(true);
                    //更新班级信息成功后，通过查看班级学生人数checkedNum是否超过20来刷新用户信息中的visitor值
                    if(!user.visitor && isModifyUserVisitor){
                        dispatch({type:MODIFY_USER_VISITOR, payload:{visitor:1}});
                    }
                    let addedClazz = this.teacherProfileService.filterClazz(data.classes);
                    dispatch({type:FETCH_CLAZZ_LIST_SUCCESS ,payload:{clazzList:addedClazz.normal,omClazzList:addedClazz.om}});
                } else {
                    defer.resolve(false);
                    dispatch({type:FETCH_CLAZZ_LIST_FAIL});
                }
            });
            return defer.promise;
        }
    }

    /**
     * @description 获取班级的学生列表
     * @param clazzId 班级ID
     * @return promise
     */
    getClazzStudentList(clazzId) {
        var defer = this.$q.defer();
        this.$http.post(this.serverInterface.GET_CLAZZ_STUDENT_LIST, {
            params: {
                classId: clazzId
            }
        }).success(function (data) {
            if (data.code == 200) {
                defer.resolve(data);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    }

    /**
     * 教师处理学生申请
     * @param classId 班级id
     * @param studentId 学生id
     * @param status [0 审核中；1 通过；-1 拒绝；-2 忽略]
     */
    @actionCreator
    teacherAudit(classId, details) {
        var param = {
            classId: classId,
            details: JSON.stringify(details)
        };

        return (dispatch,getState)=> {
            dispatch({type:DEAL_ADD_STU_REQUEST_START});
            var defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.T_AUDIT, param).then((data)=>{
                if (data) {
                    let clazzList = getState().clazz_list.map((value) =>{return _assign({},value)});
                    clazzList.forEach(function (clazz) {
                        if(clazz.id == classId){
                            details.forEach(function (info) {
                                if(info.status == 1){ //通过
                                    clazz.checkedNum+=1; //通过人数加1
                                    clazz.checkingNum-=1; //审核中人数减1
                                }else if(info.status == -1 || info.status == -2){
                                    clazz.checkingNum-=1; //审核中人数减1
                                }
                            })
                        }
                    });
                    dispatch({type:CHANGE_CLAZZ_LIST_INFO,payload:clazzList});
                    dispatch({type:DEAL_ADD_STU_REQUEST_SUCCESS});
                    defer.resolve(data);
                } else {
                    dispatch({type:DEAL_ADD_STU_REQUEST_FAIL});
                    defer.resolve(data);
                }
            });
            return defer.promise;
        }
    }

    getGradeClass() {
        return this.commonService.commonPost(this.serverInterface.GET_GRADE_CLAZZ, '');
    }

    /**
     * @description 添加班级
     * @param classData
     * @param nameInfo
     */
    @actionCreator
    addClazz(classData,nameInfo) {
        return (dispatch,getState)=> {
            dispatch({type:ADD_CLAZZ_START});
            var defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.ADD_CLAZZ, classData).then((data)=>{
                if (data.code == 200) {
                    let clazzList = getState().clazz_list.map((value) =>{return _assign({},value)});
                    let clazzInfo = data.class;
                    clazzInfo = _assign(clazzInfo,nameInfo);
                    clazzInfo.openStatus = {};
                    clazzInfo.openStatus.open = clazzInfo.status == 1;
                    clazzInfo.openStatus.close = clazzInfo.status == 0 || clazzInfo.status == 2;
                    clazzList.push(clazzInfo);
                    dispatch({type:CHANGE_CLAZZ_LIST_INFO ,payload:clazzList});
                    dispatch({type:ADD_CLAZZ_SUCCESS});
                    defer.resolve(data);
                } else {
                    dispatch({type:ADD_CLAZZ_FAIL});
                    defer.resolve(data);
                }
            });
            return defer.promise;
        }
    }

    /**
     * @description 修改班级
     * @param classData
     * @param nameInfo
     */
    @actionCreator
    updateClazz(classData,nameInfo) {
        return (dispatch,getState)=> {
            dispatch({type:CHANGE_CLAZZ_INFO_START});
            var defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.UPDATE_CLAZZ, classData).then((data)=>{
                if (data.code == 200) {
                    defer.resolve(data);
                    let clazzList = getState().clazz_list.map((value) =>{return _assign({},value)});
                    clazzList.forEach(function (clazz) {
                       if(clazz.id == classData.id){
                            clazz = _assign(clazz,classData,nameInfo);
                       }
                    });
                    dispatch({type:CHANGE_CLAZZ_LIST_INFO ,payload:clazzList});
                    dispatch({type:CHANGE_CLAZZ_INFO_SUCCESS ,payload:{}});
                } else {
                    defer.resolve(data);
                    dispatch({type:CHANGE_CLAZZ_INFO_FAIL});
                }
            });
            return defer.promise;
        }
    }

    /**
     * @description 删除班级
     * @param id
     */
    deleteClazz(param) {
        return this.commonService.commonPost(this.serverInterface.DELETE_CLAZZ, param);
    }

    /**
     * @description 获取班级详细信息
     * @param id
     */
    @actionCreator
    getClazzInfo(id) {
        return (dispatch)=> {
            dispatch({type:CHANGE_SELECT_CLAZZ_DETAIL_START});
            var defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.GET_CLAZZ_INFO, id).then((data)=>{
                if (data.code == 200) {
                    defer.resolve(data);
                    dispatch({type:CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS ,payload:data.clazz});
                } else {
                    defer.resolve(data);
                    dispatch({type:CHANGE_SELECT_CLAZZ_DETAIL_FAIL});
                }
            });
            return defer.promise;
        }
    }

    /**
     * @description 设置需要修改班级的参数
     * @param classDate
     */
    setClazzParam(classDate) {
        this.classParam = classDate;
    }

    /**
     * @description 获取要修改班级的参数
     *
     */
    getClazzParam() {
        return this.classParam;
    }

    /**
     * 根据班级id获取班级学生
     * @param id班级id
     */
    @actionCreator
    getStuList(param) {
        return(dispatch)=>{
            var defer = this.$q.defer();
            dispatch({type:FETCH_ADDED_STU_LIST_START});
            this.commonService.commonPost(this.serverInterface.GET_LETTER_STUDENT_LIST, param).then(data=>{
                if (!data) {
                    defer.resolve(false);
                    dispatch({type:FETCH_ADDED_STU_LIST_FAIL});
                    return
                }
                try{
                    for(var prop in data.records){
                        if(data.records.hasOwnProperty(prop)){
                           var found =  data.records[prop].find((stu, index, arr)=>{
                               //登录名没有*表示该账号是老师一键注册的体验账号，与普通学生账号区分
                               if(stu.loginName.indexOf('*') === -1){
                                   arr.splice(index, 1);
                                    arr.unshift(stu);
                                    return true;
                                }
                            });
                            if(found) break;
                        }
                    }
                }catch(err){
                    console.error('学生列表： ', err)
                }
                defer.resolve(true);
                dispatch({type:FETCH_ADDED_STU_LIST_SUCCESS,payload:data.records});
            });
            return defer.promise;
        }
    }

    /**
     * 改变学生层级
     * @param letter
     * @param $index 学生下标
     */
    @actionCreator
    levelChange(letter, $index) {
        return (dispatch,getState)=>{
            var student = getState().cm_added_stu_list[letter][$index];
            var param = {
                relId: student.cRelId,
                level: student.level
            };
            var defer = this.$q.defer();
            dispatch({type:CHANGE_STU_LEVEL_START});
            this.commonService.commonPost(this.serverInterface.LEVEL_CHANGE, param).then(data=>{
                if (data.code != 200) {
                    dispatch({type:CHANGE_STU_LEVEL_FAIL});
                    defer.resolve(false);
                    return
                }

                let stuList = _assign({},getState().cm_added_stu_list);
                stuList[letter].splice($index, 1);
                if (!stuList[param.level]) {
                    stuList[param.level] = [];
                }
                stuList[param.level].push(student);
                //排序
                let keyList = Object.keys(stuList).sort();
                let newList = {};
                keyList.forEach(key=>{
                    newList[key] = stuList[key];
                });

                dispatch({type:CHANGE_STU_LEVEL_LIST,payload:newList});
                dispatch({type:CHANGE_STU_LEVEL_SUCCESS});
                defer.resolve(true);
            });
            return defer.promise;
        }
    }


    /**
     * 获取班级申请状态
     * @param clazzId 班级id
     * @returns {*}
     */
    getApplication(clazzId) {
        var defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.GET_CLAZZ_STATUS, {clazzId: clazzId}).then(function (data) {
            if (!data) {
                defer.resolve(false);
                return;
            }
            defer.resolve(data);
        });
        return defer.promise;
    }

    /**
     * 设置班级申请状态
     * @param clazzId 班级id
     */
    @actionCreator
    setApplication(param,openStatus) {
        return (dispatch,getState)=>{
            var detail = [];
            detail.push(param);
            var defer = this.$q.defer();
            dispatch({type:TOGGLE_CLAZZ_APPLY_TUNNEL_START});
            this.commonService.commonPost(this.serverInterface.SET_CLAZZ_STATUS, {details: JSON.stringify(detail)}).then((data)=> {
                if (!data) {
                    defer.resolve(false);
                    dispatch({type:TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL});
                    return;
                }

                //获取该班级在班级列表中的下标
                var clazzList = getState().clazz_list;
                let clazzIndex = clazzList.findIndex((value)=>{
                    return value.id == param.id;
                }) ;
                clazzList[clazzIndex].status = param.status;
                clazzList[clazzIndex].openStatus = openStatus;
                dispatch({type:TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS, payload:clazzList});
                defer.resolve(true);
            });
            return defer.promise;
        }
    }

    /**
     * 获取学生信息详情
     * @param param
     * @returns {function(*)}
     */
    @actionCreator
    getStudentInfo(param) {
        return(dispatch)=>{
            var defer = this.$q.defer();
            dispatch({type:FETCH_STUDENT_DETAIL_START});
            this.commonService.commonPost(this.serverInterface.GET_STU_INFO, param).then(data=>{
                if (data.code!=200) {
                    defer.resolve(data);
                    dispatch({type:FETCH_STUDENT_DETAIL_FAIL});
                    return
                }
                defer.resolve(data);
                dispatch({type:FETCH_STUDENT_DETAIL_SUCCESS,payload:data});
            });
            return defer.promise;
        }
    }

    /**
     * 删除学生
     * @param param
     */
    @actionCreator
    deleteStudent(param) {
        return(dispatch,getState)=>{
            var defer = this.$q.defer();
            dispatch({type:DELETE_STUDENT_START});
            this.commonService.commonPost(this.serverInterface.DELETE_STUDENT, param).then(data=>{
                if (data.code!=200) {
                    defer.resolve(data);
                    dispatch({type:DELETE_STUDENT_FAIL});
                    return
                }
                //更新classList
                let clazzList = getState().clazz_list.map((value) =>{return _assign({},value)});
                clazzList.forEach(function (clazz) {
                    if(clazz.id == param.classId){
                        clazz.checkedNum-=1; //班级人数减1
                    }
                });
                dispatch({type:CHANGE_CLAZZ_LIST_INFO,payload:clazzList});
                defer.resolve(data);
                dispatch({type:DELETE_STUDENT_SUCCESS});
            });
            return defer.promise;
        }
    }

    /**
     * 设置是否是添加学生
     * @param param
     */
    @actionCreator
    setAddStuStatus (param){
        return (dispatch)=>{
            dispatch({type:SET_ADD_CLAZZ_STATUS,payload:param});
        };
    }

    getStuImg(gender){
        var imgUrl = gender==0?'person/student-f.png':'person/student-m.png';
        return require('modules/t_boot/tImages/' + imgUrl);
    }

    getParentImg(gender){
        var imgUrl = gender==0?'person/parent-f.png':'person/parent-m.png';
        return require('modules/t_boot/tImages/' + imgUrl);
    }

    @actionCreator
    setOpenStatus(){
        return (dispatch,getState)=>{
            let clazzList = getState().clazz_list.map((value) =>{return _assign({},value)});
            clazzList.forEach(function (clazz) {
                var openStatus = {
                    open: clazz.status == 1 ,
                    close: clazz.status == 0 || clazz.status == 2
                };
                clazz.openStatus = openStatus;
            });

            dispatch({type:CHANGE_CLAZZ_LIST_INFO ,payload:clazzList});
        };
    }

    getTextBook(){
        return this.commonService.commonPost(this.serverInterface.GET_BOOKS_V2, {categories:'normal'});
    }

    tCanCreateClass() {
        var defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.T_CAN_CREATE_CLASS).then((res)=> {
            defer.resolve(res);
        });
        return defer.promise;
    }
}

export default ClazzService

