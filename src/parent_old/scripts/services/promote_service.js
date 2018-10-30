/**
 * Created by WangLu on 2017/1/11.
 */

define(['./index'], function (services) {
    services.service('promoteService', ['$rootScope','$http', '$q', '$log', 'serverInterface', 'commonService',
        function ($rootScope,$http, $q, $log, serverInterface, commonService) {
            // this.isAgencyFlag = false; //是否是代理
            // this.canApplyAgency = false;
            this.agencyFlag = {
                isAgency:false,
                canApplyAgency:false
            };

            this.selectedPersonInfo = {};
            this.personDirectPagePosition = 0;
            this.directData = {

            };
            this.indirectData = {

            };

            /**
             * 判断用户是不是代理
             * @param userId
             * @returns {promise}
             */
            this.getPersonIsExtensionnerFlag = function (userId) {
                var defer = $q.defer();
                // var me = this;
                this.setAnencyFlag(false);
                this.setCanApplyFlag(false);
                commonService.commonPost(serverInterface.GET_IS_EXTENSIONNER_FLAG,{userId:userId})
                    .then(data=>{
                        if(data.code == 200){ //是200就是代理
                            if(data.state == 3){
                                this.setCanApplyFlag(true);
                            }
                            if(data.state == 1){
                                this.setAnencyFlag(true);
                            }

                            defer.resolve(data);
                            return;
                        }
                        defer.resolve(data);
                    });
                return defer.promise;
            };

            /**
             * 判断判断家长是不是老师
             * @param userId
             * @returns {promise}
             */
            this.canParentPromote = function (userId) {
                var defer = $q.defer();
                me = this;
                commonService.commonPost(serverInterface.GET_PARENT_IS_TEACHER_FLAG,{userId:userId})
                    .then(data=>{
                        if(data.code == 200){ //200 才能申请代理
                            me.setCanApplyFlag(true);
                            defer.resolve(data);
                            return;
                        }
                        commonService.alertDialog(data.msg || "网络连接不畅，重稍后再试...",1200);
                        me.setCanApplyFlag(false);
                        defer.resolve(data);
                });
                return defer.promise;
            };


            /**
             * 获取代理详细信息
             * @param userId
             * @returns {promise}
             */
            this.getPromoteDetails = function (userId) {
                return commonService.commonPost(serverInterface.GET_PROMOTE_DETAILS, {userId:userId});
            };

            this.getXlyPromoteDetails = function (param) {
                return commonService.commonPost(serverInterface.GET_XLY_VIP_AGENT_PAY_LIST, param);
            };

            /**
             * 申请成为代理
             * @param userId
             * @returns {*}
             */
            this.applyForAgency = function (userId) {
                var defer = $q.defer();
                var me = this;
                commonService.commonPost(serverInterface.APPLY_FOR_AGENCY,{userId:userId})
                    .then(data=>{
                        if(data.code == 200){ //是200表示申请成功，是代理
                            me.setAnencyFlag(true);
                            defer.resolve(true);
                            return;
                        }
                        me.setAnencyFlag(false);
                        defer.resolve(false);
                    });
                return defer.promise;
            };

            /**
             * 查询直接推广人或间接推广人详情
             * @param userId
             * @param page
             * @returns {promise}
             */
            this.getPromotePersonList = function (userId,page) {
                return commonService.commonPost(serverInterface.GET_MYSELF_PROMOTE_PERSON, {uId:userId,page:page});
            };


            /**
             * 根据账号查找用户详情
             * @param personId
             * @returns {promise}
             */
            this.queryPersonDetails= function (personId) {
                return commonService.commonPost(serverInterface.GET_OTHER_PERSON_PROMOTE_DETAILS, {account:personId});
            };

            this.setAnencyFlag = function (flag) {
                this.agencyFlag.isAgency = flag;
            };

            this.setCanApplyFlag = function (flag) {
                this.agencyFlag.canApplyAgency = flag;
            };

            /**
             *
             * @param person
             */
            this.setSelectPerson = function (person) {
                this.selectedPersonInfo = person;
            };

        }]);
});