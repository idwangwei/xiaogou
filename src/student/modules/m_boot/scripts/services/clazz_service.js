/**
 * Created by 彭建伦 on 2015/7/29.
 */
define(['./index'], function (services) {
    services.service('clazzService', ['$http', '$q', '$rootScope','$log', 'serverInterface','commonService',
        function ($http, $q, $rootScope,$log, serverInterface, commonService) {
        return {
            Students:{},
            classParam:'',
            /**
             * @description 获取教师创建的班级列表
             * @return promise
             */
            getClazzList: function () {
                var defer = $q.defer();
                $http.post(serverInterface.GET_CLASSES,{ id: $rootScope.userId}).success(function (data) {
                    if (data.code == 200) {
                        defer.resolve(data);
                    } else {
                        defer.resolve();
                    }
                });
                return defer.promise;
            },
            /**
             * @description 获取班级详细信息
             * @param id
             */
            getClazzInfo:function(id){
               return commonService.commonPost(serverInterface.GET_CLAZZ_INFO,id);
            },

            /**
             * @description 设置需要修改班级的参数
             * @param classDate
             */
            setClazzParam:function(classDate){
                this.classParam = classDate;
            },
            /**
             * @description 获取要修改班级的参数
             *
             */
            getClazzParam:function(){
                return this.classParam;
            }



        }
    }]);
});

