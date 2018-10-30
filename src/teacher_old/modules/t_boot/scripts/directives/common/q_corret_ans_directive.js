/**
 * Created by 邓小龙 on 2016/3/10.
 *
 */
import  directives from "./../index";
import  controllers from  './../../controllers/index';
import  $ from 'jquery';
import  modalTemplate from './../../../partials/work_statistics/work_correct.html';
import _find from 'lodash.find';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';

class QCorrectAnsCtrl {
    constructor($scope, $rootScope, $timeout, $interval, commonService, workStatisticsService, $ionicModal, serverInterface) {
        "ngInject";
        this.$root = $rootScope;
        this.$timeout = $timeout;
        this.$interval = $interval;
        this.commonService = commonService;
        this.workStatisticsService = workStatisticsService;
        this.serverInterface = serverInterface;
        this.$scope = $scope;
        this.$ionicModal = $ionicModal;
        this.modal = null;
        this.showCorrectFlag = false;
        this.bigQSeq = $scope.bigQ ? this.commonService.convertToChinese(parseInt($scope.bigQ.seqNum) + 1) : '';//大题序号
        this.smallQ = $scope.smallQ;
        this.smQSeq = parseInt($scope.smallQ.seqNum);//小题序号
        this.timeCount = 0;
        this.bigQTitle = $scope.bigQ ? $scope.bigQ.title : '';
        this.isVertical=false;

    }

    showModal() {
        debugger
        this.modal = this.$ionicModal.fromTemplate(modalTemplate, {scope: this.$scope});
        this.$root.modal.push(this.modal);
        this.modal.show();
        this.getQAns();
        this.$timeout(function () {
            $('.modal-backdrop').removeClass('active'); //hack 报错黑色背景 bug
        }, 200);
    }

    hideModal() {
        this.isVertical=false;
        this.$interval.cancel(this.$scope.interval);
        this.timeCount = 0;
        this.modal.hide();
        this.modal.remove();
    }

    mapVerticalQAns(referAns,inputList){
        debugger;
        let inputAns,inputBoxStuAns,matrixAnsArray;
        angular.forEach(inputList,(sp)=>{
            angular.forEach(sp.spList,(scorePoint)=>{
                try{
                    inputAns=referAns[scorePoint.inputBoxUuid];
                    if(inputAns.indexOf("id")===-1){
                        scorePoint.inputBoxStuAns=inputAns;
                    }else if(inputAns.indexOf("id")>-1){
                        matrixAnsArray=JSON.parse(inputAns);
                        //TODO：一个得分点映射多个矩阵的，目前还没有这种题型
                        angular.forEach(matrixAnsArray,function (matrix) {
                            if(matrix.id===scorePoint.inputBoxUuid)
                                scorePoint.matrix=matrix.matrix;
                        })

                    }
                }catch (e){
                    console.error('qbuBug',e);
                }

            });
        });
        return inputList;
    }

    clearVerticalQAns(inputList){
        let inputBoxStuAns;
        let anskey = JSON.parse(this.$scope.smallQ.answerKey);
        let fillVerticalBlank = function(uuid){
            try{
                let vfMatrix = _find(anskey,{type:VERTICAL_FILLBLANKS_SCOREPOINT_TYPE});
                let matrixInfo = _find(vfMatrix.vfMatrix,uuid);
                return matrixInfo ? matrixInfo[uuid]:[{}];
            }catch (e){
                return [{}];
            }
        };

        angular.forEach(inputList,(sp)=>{
            angular.forEach(sp.spList,(scorePoint)=>{
                if(scorePoint.hasOwnProperty('inputBoxStuAns')){
                    scorePoint.inputBoxStuAns="";
                }else if(scorePoint.hasOwnProperty('matrix')){
                    scorePoint.matrix = fillVerticalBlank(scorePoint.inputBoxUuid);
                }
            });
        });
        return inputList;
    }

