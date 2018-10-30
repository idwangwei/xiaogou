/**
 * Created by 彭建伦 on 2016/6/12.
 * 教研群相关操作的service
 */
import {Service, Inject, actionCreator} from '../module';
@Service('teachingGroupService')
@Inject('$q', 'commonService', 'teacherGroupInterface')
class teachingGroupService {
    $q;
    commonService;
    teacherGroupInterface;

    serviceData = {
        TGroupsOfAdmin: null,
        catchGroups: [],
        schoolDetail: null
    };
    IS_SCHOOL_TYPE = 4;

    /**
     * 教研员获取所有的教研群
     * @returns {*[]}
     */
    getTeachingGroupListOfAdmin(callBack) {
        callBack = callBack || angular.noop;
        this.serviceData.TGroupsOfAdmin = [];
        this.commonService.commonPost(this.teacherGroupInterface.GET_T_GROUP_LIST).then((res)=> {
            if (res.code == 200) {
                res.groups.forEach((v)=> {
                    v.childViewDistricts = v.ViewDistricts;
                });

                this.serviceData.TGroupsOfAdmin = res.groups;
                this.serviceData.catchGroups = [res.groups];
                callBack(true);
            } else {
                callBack(false);
            }
        });
    }

    getTeachingGroupListOfAdminDetail(param, callBack) {
        callBack = callBack || angular.noop;
        if (param.areaType === this.IS_SCHOOL_TYPE) {
            this.serviceData.schoolDetail = null;
        }
        this.commonService.commonPost(this.teacherGroupInterface.GET_T_GROUP_DETAIL, param).then((res)=> {
            if (res.code == 200 && param.areaType !== this.IS_SCHOOL_TYPE) {
                this.serviceData.TGroupsOfAdmin = res.childViewDistricts;
                this.serviceData.catchGroups[param.areaType] = res.childViewDistricts;

                callBack(true);
            }
            else if (res.code == 200 && param.areaType === this.IS_SCHOOL_TYPE) {
                res.childViewDistricts.forEach((cvd)=> {
                    cvd.grades && cvd.grades.forEach((grade)=> {
                        // grade.text = `（${grade.teachers.length}名老师 学生${grade.studentCount}人 活跃${grade.quantityOfPlanA + grade.quantityOfPlanB}人）`;
                        grade.text = `（${grade.teachers.length}名老师 学生${grade.studentCount}人）`;

                        grade.teachers && grade.teachers.forEach((teacher)=> {
                            // teacher.text = `（学生${teacher.studentCount}人 活跃${teacher.quantityOfPlanA + teacher.quantityOfPlanB}人）`;
                            teacher.text = `（学生${teacher.studentCount}人）`;

                            teacher.classes && teacher.classes.forEach((clazz)=> {
                                // clazz.text = `（学生${clazz.studentCount}人 活跃${clazz.quantityOfPlanA + clazz.quantityOfPlanB}人）`;
                                clazz.text = `（学生${clazz.studentCount}人）`;
                            });
                        })
                    });

                });

                this.serviceData.schoolDetail = res.childViewDistricts && res.childViewDistricts[0];
                callBack(true);
            }
            else {
                callBack(false);
            }
        });
    }


    /**
     * 设置教研圈的申请状态
     * @param param
     */
    setGroupApplication(param) {
        this.commonService.commonPost(this.teacherGroupInterface.UPDATE_GROUP_STATUS, param).then((res)=> {
        });
    }

    /**
     * 获取正在申请的老师对应的学校列表
     * @returns {*[]}
     */
    getApplicationSchoolList(param) {
        this.serviceData.applicationSchoolList = null;
        this.commonService.commonPost(this.teacherGroupInterface.GET_APPLICATION_SCHOOL_LIST, param).then((res)=> {
            if (res.code == 200) {
                this.serviceData.applicationSchoolList = res.schools;
            }
        });
    }

    /**
     * 获取某个学校正在申请的老师列表
     * @param param
     */
    getApplicationTeacherList(param) {
        this.serviceData.applicationTeacherList = null;
        this.commonService.commonPost(this.teacherGroupInterface.GET_APPLICATION_TEACHER_LIST, param).then((res)=> {
            if (res.code == 200) {
                angular.forEach(res.teachers, function (grade) {
                    angular.forEach(grade.teachers, function (teacher) {
                        teacher.teacherMessage = decodeURI(teacher.teacherMessage);
                        if (teacher.teacherMessage == "undefined" || teacher.teacherMessage == "null") {
                            teacher.teacherMessage = "";
                        }
                    });
                });
                this.serviceData.applicationTeacherList = res.teachers;
            }
        });
    }

