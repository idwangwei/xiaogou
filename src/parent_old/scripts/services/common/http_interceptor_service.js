/**
 * Created by 彭建伦 on 2015/7/28.
 */
define(['./../index'], function (services) {
    services.factory('httpInterceptor', ['$q', '$rootScope', 'serverInterface', '$injector', '$location','finalData',
        function ($q, $rootScope, serverInterface, $injector, $location,finalData) {
            return {
                request: function (config) {
                    var deferred = $q.defer();
                    if (config.url.indexOf(serverInterface.BASE) != -1 && config.url.indexOf('jsessionid') == -1) { //拦截向后端发起的http请求，在请求的URL后面加上jsessionid
                        if(config.url.indexOf(finalData.BUSINESS_TYPE.QBU_S)>-1&&$rootScope.user.userId){//与班级无关的业务，如诊断,加上userId
                            config.url=config.url+'?shardingId='+$rootScope.user.userId+'&businessType='+finalData.BUSINESS_TYPE.QBU_S;
                        }else if(config.url.indexOf(finalData.BUSINESS_TYPE.QBU)>-1&&$rootScope.selectedWorkClazz&&$rootScope.selectedWorkClazz.id){//作业与班级有关关的业务,加上clazzId
                            config.url=config.url+'?shardingId='+$rootScope.selectedWorkClazz.id+'&businessType='+finalData.BUSINESS_TYPE.QBU;
                        }else  if((config.url.indexOf(finalData.BUSINESS_TYPE.GAME)>-1||config.url.indexOf(finalData.BUSINESS_TYPE.STATS)>-1)&&$rootScope.selectedGameClazz&&$rootScope.selectedGameClazz.id){//游戏与班级有关关的业务,加上clazzId
                            config.url=config.url+'?shardingId='+$rootScope.selectedGameClazz.id+'&businessType='+finalData.BUSINESS_TYPE.GAME;
                        }
                        var jsessionid = $rootScope.sessionID;
                        if (jsessionid) {
                            config.url += ';jsessionid=' + jsessionid;
                        }
                        // if (finalData.HTTPS_URL_REG.test(config.url)&&!finalData.HTTPS_EXCLUDE_161_REG.test(config.url)) {
                        //     config.url=config.url.replace(/http:\/\/(.*):(\d+)?(.*)/,'https://$1$3');
                        // }
                    }
                    deferred.resolve(config);
                    return deferred.promise;
                },
                isOverTime: false,
                response: function (res) {
                    var deferred = $q.defer();
                    let commonService = $injector.get('commonService');
                    let $state = $injector.get('$state');
                    let profileService = $injector.get('profileService');
                    if ((res.data.code == 650||res.data.code == 651 || res.data.code == 603) && !this.isOverTime && $location.absUrl().indexOf('system_login') == -1) {
                        $rootScope.isLoadingProcessing = false;  //session过期或被其他设备挤下去后清除请求队列和转圈
                        let serverInterFace = $injector.get('serverInterface');

                        if ($rootScope.modal && $rootScope.modal.length > 0) { //session过期或被其他设备挤下去后清除modal页
                            $rootScope.modal.forEach(function (modal) {
                                modal.remove();
                            });
                            $rootScope.modal.splice(0, $rootScope.modal.length);//数组清空
                        }
                        if (res.data.code == 650||res.data.code == 651) { //650表示用户在其他地方登录，651表示用户是主动退出的
                            this.isOverTime = true;     //解决显示多个弹出框bug
                            commonService.showAlert('信息提示', res.data.msg).then( () =>{
                                this.isOverTime = false;
                                $rootScope.needAutoLogin = false;
                                $state.go('system_login');
                            });
                            res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                            deferred.reject(res);
                        }
                        if (res.data.code == 603) {  //603表示session过期
                            $rootScope.needAutoLogin = true;

                            res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                            profileService.handleAutoLogin().then(()=>{
                                deferred.reject(res);
                            });
                        }
                    }
                    else if(res.data.code===604){//更新后自动登录不需要输入密码
                        $rootScope.needAutoLogin = false;
                        res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                        commonService.alertDialog(res.data.msg, 2000);
                        deferred.reject(res);
                        /*profileService.handleAutoLogin().then(()=>{
                            commonService.showAlert("信息提示",res.data.msg);
                            deferred.reject(res);
                        });*/
                    }
                    //code 300：参数不全。
                    else if (res.data.code == 300) { 
                        //$rootScope.needAutoLogin = false;
                        res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                        console.error('该请求参数不全！')
                        deferred.reject(res);
                    }
                    else if (res.data.code == 302 || res.data.code == 303) { //申请班级,教师班级通道关闭(302),教师班级不存在(303)
                        res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                        commonService.showAlert("信息提示",res.data.msg);
                        deferred.reject(res);
                    }
                    else if (res.data.code == 100) { //服务器错误
                        res.data.withoutNotify = true; //commonPost处理时不弹出alert框信息
                        commonService.showAlert("信息提示", `
                                   <div style="text-align: center;width: 100%">
                                      <div>服务器忙</div>
                                      <div>code:${res.data.code}</div>
                                   </div>
                                `);
                        deferred.reject(res);
                    }
                    else {
                        deferred.resolve(res);
                    }
                    return deferred.promise;
                }
            };
        }]);
});