    getQAns(savantAnsFlag, ev) {
        var me = this;
        if (savantAnsFlag) {
            if (this.questionTypeKey === 'notSubjective') {
                if (this.showNotSubTip)
                    return;
                this.showNotSubTip = this.commonService.showAlert("温馨提示", '<div>只有主观题如脱式、解方程、解决问题等，"学霸解答"才会给出解答步骤。</div>');
                this.showNotSubTip.then(function () {
                    me.showNotSubTip = null;
                });
                return;
            }
            if (this.showAlertInfo)
                return;
            console.log('参考答案', ev);
            ev.stopPropagation();
            if (this.timeCount > 0) {
                this.showAlertInfo = this.commonService.showAlert("信息提示", '<div>亲，请先看下这个解答，才能再点击"学霸解答"。</div>');
                this.showAlertInfo.then(function () {
                    me.showAlertInfo = null;
                });
                return;
            }
            if (this.$scope.interval)
                this.$interval.cancel(this.$scope.interval);
            this.timeCount = 5;
            this.$scope.interval = this.$interval(function () {
                me.timeCount--;
            }, 1000);
        }
        var param = {
            questionId: this.$scope.smallQ.id
        };
      /*  var newAnsFlag = false;
        // 如果有大题存在 会调用老接口
        if(this.$scope.bigQ && this.$scope.bookMarkId){
            param.questionGroupId = this.$scope.bigQ.id;
        }else{
            newAnsFlag = true;
        }
        if (this.$scope.paperId && !newAnsFlag) {
            param.paperId = this.$scope.paperId;
        }*/
        //questionTypeKey == subjective   代表这是主观题 有学霸解答
        this.workStatisticsService.getQReferAnswer(param, savantAnsFlag).then(function (data) {
            if (data) {
                // let tempData={
                //         "1d4090e5-af15-4d69-bcf4-6045b526a2a6": "[{\"id\":\"1d4090e5-af15-4d69-bcf4-6045b526a2a6\",\"matrix\":[[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{\"val\":\"7\"},{\"val\":\"2\"},{\"borrow\":0,\"carry\":0,\"dot\":0},{\"borrow\":0,\"carry\":0,\"dot\":0},{},{},{},{}],[{},{},{},{\"val\":\"+\",\"line\":1},{\"val\":\"1\",\"line\":1},{\"val\":\"4\",\"line\":1},{},{},{},{},{},{}],[{},{},{},{\"borrow\":0,\"carry\":0,\"dot\":0},{\"val\":\"8\",\"borrow\":0,\"carry\":0,\"dot\":0},{\"borrow\":0,\"carry\":0,\"dot\":0,\"val\":\"6\"},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}]]}]",
                //         "1q32e7af-9f6a-4172-a2db-7j1j2b5fce3e": "100",
                //         "04889454-8c28-4dc6-86c3-00729cc5c2e0": "[{\"id\":\"04889454-8c28-4dc6-86c3-00729cc5c2e0\",\"matrix\":[[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{\"val\":\"5\"},{\"val\":\"2\"},{},{},{},{},{},{}],[{},{},{},{\"val\":\"+\",\"line\":1},{\"val\":\"2\",\"line\":1},{\"val\":\"0\",\"line\":1},{},{},{},{},{},{}],[{},{},{},{\"borrow\":0,\"carry\":0,\"dot\":0},{\"val\":\"7\",\"borrow\":0,\"carry\":0,\"dot\":0},{\"val\":\"2\"},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{}]]}]"
                // };
                // let data={
                //     vertical:true,
                //     questionTypeKey:'subjective',
                //     referAnswers:tempData
                // };
                //console.log('data  ', data);
                if (data["questionTypeKey"] && data["questionTypeKey"] === 'subjective'){
                    console.log('subjective');
                    me.questionTypeKey = 'subjective';
                }else if (me.questionTypeKey != 'subjective'){
                    me.questionTypeKey = "notSubjective";
                }
                //判断答案是否是空对象 和 是不是学霸解答
                if (Object.keys(data.referAnswers||{}).length == 0 && savantAnsFlag) {
                    me.commonService.showAlert("信息提示", "<div>亲，目前还没有学霸解答此题，请再等一等。</div>");
                    return;
                }
                me.showCorrectFlag = false;
                me.showDoc = false;
                me.referAnswers = null;
                me.doc = null;
                me.parsedInputList=null;
                me.$timeout(function () {
                    me.showCorrectFlag = true;
                    me.referAnswers = data.referAnswers;
                    if(data.doc && data.doc.length !== 0){
                        me.doc = data.doc;
                        me.showDoc = true;
                    }
                    //TODO:竖式特殊处理
                    if(me.referAnswers&&me.referAnswers.vertical){
                        me.isVertical=true;
                        me.parsedInputList=me.clearVerticalQAns(angular.copy(me.$scope.smallQ.inputList));
                        return;
                    }
                    if(me.isVertical){
                        me.parsedInputList=me.mapVerticalQAns(me.referAnswers,angular.copy(me.$scope.smallQ.inputList));
                        return;
                    }


                }, 100);
            }


        });

    }
}
QCorrectAnsCtrl.$inject = ["$scope", "$rootScope", "$timeout", "$interval", "commonService", "workStatisticsService", "$ionicModal", "serverInterface"];
controllers.controller('qCorrectAnsCtrl', QCorrectAnsCtrl);
directives.directive('qCorrectAns', function () {
    return {
        restrict: 'A',
        scope: {
            paperId: '=',
            bigQ: '=',
            smallQ: '=',
            bookMarkId: '='
        },
        controller: 'qCorrectAnsCtrl as ctrl',
        link: function ($scope, element, attr, ctrl) {
            $(element).click(function (e) {
                e.stopPropagation();
                ctrl.showModal();
            });

        }
    };
});
