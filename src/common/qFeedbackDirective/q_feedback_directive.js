/**
 * Created by 彭建伦 on 2016/3/9.
 *
 */
//import  $ from 'jquery';
import  modalTemplate from './templates/q_feedback.html';
var qFeedbackDirective = angular.module('qFeedbackDirective', []);
class QFeedbackCtrl {
    constructor($scope, $rootScope, $timeout, commonService, $ionicModal, serverInterface) {
        $scope.removeQCheckBox={
            flag:false
        };
        this.$root = $rootScope;
        this.$timeout = $timeout;
        this.commonService = commonService;
        this.serverInterface = serverInterface;
        this.$scope = $scope;
        this.$ionicModal = $ionicModal;
        this.modal = null;
        this.selections = [
            {selected: false, val: '出题不正确!'},
            {selected: false, val: '批改不正确!'},
            {selected: false, val: '显示不正确!'},
            {selected: false, val: '排版不美观!'},
            {selected: false, val: '图片看不清楚!'},
            {selected: false, val: '题干的文字有歧义!'},
            {selected: false, val: '参考答案有争议性!'},
            {selected: false, val: '其他问题!'}
        ];
    }

    showModal() {
        this.modal = this.$ionicModal.fromTemplate(modalTemplate, {scope: this.$scope});
        this.$root.modal.push(this.modal);
        this.modal.show();
        this.$timeout(function () {
            $('.modal-backdrop').removeClass('active'); //hack 报错黑色背景 bug
        }, 200);
    }

    hideModal() {
        this.modal.hide();
    }

    removeQ(me,deleteQParam){
        me.commonService.commonPost(me.serverInterface.POST_Q_FEEDBACK_REMOVE_Q, deleteQParam).then(function(data){
            if(data.code==200){
                var k=0;
                for(var i in me.$scope.smallQ){//由于e.$scope.smallQ是一个对象，i表示第几次做题。
                    me.$scope.smallQ[i].ignore=1;
                    if(k!=0) delete me.$scope.smallQ[i];
                    k++;
                }
                me.commonService.showAlert('提示', '<p>提交成功!</p>').then(function () {
                    me.hideModal();
                });
            }else{
                me.commonService.showAlert('提示', '<p>' + data.msg + '</p>');
            }
        });
    }

    sendFeedback() {
        var res = [];
        this.selections.forEach(function (sel) {
            if (sel.selected)res.push(sel.val)
        });
        if (this.other)res.push(this.other);
        if (!res.length)return this.commonService.showAlert('提示', '<p>请填写或选择出错描述!</p>');
        var me = this;
        this.commonService.showConfirm("提示", "<p>确定要提交吗？</p>").then(function (yes) {
            if (yes) {
                let id="",name="",role="T";
                if(me.$root.user){
                    id=me.$root.user.userId;
                    name=me.$root.user.name;
                    role=me.$root.user.loginName.substring(11,12);
                }else{
                    id=me.$scope.userInfo.userId;
                    name=me.$scope.userInfo.name;
                    role=me.$scope.userInfo.loginName.substring(11,12);
                }

                me.commonService.commonPost(me.serverInterface.POST_Q_FEEDBACK, {
                    user: JSON.stringify({
                        id: id,
                        name: name,
                        role: role
                    }),
                    questionId: me.$scope.qFeedback,
                    paperId: me.$scope.paperId,
                    suggestion: res.join('||')
                }).then(function (data) {
                    if (data.code == 200) {
                        
                        if(me.$scope.removeQCheckBox.flag){
                            var deleteQParam={
                                paperInstanceId:me.$scope.paperInstanceId,
                                questionId: me.$scope.qFeedback,
                                paperId: me.$scope.paperId
                            };
                            me.removeQ(me,deleteQParam);
                        }else{
                            me.commonService.showAlert('提示', '<p>提交成功!</p>').then(function () {
                                me.hideModal();
                            });
                        }


                    } else {
                        me.commonService.showAlert('提示', '<p>' + data.msg + '</p>');
                    }
                })
            }
        });

    }
}
QFeedbackCtrl.$inject = ["$scope", "$rootScope", "$timeout", "commonService", "$ionicModal", "serverInterface"];
qFeedbackDirective.controller('qFeedbackCtrl', QFeedbackCtrl);

qFeedbackDirective.directive('qFeedback', function () {
    return {
        restrict: 'A',
        scope: {
            qFeedback: '=',
            paperId: '=',
            isWorkdetail:'@',
            paperInstanceId:'=',
            userInfo:'=',
            smallQ:"="
    
        },
        controller: 'qFeedbackCtrl as ctrl',
        link: function ($scope, element, attr, ctrl) {
            $(element).click(function () {
                ctrl.showModal();
            });
        }
    };
});
