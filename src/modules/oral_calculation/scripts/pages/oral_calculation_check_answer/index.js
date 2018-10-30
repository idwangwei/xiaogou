/**
 * Created by WL on 2017/9/5.
 */

import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';
import {UserManifest, SYSTEM_TYPE} from 'local_store/UserManifest';
import sortBy from 'lodash.sortby';
import localStore from 'local_store/localStore';
import arrow from "./../../../images/oral-arrow.png";
import tip from "./../../../images/tip.png";
import errorTip from "./../../../images/errorTip.png";
import xiaogou from "./../../../images/xiaogou.png";


@Directive({
    selector: 'oralCalculationCheckAnswer',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true,
    controllerAs: "checkCtrl"

})
@View('oral_calculation_do_question_check_answer', {
    url: '/oral_calculation_do_question_check_answer/:spentTime',
    template: '<oral-calculation-check-answer></oral-calculation-check-answer>'
})
@Inject('$scope', '$timeout', '$state', '$rootScope', '$ionicPopup', '$stateParams'
    , '$ngRedux', '$http', 'oralCalculationPaperServer', '$timeout'
    , 'paperService', 'commonService', 'olympicMathService','$ionicScrollDelegate')
class oralCalculationDoCheckAnswer {
    oralCalculationPaperServer;
    inputBoxList;
    $timeout;
    arrow = arrow;
    errorTip = errorTip;
    tip = tip;
    xiaogou = xiaogou;
    paperService;
    commonService;
    olympicMathService;
    $ionicScrollDelegate;
    $stateParams;
    $ionicPopup;
    bigQList = localStore.getTempWork().qsList;
    @select(state => state.oral_calculation_select_paper.quesList) quesList;


    constructor() {
        this.getScope().showType = "doQuestion";
        this.configKeyboardOnMobile(); //调整在键盘在手机上的位置
        this.inputBoxList = this.oralCalculationPaperServer.getAnswerInputBoxList();
        this.inputBoxList.forEach(inputBox => {
            inputBox.seqNum = parseInt(inputBox.seqNum) + 1;
        });
        this.inputBoxList = sortBy(this.inputBoxList,item=>item.seqNum);
        this.$timeout(() => {
            this.fillAnswer();
            this.smallQList = this.bigQList[0].qsList;
        }, 1000);
    }

    fillAnswer() {
        // this.getScope().apply(()=>{
        this.inputBoxList.forEach(inputBox => {
            let $ele = $(`#${inputBox.id}`, $(".oral-check-answer"));
            if ($ele.length)
                angular.element($ele.get(0)).scope().textContent.expr = inputBox.recognizeResult;
            // $ele.scope().$emit('keyboard.addContent',{val:inputBox.recognizeResult,ele:$ele});
        })
        // });
    }

    back(noPopups) {
        this.paperService.startPaperTimeCollectorFlag = false;
        if (noPopups) {
            this.changeUrlFromForStore("oral_work");
            this.go('home.work_list', {fromUrl: "oral_work"});
            return;
        }
        this.popConEle = this.commonService.showConfirm(
            "提示",
            "<p style='text-align: center'>中途退出，所填答案将被清空，<br>确定退出吗？</p>",
            "确定",
            "取消");
        this.popConEle.then(res => {
            if (res) {
                this.changeUrlFromForStore("oral_work");
                this.go('home.work_list', {fromUrl: "oral_work"});
            }
        });

    }

    getResults() {
        let results = [];
        this.inputBoxList.forEach(inputBox => {
            let $ele = $(`#${inputBox.id}`, $(".oral-check-answer"));
            let result = null;
            if ($ele.length) {
                result = angular.element($ele.get(0)).scope().textContent.expr;
            }
            if (result)
                results.push({id: inputBox.id, result: result});
        });
        return results;
    }

    submit() {
        let results = this.getResults();
        this.saveAnsToLocalStore(results);
        let options = ["去提交", "再看看"];
        this.commonService.showConfirm("温馨提示", `确定要提交答案吗？`, options[0], options[1]).then((res) => {
            if (res) {
                this.submitAnsAndPaper(() => {
                    this.back(true);
                }, false, null, this.$stateParams.spentTime * 1000);
                console.log(results);
            }
        });
    }

    saveAnsToLocalStore(results) {
        let ansInfoList = [];

        if (typeof results == "string") {
            let firstSpInfo = this.smallQList[0].inputList[0].spList;
            let firstAnsInfo = {answer: '', uuid: null};

            firstSpInfo.forEach(spInfo => {
                firstAnsInfo.answer += results + "#";
                firstAnsInfo.uuid = spInfo.scorePointQbuId;
            });

            if (firstAnsInfo.answer.length) {
                firstAnsInfo.answer = firstAnsInfo.answer.substr(0, firstAnsInfo.answer.length - 1);
                this.savePaper(this.smallQList[0],
                    false,
                    false,
                    [firstAnsInfo]);
                ansInfoList.push(firstAnsInfo);
            }
            return
        }


        this.smallQList.forEach(smallQ => {
            let ansInfo = {answer: '', uuid: null};
            smallQ.inputList[0].spList.forEach(spInfo => {
                let inputBoxUUID = spInfo.inputBoxUuid;

                results.forEach(result => {
                    if (result.id === inputBoxUUID) {
                        ansInfo.answer += result.result + "#";
                        ansInfo.uuid = spInfo.scorePointQbuId;
                    }
                });
            });
            if (ansInfo.answer.length) {
                ansInfo.answer = ansInfo.answer.substr(0, ansInfo.answer.length - 1);
                this.savePaper(smallQ,
                    false,
                    false,
                    // currentQNewAns.currentQInputListClone,
                    [ansInfo]);
                ansInfoList.push(ansInfo);
            }
            // console.log(ansStr)
        });
    }
    /**
     * 在手机上显示键盘时,键盘位置调整(键盘距离输入框底部60), 在super中被调用
     * */
    configKeyboardOnMobile() {
        let me = this;
        this.getScope().$on('keyboard.show', (ev, info)=> {
            me.$timeout(()=> {
                var $currentEle = $(info.ele);
                var keyboardTop = $('.keyboard').offset().top;
                var currentEleTop = $currentEle.offset().top;
                var offset = currentEleTop + $currentEle.height() - keyboardTop + 60;
                if (offset > 0)
                    me.$ionicScrollDelegate.scrollBy(0, offset);
            }, 50);
        });
    }
    modify(id){
        angular.element(`#${id}`,angular.element('.oral-check-answer')).trigger("click");
    }


    /**
     * 从service中获取需要的方法
     * @returns {{fetchPaper: *, submitPaper: *, parsePaperData: *, checkAssignedQuestion: *, stateGo: *}}
     */
    mapActionToThis() {
        return {
            savePaper: this.paperService.savePaper,
            submitAnsAndPaper: this.paperService.submitAnsAndPaper.bind(this.paperService),
            changeUrlFromForStore: this.olympicMathService.changeUrlFromForStore.bind(this.olympicMathService)
        };
    }

    mapStateToThis() {
    }
}

export default oralCalculationDoCheckAnswer;