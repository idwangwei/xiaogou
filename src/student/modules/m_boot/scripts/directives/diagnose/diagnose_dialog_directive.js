/**
 * Author 邓小龙 on 2015/8/10.
 * @description
 */
import  directives from './../index';

const SHOW_DIALOG_TYPE = {
    "CONFIRM":"confirm"
};

directives.directive('diagnoseDialog', ["$timeout", "$rootScope", function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        scope: {},
        replace:true,
        template:require('../../partials/directive/diagnose_dialog.html'),
        link: function ($scope, element, attr) {
            //TODO:还需要优化，找个最外层，只添加一次指令
            $scope.dialogConfirm=()=>{
                $scope.val.confirmCallBack();
                //$scope.showDiagnoseDialogFalg=false;
                $scope.$emit('diagnose.dialog.hide');
            };
            $scope.dialogCancel=()=>{
                $scope.val.concelCallBack();
                //$scope.showDiagnoseDialogFalg=false;
                $scope.$emit('diagnose.dialog.hide');
            };
            $scope.showDiagnoseDialogFalg=false;
            $rootScope.$on('diagnose.dialog.show', (ev, val)=> {
                $scope.val=val;
                //没有传入提示语就返回，不显示框子
                if(!val.content) return;  
              
                if(val.showType&&val.showType===SHOW_DIALOG_TYPE.CONFIRM)//确定框（包含确定和取消两种按钮）,其他就显示确定按钮
                    $scope.showConfirmFlag=true;
                else
                    $scope.showConfirmFlag=false;

                $scope.val.confrimBtnText=$scope.val.confrimBtnText?$scope.val.confrimBtnText:'确定';
                $scope.val.cancelBtnText=$scope.val.cancelBtnText?$scope.val.cancelBtnText:'取消';


                $scope.val.confirmCallBack=val.confirmCallBack?val.confirmCallBack:angular.noop;
                $scope.val.concelCallBack=val.concelCallBack?val.concelCallBack:angular.noop;
                $timeout(()=>{
                    $scope.showDiagnoseDialog=true;
                    $timeout(()=>{
                        $scope.showDiagnoseDialogFalg=true;
                    },50);

                });


            });
            $rootScope.$on('diagnose.dialog.hide', (ev, val)=> {
                $timeout(()=>{
                    $scope.showDiagnoseDialogFalg=false;
                    $timeout(()=>{
                        $scope.showDiagnoseDialog=false;
                    },1000);
                });
            });

        }
    };
}]);
