/**
 * Created by WangLu on 2017/3/4.
 */
import BaseService from 'baseComponentForT/base_service';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {OM_CLAZZ_MANAGER}  from './../redux/action_typs';
import _assign from 'lodash.assign';
import _values from 'lodash.values';
import _find from 'lodash.find';
import _each from 'lodash.foreach';
@Inject ( '$http', '$q', '$rootScope',  'serverInterface', 'commonService', "$ngRedux")


class OmClazzService extends BaseService {
    serverInterface;
    commonService;
    $q;
    $http;
    Students = {};
    selectedClazzParam = '';
    studentParam = {stuId: '', clazzId: '', stuNum: 0, listType: ''};
    olympiad_math = {
        type: '200',
        text_book: 'AS-奥数',
    };

    constructor() {
        super(arguments);
    }

    /**
     * @description 获取教师创建的奥数班级列表
     */
    @actionCreator
    getClazzList() {
        return (dispatch,getState)=> {
            let defer = this.$q.defer();
            let user = getState().profile_user_auth.user;
            //dispatch({type:FETCH_CLAZZ_LIST_START});
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
                        //dispatch({type:MODIFY_USER_VISITOR, payload:{visitor:1}});
                    }
                    //dispatch({type:FETCH_CLAZZ_LIST_SUCCESS ,payload:{ clazzList:data.classes}});
                } else {
                    defer.resolve(false);
                    //dispatch({type:FETCH_CLAZZ_LIST_FAIL});
                }
            });
            return defer.promise;
        }
    }


    /**
     * 切换班级申请状态
     * @param clazzId 班级id
     */
    @actionCreator
    toggleClazzApplyTunnel(param,openStatus) {
        return (dispatch,getState)=>{
            var detail = [];
            detail.push(param);
            var defer = this.$q.defer();
            dispatch({type:OM_CLAZZ_MANAGER.OM_TOGGLE_CLAZZ_APPLY_TUNNEL_START});
            this.commonService.commonPost(this.serverInterface.SET_CLAZZ_STATUS, {details: JSON.stringify(detail)}).then((data)=> {
                if (!data) {
                    defer.resolve(false);
                    dispatch({type:OM_CLAZZ_MANAGER.OM_TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL});
                    return;
                }

                //获取该班级在班级列表中的下标
                var om_clazzList = getState().mo_clazz_list;
                let clazzIndex = om_clazzList.findIndex((value)=>{
                    return value.id == param.id;
                }) ;
                om_clazzList[clazzIndex].status = param.status;
                om_clazzList[clazzIndex].openStatus = openStatus;
                dispatch({type:OM_CLAZZ_MANAGER.OM_TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS, payload:om_clazzList});
                defer.resolve(true);
            });
            return defer.promise;
        }
    }

    /**
     * @description 获取班级详细信息
     * @param id
     */
    @actionCreator
    getClazzInfo(id) {
        return (dispatch)=> {
            //dispatch({type:CHANGE_SELECT_CLAZZ_DETAIL_START});
            var defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.GET_CLAZZ_INFO, id).then((data)=>{
                if (data.code == 200) {
                    this.selectedClazzParam = data.clazz;
                    defer.resolve(data);
                    //dispatch({type:CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS ,payload:data.clazz});
                } else {
                    defer.resolve(data);
                    //dispatch({type:CHANGE_SELECT_CLAZZ_DETAIL_FAIL});
                }
            });
            return defer.promise;
        }
    }


    /**
     * 根据班级id获取班级学生
     * @param id班级id
     */
    @actionCreator
    getStuList(param) {
        return(dispatch)=>{
            var defer = this.$q.defer();
            dispatch({type:OM_CLAZZ_MANAGER.OM_GET_ADD_STU_LIST_START});
            this.commonService.commonPost(this.serverInterface.GET_LETTER_STUDENT_LIST, param).then(data=>{
                if (!data) {
                    defer.resolve(false);
                    dispatch({type:OM_CLAZZ_MANAGER.OM_GET_ADD_STU_LIST_FAIL});
                    return
                }
                try{
                    for(var prop in data.records){
                        if(data.records.hasOwnProperty(prop)){
                            let experienceCountIndex,experienceCountItem;

                            //处理所有的学生是否已激活奥数
                            _each(data.records[prop],(stu, index)=>{
                                //解析学生开通奥数的状态
                                if(stu.vips && stu.vips.mathematicalOlympiad){
                                    stu.activation = !!_find(_values(stu.vips.mathematicalOlympiad),(item)=>{return item > -1});
                                }
                                //登录名没有*表示该账号是老师一键注册的体验账号，与普通学生账号区分
                                if(stu.loginName.indexOf('*') === -1){
                                    experienceCountIndex = index;
                                    experienceCountItem = stu;
                                }
                            });

                            //将体验账号放在数组的第一位
                            if(experienceCountIndex !== undefined && experienceCountItem){
                                data.records[prop].splice(experienceCountIndex, 1);
                                data.records[prop].unshift(experienceCountItem);
                            }
                        }
                    }
                }catch(err){
                    console.error('学生列表： ', err)
                }
                defer.resolve(true);
                dispatch({type:OM_CLAZZ_MANAGER.OM_GET_ADD_STU_LIST_SUCCESS,payload:data.records});
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
            var student = getState().om_cm_added_stu_list[letter][$index];
            var param = {
                relId: student.cRelId,
                level: student.level
            };
            var defer = this.$q.defer();
            dispatch({type:OM_CLAZZ_MANAGER.OM_CHANGE_STU_LIST_LEVEL_START});
            this.commonService.commonPost(this.serverInterface.LEVEL_CHANGE, param).then(data=>{
                if (data.code != 200) {
                    dispatch({type:OM_CLAZZ_MANAGER.OM_CHANGE_STU_LIST_LEVEL_FAIL});
                    defer.resolve(false);
                    return
                }

                let stuList = _assign({},getState().om_cm_added_stu_list);
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

                dispatch({type:OM_CLAZZ_MANAGER.OM_CHANGE_STU_LIST_LEVEL_SUCCESS,payload:newList});
                defer.resolve(true);
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
            dispatch({type:OM_CLAZZ_MANAGER.OM_DELETE_STU_START});
            this.commonService.commonPost(this.serverInterface.DELETE_STUDENT, param).then(data=>{
                if (data.code!=200) {
                    defer.resolve(data);
                    dispatch({type:OM_CLAZZ_MANAGER.OM_DELETE_STU_FAIL});
                    return
                }
                //更新classList
                let clazzList = getState().mo_clazz_list.map((value) =>{return _assign({},value)});
                clazzList.forEach(function (clazz) {
                    if(clazz.id == param.classId){
                        clazz.checkedNum-=1; //班级人数减1
                    }
                });
                defer.resolve(data);
                dispatch({type:OM_CLAZZ_MANAGER.OM_DELETE_STU_SUCCESS,payload:clazzList}); //TODO
            });
            return defer.promise;
        }
    }

    /**
     * @description 添加班级
     * @param classData
     * @param nameInfo
     */
    @actionCreator
    addClazz(classData,nameInfo) {
        return (dispatch,getState)=> {
            dispatch({type:OM_CLAZZ_MANAGER.OM_ADD_CLAZZ_START});
            var defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.ADD_CLAZZ, classData).then((data)=>{
                if (data.code == 200) {
                    let clazzList = getState().mo_clazz_list.map((value) =>{return _assign({},value)});
                    let clazzInfo = data.class;
                    clazzInfo = _assign(clazzInfo,nameInfo);
                    clazzInfo.openStatus = {};
                    clazzInfo.openStatus.open = clazzInfo.status == 1;
                    clazzInfo.openStatus.close = clazzInfo.status == 0 || clazzInfo.status == 2;
                    clazzList.push(clazzInfo);
                    dispatch({type:OM_CLAZZ_MANAGER.OM_ADD_CLAZZ_SUCCESS ,payload:clazzList});
                    defer.resolve(data);
                } else {
                    dispatch({type:OM_CLAZZ_MANAGER.OM_ADD_CLAZZ_FAIL});
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
            dispatch({type:OM_CLAZZ_MANAGER.OM_EDIT_CLAZZ_START});
            var defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.UPDATE_CLAZZ, classData).then((data)=>{
                if (data.code == 200) {
                    defer.resolve(data);
                    let clazzList = getState().mo_clazz_list.map((value) =>{return _assign({},value)});
                    clazzList.forEach(function (clazz) {
                        if(clazz.id == data.class.id){
                            clazz = _assign(clazz,data.class);
                            clazz = _assign(clazz,nameInfo);
                        }
                    });
                    dispatch({type:OM_CLAZZ_MANAGER.OM_EDIT_CLAZZ_SUCCESS ,payload:clazzList});
                } else {
                    defer.resolve(data);
                    dispatch({type:OM_CLAZZ_MANAGER.OM_EDIT_CLAZZ_FAIL});
                }
            });
            return defer.promise;
        }
    }

}

export default OmClazzService

