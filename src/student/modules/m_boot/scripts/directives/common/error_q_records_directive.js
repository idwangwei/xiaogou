/**
 * Created by 邓小龙 on 2016/12/5.
 *
 */
import  directives from "./../index";
import  controllers from  './../../controllers/index';
import  $ from 'jquery';
import  modalTemplate from '../../partials/papar/error_q_records.html';
class ErrorQRecordsCtrl {
    constructor($scope, $rootScope, $timeout,$ngRedux,$ionicScrollDelegate, $interval, commonService, diagnoseService, $ionicModal, serverInterface) {
        "ngInject";
        this.$root = $rootScope;
        this.$timeout = $timeout;
        this.$interval = $interval;
        this.$ngRedux = $ngRedux;
        this.commonService = commonService;
        this.diagnoseService = diagnoseService;
        this.serverInterface = serverInterface;
        this.$scope = $scope;
        this.$ionicModal = $ionicModal;
        this.$ionicScrollDelegate=$ionicScrollDelegate;
        this.modal = null;
        this.smallQ = angular.copy($scope.smallQ);
        this.smallQ.question = angular.copy($scope.smallQ.qContext);
        this.instanceId = $scope.instanceId;
    }

    showModal(smallQ) {
        this.modal = this.$ionicModal.fromTemplate(modalTemplate, {scope: this.$scope, animation: 'slide-in-up'});
        this.modal.show();
        if(smallQ) {
            this.smallQ = angular.copy(smallQ);
            this.smallQ.question = angular.copy(this.smallQ.qContext);
        }
        this.getErrorQRecord();
        this.$timeout(function () {
            $('.modal-backdrop').removeClass('active'); //hack 报错黑色背景 bug
        }, 200);
    }

    hideModal() {
        this.diagnoseService.cancelErrorQRecordRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelErrorQRecordRequestList.splice(0, this.diagnoseService.cancelErrorQRecordRequestList.length);//清空请求列表
        this.modal.hide();
        this.modal.remove();
    }

    showSmallQ(doneInfo){
        doneInfo.showQFlag=!doneInfo.showQFlag;
        //this.$ionicScrollDelegate.resize();
    }

    callBack(data){
        if(data){
            this.questionInfo=angular.copy(this.smallQ);
            this.record=data;
        }
    }

    getErrorQRecord() {
        let state=this.$ngRedux.getState();
        let params = {
            userId: state.profile_user_auth.user.userId,
            paperInstanceId: this.instanceId,
            questionId: this.smallQ.id,
            classId: state.wl_selected_clazz.id
        };
        this.diagnoseService.getErrorQRecord(this.smallQ,params,this.callBack.bind(this));
    }
}
ErrorQRecordsCtrl.$inject = ["$scope", "$rootScope", "$timeout","$ngRedux", "$ionicScrollDelegate","$interval", "commonService", "diagnoseService", "$ionicModal", "serverInterface"];
controllers.controller('errorQRecordsCtrl', ErrorQRecordsCtrl);
directives.directive('errorQRecords', function () {
    return {
        restrict: 'A',
        scope: {
            smallQ: '=',
            instanceId: '='
        },
        controller: 'errorQRecordsCtrl as ctrl',
        link: function ($scope, element, attr, ctrl) {
            $(element).click(function () {
                console.log($scope);
                ctrl.showModal($scope.smallQ);
            });

        }
    };
});
