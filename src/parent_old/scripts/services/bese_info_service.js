/**
 * Created by 邓小龙 on 2015/7/31.
 * @description 基本信息维护的service
 * 华海川（重构） 2015/10/8
 */
define(['./index'], function (services) {
    services.service('baseInfoService', ['$q', '$http', 'serverInterface', 'commonService','workStatisticsServices',
        function ($q, $http, serverInterface, commonService,workStatisticsServices) {
            var me=this;
            this.qList = [];  //展示的密保问题
            this.qBackList = []; //剩余密保问题
            this.baseInfo = {
                name: '家长',
                gender: '',
                tel: ''
            };
            this.secondP={
                first:true
            };//第二监护人对象
            /**
             * 保存基本信息
             * @param realName 真实姓名
             * @param gender   性别
             * @returns promise
             */
            this.saveBaseInfo = function () {
                var baseInfo = angular.copy(this.baseInfo);
                delete  baseInfo.tel;
                return commonService.commonPost(serverInterface.SAVE_BASE_INFO, baseInfo);
            };

            /**
             * 获取基本信息
             */
            this.getBaseInfo = function () {
                var defer = $q.defer();
                var me = this;
                commonService.commonPost(serverInterface.GET_BASE_INFO).then(function (data) {
                    if (!data) {
                        defer.resolve(false);
                        return;
                    }
                    // me.baseInfo.name = data.name ;
                    me.baseInfo.name = '家长'; //暴力隐藏已注册家长的姓名
                    me.baseInfo.tel = data.tel;
                    me.baseInfo.gender = data.gender;
                    debugger;
                    defer.resolve(true);
                });
                return defer.promise;
            };

            /**
             * 获取密保信息
             */
            this.getPwProQuestion = function (param) {
                var defer = $q.defer();
                var me = this;
                me.qList.length = 0;
                me.qBackList.length = 0;
                commonService.commonPost(serverInterface.GET_PW_PRO_QUESTION, param).then(function (data) {
                    if (!data) {
                        defer.resolve(false);
                        return;
                    }
                    if(data&&data.length>0){
                        data.forEach(function (item, index) {
                            var info = {};
                            info.question = item;
                            info.num = commonService.convertToChinese(index + 1);
                            info.answer = '';
                            if (index > 2) {
                                me.qBackList.push(info);
                                return;
                            }
                            me.qList.push(info);
                        });
                    }
                    defer.resolve(true);
                    return;
                });
                return defer.promise;
            };

            /**
             * 获取第二监护人信息
             */
            this.getSecondPInfo=function(){
                var defer = $q.defer();
                var me = this;
                commonService.commonPost(serverInterface.GET_SECOND_P_INFO).then(function (data) {
                    if (!data) {
                        defer.resolve(false);
                        return;
                    }
                    if(data.guardians && data.guardians.length!=0){
                        me.secondP.id = data.guardians[0].id;
                        me.secondP.loginName = data.guardians[0].loginName;
                        me.secondP.secondPhone = data.guardians[0].telephone;
                        // me.secondP.secondName = data.guardians[0].name;
                        me.secondP.secondName = workStatisticsServices.pubWorkStudent.name + '家长';
                        me.secondP.secondGender = data.guardians[0].gender;
                        // me.secondP.secondRelationShip = data.guardians[0].relation;
                        me.secondP.secondGenderShow=me.secondP.secondGender==0?'女':'男';
                        me.secondP.secondRelationShip = me.secondP.secondGender; //暴力隐藏监护人关系，男的就为爸，女的就为妈
                        me.secondP.secondRelationShipShow=handleRelationShip(me.secondP.secondRelationShip);
                        me.secondP.first=false;
                        defer.resolve(true);
                    }
                });
                return defer.promise;
            };

            function handleRelationShip(relation){
                relation=relation+"";
                var ret="";
                switch (relation){
                    case '0':
                        ret='父亲';
                        break;
                    case '1':
                        ret='母亲';
                        break;
                    case '2':
                        ret='爷爷';
                        break;
                    case '3':
                        ret='奶奶';
                        break;
                    case '4':
                        ret='外公';
                        break;
                    case '5':
                        ret='外婆';
                        break;
                    default :
                        ret="其他";
                        break;
                }
                return ret;
            }

            /**
             * 保存密保答案
             * @param param
             */
            this.savePwProQuestion = function () {
                var passwordProtection = angular.copy(this.qList); //填写密保后的列表
                delete passwordProtection.num;
                var param = {
                    passwordProtection: JSON.stringify(passwordProtection)
                };
                return commonService.commonPost(serverInterface.SAVE_PW_PRO_QUESTION, param);
            }

            /**
             * 保存关联手机号码
             * @param param
             */
            this.resetTelephone=function(param){
                return commonService.commonPost(serverInterface.RESET_TELEPHONE,param);
            }

            /**
             * 验证密保信息
             * @param param
             */
            this.checkPwProQuestion = function (loginName) {
                var passwordProtection = angular.copy(this.qList); //填写密保后的列表
                delete passwordProtection.num;
                var param = {
                    loginName: loginName,
                    passwordProtection: JSON.stringify(passwordProtection)
                };
                return commonService.commonPost(serverInterface.CHECK_PW_PRO_QUESTION, param);
            }

            /**
             * 保存第二监护人信息
             * @returns promise
             */
            this.saveSecondP = function () {
                var secondGender=me.secondP.secondGender==true?1:0;
                var param={
                    gender:secondGender,
                    relationShip:me.secondP.secondRelationShip,
                    name:me.secondP.secondName ||'家长2',
                    password:me.secondP.secondPassword,
                    telephone:me.secondP.secondPhone,
                    confirmPassword:me.secondP.confirmPass
                };
                commonService.commonPost(serverInterface.SAVE_SECOND_P, param).then(function(data){
                    if(data&&data.code==200){
                        commonService.alertDialog('设置成功', 1500);
                        me.secondP.first=false;
                        me.secondP.loginName=data.guardian.loginName;
                        me.secondP.secondGenderShow=me.secondP.secondGender==0?'女':'男';
                        me.secondP.secondRelationShipShow=handleRelationShip(me.secondP.secondRelationShip);
                        me.secondP.id = data.guardian.id;
                        return ;
                    }
                    if(data&&data.code==700){
                        commonService.showAlert('提示', '<p>' + data.msg + '</p>');
                        return;
                    }
                    commonService.showAlert('提示', '<p>' + data.msg + '</p>');


                });
            };

            this.clearSecondPData=function(){
                this.secondP={
                    first:true
                };//第二监护人对象
            }
            /*
            * 删除第二监护人
            * */
            this.delSecond = (tel) => {
                return commonService.commonPost(serverInterface.DELETE_SECOND_P, tel) 
            }
        }]);
});