    /**
     * 批准或者拒绝申请
     * @param param
     */
    acceptOrRejectApplication(param) {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.teacherGroupInterface.ACCEPT_OR_REJECT_APPLICATION, param).then((res)=> {
            if (res.code == 200)
                defer.resolve(true);
            else
                defer.resolve(false);
        });
        return defer.promise;
    }

    /**
     * 获取
     * @param param
     */
    getPassedSchoolList(param) {
        let defer = this.$q.defer();
        this.serviceData.passedSchoolList = null;
        this.commonService.commonPost(this.teacherGroupInterface.GET_PASSED_SCHOOL_LIST, param).then((res)=> {
            if (res.code == 200) {
                this.serviceData.passedSchoolList = res.schools;
            }
            defer.resolve(true);
        });
        return defer.promise;
    }

    /**
     * 获取已经通过审核的教师列表
     */
    getPassedTeacherList(params) {
        this.serviceData.passedTeacherList = null;
        this.commonService.commonPost(this.teacherGroupInterface.GET_PASSED_TEACHER_LIST, params).then((res)=> {
            if (res.code == 200) {
                this.serviceData.passedTeacherList = res.teachers;
            }
        });
        /* return [
         {
         grade: "一年级",
         teacherList: [
         {
         teacherName: "张三",
         teacherId: "",
         clazzList: [
         {
         clazzId: "",
         clazzName: "志宏班",
         studentNumber: 10
         }
         ]
         },
         {
         teacherName: "张三",
         teacherId: "",
         clazzList: [
         {
         clazzId: "",
         clazzName: "志宏班",
         studentNumber: 10
         }
         ]
         }, {
         teacherName: "张三",
         teacherId: "",
         clazzList: [
         {
         clazzId: "",
         clazzName: "志宏班",
         studentNumber: 10
         }
         ]
         }
         ]
         }, {
         grade: "二年级",
         teacherList: [
         {
         teacherName: "张三",
         teacherId: "",
         clazzList: [
         {
         clazzId: "",
         clazzName: "志宏班",
         studentNumber: 10
         }
         ]
         },
         {
         teacherName: "张三",
         teacherId: "",
         clazzList: [
         {
         clazzId: "",
         clazzName: "志宏班",
         studentNumber: 10
         }
         ]
         }, {
         teacherName: "张三",
         teacherId: "",
         clazzList: [
         {
         clazzId: "",
         clazzName: "志宏班",
         studentNumber: 10
         }
         ]
         }
         ]
         }
         ]*/
    }

    /**
     * 根据群组ID查询所有认证通过的教师
     * @param groupId
     */
    getGroupTeacherList(groupId) {
        return [
            {name: '张三', gender: 1, school: '成都市盐道街小学'},
            {name: '李四', gender: 0, school: '成都龙江路小学'},
            {name: '李四', gender: 0, school: '成都龙江路小学'},
            {name: '李四', gender: 1, school: '成都龙江路小学'},
            {name: '李四', gender: 0, school: '成都龙江路小学'},
            {name: '李四', gender: 1, school: '成都龙江路小学'},
            {name: '李四', gender: 0, school: '成都龙江路小学'},
            {name: '李四', gender: 1, school: '成都龙江路小学'}
        ]
    }

    /**
     * 获取某个老师的教学群列表
     */
    getTGroupList() {
        var defer = this.$q.defer();
        this.commonService.commonPost(this.teacherGroupInterface.GET_TEACHER_GROUP).then((res)=> {
            defer.resolve(res);
        });
        return defer.promise;
    }

    /**
     * 根据教研群号获取该群的详细信息
     */
    getTGroupInfo(groupId) {
        var defer = this.$q.defer();
        this.commonService.commonPost(this.teacherGroupInterface.GET_T_GROUP_INFO, {groupId: groupId}).then((res)=> {
            defer.resolve(res);
        }, (res)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }

    tCanCreateClass() {
        var defer = this.$q.defer();
        this.commonService.commonPost(this.teacherGroupInterface.T_CAN_CREATE_CLASS).then((res)=> {
            defer.resolve(res);
        });
        return defer.promise;
    }


    /**
     * 申请加入教学群
     * @param param
     */
    submitTGroupApplication(param) {
        var defer = this.$q.defer();
        this.commonService.commonPost(this.teacherGroupInterface.SUBMIT_T_GROUP_APPLICATION, param).then((res)=> {
            defer.resolve(res);
        });
        return defer.promise;
    }

    /**
     * 退出教研圈
     */
    removeTeacherFromTGroup(param) {
        var defer = this.$q.defer();
        this.commonService.commonPost(this.teacherGroupInterface.REMOVE_TEACHER_FROM_T_GROUP, param).then((res)=> {
            defer.resolve(res);
        });
        return defer.promise;
    }


}

export default teachingGroupService;