/**
 * Created by 彭建伦 on 2015/7/28.
 */
define(['./index'], function (services) {
    services.service('studentService', ['$rootScope','$http', '$q', '$log', 'serverInterface', 'commonService', 'jPushManager',
        function ($rootScope,$http, $q, $log, serverInterface, commonService, jPushManager) {
            this.studentInfo = {  //学生信息
                name: '',
                password: '',
                confirmPassword: '',
                gender: '',
                relationShip: ''
            };
            this.studentList = []; //学生列表
            this.clazzList = [];    //班级列表
            this.clazzInfo = {};    //班级详情
            this.selectedClazz=null;//选中的班级
            this.clearStuInfo = function () { //清空学生信息
                this.studentInfo = {
                    name: '',
                    password: '',
                    confirmPassword: '',
                    gender: '',
                    relationShip: ''
                };
            };



            /**
             * 修改学生需要传递的参数
             */
            this.stueditParam = {};

            /**
             * 设置修改学生需要传递的参数
             */
            this.setStuEditParam = function (param) {
                this.stueditParam = param;
            }

            /**
             * 获取修改学生需要传递的参数
             */
            this.getStuEditParam = function () {
                return this.stueditParam;
            }
            /**
             * 获取家长对应学生列表
             */
            this.getStudentList = function () {
                var defer = $q.defer();
                var me = this;
                me.studentList.length = 0;
                commonService.commonPost(serverInterface.GET_STUDENT_LIST).then(function (data) {
                    if (!data) {
                        defer.resolve(false);
                        return;
                    }
                    data.students.forEach(function (item) {
                        item.isClicked=false;
                        me.studentList.push(item);
                    });
                    defer.resolve(true);
                });
                return defer.promise;
            };


            /**
             * 更新rootScope的学生信息
             * @param studentList
             */
            this.updateStuClasses = function () {
                commonService.commonPost(serverInterface.P_GET_STU_AND_CLASS).then(function (data) {
                    $rootScope.student=$rootScope.student||[];
                    $rootScope.student.splice(0,$rootScope.student.length);
                    if (data.code == 200 && data.students.length > 0) {
                        var notPassedClassFlag=false;
                        angular.forEach(data.students,function (stu) {
                            stu.passedClazzList=[];
                            stu.notPassedClazzList=[];
                            stu.normalClazzList = [];
                            stu.selfStudyClazzList = [];
                            stu.olyMathClazzList = [];
                            angular.forEach(stu.classes,function(stuClass){
                                if (stuClass.status == 0) {//审核中的
                                    stu.notPassedClazzList.push(stuClass);
                                }
                                if(stuClass.status==1){//审核通过的
                                    stu.passedClazzList.push(stuClass);
                                }
                                if(stuClass.type === 900) stu.selfStudyClazzList.push(stuClass);
                                if(stuClass.type === 100) stu.normalClazzList.push(stuClass);
                                if(stuClass.type === 200) stu.olyMathClazzList.push(stuClass);

                            });
                            if(stu.notPassedClazzList.length>0){
                                notPassedClassFlag=true;
                            }
                            var stuClazzStatus=commonService.checkStuClazzStatus(stu.classes,stu.notPassedClazzList,stu.passedClazzList);
                            $rootScope.student.push({
                                studentId: stu.id,
                                studentName: stu.name,
                                clazzList:stu.normalClazzList,
                                allClazzList:stu.normalClazzList.concat(stu.olyMathClazzList),
                                selfStudyClazzList: stu.selfStudyClazzList,
                                passedClazzList: stu.classes,
                                stuClazzStatus:stuClazzStatus
                            });
                        });
                    }
                });
            };


            /**
             * 根据学生的id删除该学生
             * @param sid 学生id
             * @returns {*}
             */
            this.pDelete = function (sid) {
                var param = {
                    id: sid
                };
                return commonService.commonPost(serverInterface.DEL_STUDENT_BY_ID, param);
            };

            /**
             * 家长查询到该子女所参加的班级列表信息
             * @param formData
             * @returns {*}
             */
            this.pGetStuClasses = function (id) {
                var param = {
                    id: id
                };
                var defer = $q.defer();
                var me = this;
                me.clazzList.length = 0;
                commonService.commonPost(serverInterface.P_GET_STU_CLASS, param).then(function (data) {
                    if (!data) {
                        defer.resolve(false);
                        return;
                    }
                    data.classes.forEach(function (item) {
                        me.clazzList.push(item);
                    });
                    defer.resolve(true);
                });
                return defer.promise;
            }
            /**
             * 家长真实删除学生班级
             * @param sid 学生id
             * @param classId 班级id
             * @returns promise
             */
            this.pDelStuClass = function (sid, classId) {
                var param = {
                    studentId: sid,
                    classId: classId
                };
                return commonService.commonPost(serverInterface.P_DEL_STU_CLASS, param);
            }
            /**
             * 家长查询班级ID的班级基本内容
             * @param cid 班级id
             * @returns {*}
             */
            this.getClassInfo = function (cid) {
                var param = {
                    id: cid
                };
                var defered = $q.defer();
                var me = this;
                commonService.commonPost(serverInterface.GET_CLASS_INFO, param).then(function (data) {
                    if (!data) {
                        defered.resolve(false);
                        return;
                    }
                    me.clazzInfo.name = data.clazz.name;
                    me.clazzInfo.gradeName = data.clazz.gradeName;
                    me.clazzInfo.provinceName = data.clazz.provinceName;
                    me.clazzInfo.cityName = data.clazz.cityName;
                    me.clazzInfo.districtName = data.clazz.districtName;
                    me.clazzInfo.schoolName = data.clazz.schoolName;
                    me.clazzInfo.className = data.clazz.className;
                    me.clazzInfo.teacher = data.clazz.teacher;
                    me.clazzInfo.studentCount = data.clazz.studentCount;
                    me.clazzInfo.type = data.clazz.type;
                    defered.resolve(true);
                });
                return defered.promise;
            }

            /**
             * 申请加入班级
             * @param  formData 表单数据
             * @returns  promise
             */
            this.sendAddClassApply = function (formData) {
                var param = {
                    studentId: formData.sid,
                    classId: formData.classNumber
                };
                if(formData.force){              //有相同姓名需要带的参数
                    param.force=formData.force;
                }
                return commonService.commonPost(serverInterface.SEND_ADD_CLASS_APPLY, param);
            }
            /**
             * 家长给student注册
             * @param formData 注册的表单数据
             * @returns promise
             */
            this.registerStudent = function () {
                var params = angular.copy(this.studentInfo);
                params.gender=params.gender==true?1:0;
                delete params.vCode;
                return commonService.commonPost(serverInterface.REGISTER_STUDENT, params);
            }
            /**
             * 家长修改学生
             * @param formData 表单数据
             * @returns promise
             */
            this.editStudent = function (formData) {
                var param = {
                    id: formData.id,
                    name: formData.studentName,
                    gender: formData.gender,
                    relationShip: formData.relationShip
                };
                return commonService.commonPost(serverInterface.EDIT_STUDENT_BY_ID, param);
            };

            this.resetPwd = function (loginName, password) {
                var pramas = {
                    loginName: loginName,
                    password: password
                }

                return commonService.commonPost(serverInterface.RESET_PWD, pramas);
            }
        }]);
});