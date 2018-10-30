/**
 * Created by qiyuexi on 2018/1/11.
 */
import _each from 'lodash.foreach';
import localStore from 'local_store/localStore';
import _find from 'lodash.find';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
import {Inject, View, Directive, select} from '../../module';

@View('final_sprint_do_question', {
    url: '/final_sprint_do_question/:paperId/:paperInstanceId/:redoFlag/:questionIndex/:urlFrom/:urlFromMark/:isFirst',
    template: require('./page.html'),
    styles: require('./style.less'),
    controllerAs:"doCtrl",
    inject:[
        "$log",
        "$ionicScrollDelegate",
        "$state",
        "$scope",
        "$rootScope",
        "$timeout",
        "commonService",
        "paperService",
        "finalData",
        "$ionicSlideBoxDelegate",
        "$ngRedux",
        "ngLocalStore",
        "countDownService",
        "workStatisticsServices",
        "$interval",
    ]
})
class DoQuestionCtrl {
    constructor() {
        this.configKeyboardOnMobile(); //调整在键盘在手机上的位置
        window.ls = localStore;
        //因为先执行ctrl,然后再次渲染页面, 所有延迟500ms等待页面渲染完毕再静止页面的slideBox滑动
        /* let me = this;
         this.$timeout(()=> {
         me.$ionicSlideBoxDelegate.enableSlide(false); //静止左右滑动slide页面
         // me.getScope.$broadcast('question.slide.change',{init:true});
         }, 500);*/
        this.initFlags();
        this.initData();
    }

    /**
     * 初始化当前controller使用的变量,在super中被调用
     */
    initFlags() {
        this.screenWidth = window.innerWidth;
        this.slideChangeDirection = 0; //slide页滑动方向: 0->向前, 1->向后
        this.slideChangeByEnterPage = false;
        // this.isShowCheckBtn = false;
        this.draftShow = false; //是否显示草稿板
        this.isSlideBoxInit = false;//isSlideBox是否已经渲染了
        this.startTimeFlag = undefined;
        this.stopTimer = {};
        this.isBackModalShow=false;//进入的时候弹窗
        this.isBackModalShowFlag=false;
    }

    initData() {
        this.solidBoxInfo = {
            currentIndex: 0
        }
        this.ox = null;
        this.oy = null;
        this.initFinalSprint();
    }
    closeBackModal(){
        this.isBackModalShowFlag=false;
        this.$timeout(()=>{
            this.isBackModalShow=false;
        },1000)
    }
    initFinalSprint(){
        let param=this.getStateService().params;
        if(param.isFirst=='yes'){
            this.isBackModalShow=true;
            this.$timeout(()=>{
                this.isBackModalShowFlag=true;
            },50)
            return;
        }
    }
    /**
     * 在super中被$ngRedux.connect数据监听调用
     * @param selectedState
     * @param selectedAction
     */
    onReceiveProps(selectedState, selectedAction) {
        // Object.assign(this, selectedState, selectedAction);
        if (!this.isSlideBoxInit && this.slideBoxDataList.length) {
            this.isSlideBoxInit = true;
            this.$timeout(()=> {
                this.$ionicSlideBoxDelegate.enableSlide(false); //静止左右滑动slide页面
                $(document).trigger('click');//保存答案前，触犯一次点击事件，清除掉空分数。
                this.getScope().$broadcast('question.slide.change', {init: true});
            }, 500);

        }
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

    /**
     * 从state上获取该页面需要的数据
     * @param state
     * @returns {{selectedPaperId: *, selectedPaperInstanceId: *, selectedClazzId: *, selectedPaperIndex: *, paperData: *}}
     */
    mapStateToThis(state) {
        let userId = state.profile_user_auth.user.userId;
        let clzId = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom ==='olympic_math_s' ? userId:state.wl_selected_clazz.id;
        let comeFromOlympicMathS=state.work_list_route.urlFrom ==='olympic_math_s';
        let clazzListWithWorks = state.wl_clazz_list_with_works;
        let selectedClazzId = clzId;
        let selectedWork = state.wl_selected_work;
        let bigQList = localStore.getTempWork().qsList;
        let selectedPaper = _find(clazzListWithWorks[selectedClazzId], {instanceId: selectedWork.instanceId});
        if (!selectedPaper) return {};
        let paperData = selectedPaper.paperInfo.doPaper;
        let from = paperData && paperData.from;
        let title = state.wl_selected_work.paperName;
        let pId = state.wl_selected_work.instanceId;
        let oralPaperTime = state.oral_calculation_limittime[pId];
        let finalAccessPaperTime = state.final_access_limittime[pId];
        return {
            loginName: state.profile_user_auth.user.loginName,
            comeFromOlympicMathS: comeFromOlympicMathS,
            selectedWork:selectedWork,
            from: from, //前一页面
            title: title, //试卷名称
            // selectedPaperIndex: selectedPaperIndex, //选择的试卷批次号
            instanceId: paperData && paperData.history.paperInstanceId,
            redoFlag: paperData && paperData.redoFlag, //试卷是否已提交过
            bigQList: paperData && bigQList, //所有题目集合
            bigQIndex: paperData && paperData.bigQIndex, //当前大题的下标
            smallQIndex: paperData && paperData.smallQIndex, //当前小题在其大题中的下标
            currentSmallQ: paperData && bigQList && bigQList[paperData.bigQIndex]['qsList'][paperData.smallQIndex],
            slideBoxDataList: (paperData && paperData.slideBoxDataList) || [], //slideBox中slide页面题目内容
            statusMapForQuestions: paperData && paperData.statusMapForQuestions, //题目状态集合
            serverIdForQuestions: paperData && paperData.serverIdForQuestions, //题目在服务器的编号Id
            limitTime:selectedWork.limitTime,
            paperTime:selectedWork.publishType == 13 ? finalAccessPaperTime:oralPaperTime,

        }
    }

    /**
     * 从service中获取需要的方法
     * @returns {{fetchPaper: *, submitPaper: *, parsePaperData: *, checkAssignedQuestion: *, stateGo: *}}
     */
    mapActionToThis() {
        return {
            // fillSlideBoxData: this.paperService.fillSlideBoxData,
            refreshSlideBoxList: this.paperService.refreshSlideBoxList,
            refreshCurrentSmallQByNewSlide: this.paperService.refreshCurrentSmallQByNewSlide,
            doQuestionBackToSelect: this.paperService.doQuestionBackToSelect,
            questionCheckOkGoToSelect: this.paperService.questionCheckOkGoToSelect,
            checkAssignedQuestion: this.paperService.checkAssignedQuestion,
            fillSlideBoxData: this.paperService.fillSlideBoxData,
            savePaper: this.paperService.savePaper,
            updateOralPaperLimitTime: this.workStatisticsServices.updateLimitTimeByOralPaperId,
            // deleteOralPaperLimitTime: this.workStatisticsServices.deleteLimitTimeByOralPaperId,

            //stateGo: stateGo
        };
    }


    /**
     * 获取slideBox中的当前slide页 ( ion-slide 元素)
     * @param slideIndex
     * @returns {*|jQuery|HTMLElement}
     */
    getIonSlideEle(slideIndex) {
        // return $('ion-slide');

        return $('ion-slide[data-index=' + slideIndex + ']');
    }

    /**
     * 获取当前小题的状态:(未做,未检查,已检查,未改)
     * @param currentQuestion 需要获取状态的小题
     */
    isCurrentQuestionStatusNotChecked() {
        var currentQuestion = this.slideBoxDataList[this.$ionicSlideBoxDelegate.currentIndex()];
        if (this.statusMapForQuestions[currentQuestion.displayData.id]) {
            return this.statusMapForQuestions[currentQuestion.displayData.id] == this.finalData.WORK_STATUS.NOT_CHECKED;
        }
        return 0
    };


    currentQInArrayShow(){
        if(!this.statusMapForQuestions) return '';
        var currentQuestion = this.slideBoxDataList[this.$ionicSlideBoxDelegate.currentIndex()];
        var currentQIndex=1;
        var allQLength=Object.keys(this.statusMapForQuestions).length;
        for(var key in this.statusMapForQuestions){
            if(key===currentQuestion.displayData.id){
                this.currentQIndex=currentQIndex;
                break;
            }
            currentQIndex++;
        }
        return currentQIndex+'/'+allQLength;
    }

    onBeforeEnterView() {

        //第一次进入初始化页面,再次进入则进入缓存页面,如果之前退出页面时的slideBox的Index不为0,则重置为0
        if (this.$ionicSlideBoxDelegate.currentIndex() > 0) {
            this.slideChangeByEnterPage = true;
            this.$ionicSlideBoxDelegate.slide(0); //每次进入do_question页面, 都让slideBox显示第一页
        }
        this.countDownService.removeCallback(this.getScope().$id);
    }

    onCloseTouch($event) {
        this.ox = 283;
        this.oy = this.oy || $event.target.offsetTop;
        $($event.target).removeClass('active');
        $($event.target).css({opacity: 0});
        if (!this.showErrorRecordFlag)
            this.showErrorRecordFlag = true;
        else {
            let $openBtn = $(".q-error-record-btn-open");
            $openBtn[0].style.removeProperty('left');
            $openBtn.removeClass('ng-leave').addClass('ng-enter');
            $openBtn.css({visibility: 'visible', right: '0px'});
        }
    }


    onTouch($event) {
        $event.stopPropagation();
        $event.preventDefault();
        this.ox = $event.target.offsetLeft;
        this.oy = $event.target.offsetTop;
    }

    onDrag($event) {
        $event.stopPropagation();
        $event.preventDefault();
        let el = $event.target,
            dx = $event.gesture.deltaX,
            dy = $event.gesture.deltaY;
        let canMoveWitdh = window.innerWidth - $(el).width();
        let canMoveHeightMin = 44;
        let canMoveHeightMax = window.innerHeight - $(el).height() - 44;
        let moveX = this.ox + dx, moveY = this.oy + dy;

        if (moveX < 0)
            el.style.left = 0 + 'px';
        else if (moveX > canMoveWitdh)
            this.handleImgStop(el);//el.style.left = canMoveWitdh + 'px';
        else
            el.style.left = this.ox + dx + "px";

        if (moveY < canMoveHeightMin)
            el.style.top = canMoveHeightMin + "px";
        else if (moveY > canMoveHeightMax)
            el.style.top = canMoveHeightMax + "px";
        else
            el.style.top = this.oy + dy + "px";
    };

    handleImgStop(el) {
        let $closeBtn = $(".q-error-record-btn-close");
        el.style.removeProperty('left');
        $(el).removeClass('ng-enter').addClass('ng-leave');
        if ($closeBtn.length) {
            $($closeBtn)[0].style.top = el.style.top;
            $($closeBtn).addClass('active');
        }
        //this.showErrorRecordFlag = false;
    }


    onAfterEnterView() {
        this.startTimeFlag = !!this.paperTime;

    }
    onBeforeLeaveView(){
        if (this.stopTimer.timer) this.$interval.cancel(this.stopTimer.timer);
    }

    /**
     * 保存当前作业的答案
     */
    saveCurrentQAns() {
        let currentSmallQ = this.bigQList[this.bigQIndex]['qsList'][this.smallQIndex]; //当前小题
        //隐藏草稿板
        this.handleSpecial();

        //获取并设置当前小题的最答案
        let currentQNewAns = this.getAndSaveCurrentQNewAns(currentSmallQ, this.getIonSlideEle(this.$ionicSlideBoxDelegate.currentIndex()), false);
        //保存试题
        if (currentQNewAns.hasChangeAnsFlag) {
            this.savePaper(
                currentSmallQ,
                false,
                currentQNewAns.isAllInputBoxesEmpty,
                // currentQNewAns.currentQInputListClone,
                currentQNewAns.ansStrArray
            );
        }
    }


    /**
     * 点击返回按钮回调: 隐藏草稿板,保存当前题目答案,返回select_question页面
     */
    back(flag) {
        if(this.draftShow){
            this.draftShow = false;
            this.getRootScope().$broadcast('draft.hide');
            // this.getScope().$digest();
            return;
        }
        if($('.keyboard')[0].hidden===false&&$('.keyboard')[0].style.display!='none'&&!flag){
            this.getScope().$broadcast('keyboard.hide');
            return;
        }
        this.saveCurrentQAns();

        //更新paperData.from
        this.doQuestionBackToSelect();

        //跳转页面
        let selectedWork = this.$ngRedux.getState().wl_selected_work; //当前选择试卷
        let param = {
            paperId: selectedWork.paperId, //试卷id
            paperInstanceId: selectedWork.instanceId, //试卷批次号
            // questionIndex: selectedWork.paperIndex, //当前试卷在work_list试卷列表中的下标
            redoFlag: this.redoFlag, //是否是提交后再进入select_question做题
        };
        if(this.getStateService().params.urlFrom=="finalSprint"){
            param.urlFrom="finalSprint";
        }
        if(this.getStateService().params.urlFrom=="detail"&&this.getStateService().params.urlFromMark=="finalSprint"){
            param.urlFrom="detail";
            param.urlFromMark="finalSprint";
        }
        this.getRootScope().selectQuestionUrlFrom = 'doQuestion';
        this.go("final_sprint_select_question",'back', param);
    };

    /**
     * 点击草稿按钮回调: 处理草稿板显示
     */
    handleDraft() {
        if ($('.draft_container').css('display') === 'none') {
            console.log('draft.show');
            this.getScope().$root.$broadcast('draft.show');
            this.draftShow = true;
        }
        else {
            console.log('draft.hide');
            this.getScope().$root.$broadcast('draft.hide');
            this.draftShow = false;
        }
    };

    /**
     * 查找下一个未检查的试题
     */
    findNextNoCheckedQ() {
        let bigQLength = this.bigQList.length, findBigQIndex = -1, findQIndex = -1, statusMapForQuestions = this.statusMapForQuestions;
        for (var i = 0; i < bigQLength; i++) {
            var bigQ = this.bigQList[i];
            for (var j = 0; j < bigQ.qsList.length; j++) {
                if (statusMapForQuestions[bigQ.qsList[j].id] === 2) {//试题状态是未检查的
                    findBigQIndex = i;
                    findQIndex = j;
                    break;
                }
            }
            if (findQIndex > -1)
                break;
        }
        if (findBigQIndex > -1) {//说明存在未检查的试题
            let bigQ = this.bigQList[findBigQIndex];
            let smallQ = this.bigQList[findBigQIndex].qsList[findQIndex];
            this.checkAssignedQuestion(bigQ, smallQ); //保存当前点击小题的答题下标,小题下标,和该小题在所有小题集合中的下标
            //每次进入do_question页面都要使用点击的该小题及其前后一题来填充do_question页面中的sideBox
            this.fillSlideBoxData(this.bigQList, true, this.$ionicSlideBoxDelegate.currentIndex());
            return;
        }
        //跳转页面
        let selectedWork = this.$ngRedux.getState().wl_selected_work; //当前选择试卷
        let param = {
            paperId: selectedWork.paperId, //试卷id
            paperInstanceId: selectedWork.instanceId, //试卷批次号
            // questionIndex: selectedWork.paperIndex, //当前试卷在work_list试卷列表中的下标
            redoFlag: this.redoFlag //该试卷是否已批改
        };
        if(this.getStateService().params.urlFrom=="finalSprint"){
            param.urlFrom="finalSprint";
        }
        if(this.getStateService().params.urlFrom=="detail"){
            param.urlFrom="detail";
            param.urlFromMark="finalSprint";
        }
        this.go("final_sprint_select_question",'back', param);

    }

    /**
     * 点击检查好了按钮回调: 检查答案
     * @param question 需要检查答案的题
     */
    checkAnswer() {

        this.handleSpecial();

        let currentSmallQ = this.bigQList[this.bigQIndex]['qsList'][this.smallQIndex]; //当前小题

        //获取当前小题的最答案
        let currentQNewAns = this.getAndSaveCurrentQNewAns(currentSmallQ, this.getIonSlideEle(this.$ionicSlideBoxDelegate.currentIndex()), true);
        //保存试题
        if (currentQNewAns.canModifyStatus) {
            this.savePaper(
                currentSmallQ,
                true,
                currentQNewAns.isAllInputBoxesEmpty,
                // currentQNewAns.currentQInputListClone,
                currentQNewAns.ansStrArray
            );
        }

        //更新doPaper.from的值为"do_question"
        this.questionCheckOkGoToSelect();

        this.findNextNoCheckedQ();

    };

    /**
     * 获取当前要保存答案的小题 的最新答案
     */
    getAndSaveCurrentQNewAns(currentQ, parentELe, checkFlag) {
        var currentQInputList = currentQ.inputList;//获取当前小题得分点的复本
        var ansStrArray = []; //答案集合
        var isAllInputBoxesEmpty = true; //答案输入框是否为空
        var hasChangeAnsFlag = false; //答案是否有变化
        var me = this;

        //遍历当前小题得分点, 将玩家输入的答案存入ansStrArray,
        //并给得分点对应的输入框spInfo[inputInfo].inputBoxStuAns赋值,
        //并保存该答案到得分点的临时变量spInfo.answerDo
        let isVerticalScorePointType = (type)=> {
            return type == VERTICAL_CALC_SCOREPOINT_TYPE || type == VERTICAL_ERROR_SCOREPOINT_TYPE || type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
        };
        _each(currentQInputList, function (spInfo) {
            //存入本地或服务器的小题答案: 输入框对应的答案信息和输入框uuid
            let ansInfo = {answer: spInfo.openStyle ? spInfo.answer : "", uuid: ""};
            let openStyleAnsObj = {}; //存储开放型得分点的答案
            //得分点关联的输入框
            _each(spInfo.spList, function (inputInfo, idx) {
                //该得分点在服务器的主键ID
                ansInfo.uuid = inputInfo.scorePointQbuId;
                let inputBox = parentELe.find('#' + inputInfo.inputBoxUuid);
                if (isVerticalScorePointType(inputInfo.type)) { //竖式矩阵输入框
                    //let verticalBox = parentELe.find('[uuid="'+inputInfo.inputBoxUuid+'"]');
                    let domScope = angular.element(inputBox).scope();
                    inputInfo.matrix = domScope.getVerticalAnswerMatrix(inputInfo.inputBoxUuid);
                    ansInfo.answer += JSON.stringify([{id: inputInfo.inputBoxUuid, matrix: inputInfo.matrix}]);
                    hasChangeAnsFlag = true;
                    if (isAllInputBoxesEmpty) {
                        isAllInputBoxesEmpty = !domScope.isAnswerMatrixModified(inputInfo.matrix, inputInfo.inputBoxUuid);
                    }
                    return;
                }
                //输入框对象
                let val = "";
                //输入框不存在
                if (!inputBox || inputBox.length == 0) {
                    console.error("出题bug,试题内容和答案所映射的输入框不匹配!输入框id:" + inputInfo.inputBoxUuid);
                } else {
                    //*获取输入框中的内容*/
                    val =
                        angular.element(inputBox).scope().textContent.expr ? //输入框为MathJax对象而非<input>
                            angular.element(inputBox).scope().textContent.expr :
                            $(inputBox).val();
                }
                if (val) {
                    isAllInputBoxesEmpty = false
                }


                if (spInfo.openStyle) {
                    openStyleAnsObj[inputInfo.label] = val;
                } else {  //*拼接该得分点输入的答案, 如果该得分点对应多个输入框,答案以"#"隔开*/
                    if (idx == 0) {
                        ansInfo.answer = val
                    }
                    else {
                        ansInfo.answer += "#" + val
                    }
                }

                //给得分点(spInfo)下对应的输入框内容赋值
                inputInfo.inputBoxStuAns = val;
            }, this);
            //*根据得分点上定义的临时变量answerDo, 判断当前输入的答案较之前是否有改动*/
            if (spInfo.answer != ansInfo.answer && !spInfo.openStyle) {
                hasChangeAnsFlag = true;
                spInfo.answer = ansInfo.answer;
            } else if (spInfo.answer != JSON.stringify(openStyleAnsObj) && spInfo.openStyle) {
                hasChangeAnsFlag = true;
                spInfo.answer = ansInfo.answer = JSON.stringify(openStyleAnsObj);
            }

            //
            // if (spInfo.answerDo) {
            //     if (ansInfo.answer != spInfo.answerDo) {
            //         hasChangeAnsFlag = true;
            //         spInfo.answerDo = ansInfo.answer;
            //         spInfo.answer = ansInfo.answer;
            //     }
            // }
            // else {
            //     if (spInfo.answer != ansInfo.answer) {
            //         hasChangeAnsFlag = true;
            //         spInfo.answerDo = ansInfo.answer;
            //         spInfo.answer = ansInfo.answer;
            //     }
            // }

            ansStrArray.push(ansInfo);
        }, this);


        //保存qsList到本地数据库
        this.ngLocalStore.setTempWork(this.$ngRedux.getState().wl_selected_work.instanceId, this.bigQList);
        this.ngLocalStore.doPaperStore.setItem(this.loginName + '/' + this.$ngRedux.getState().wl_selected_work.instanceId, this.bigQList);


        return {
            // currentQInputList: currentQInputList,
            ansStrArray: ansStrArray,
            isAllInputBoxesEmpty: isAllInputBoxesEmpty,
            hasChangeAnsFlag: hasChangeAnsFlag,
            canModifyStatus: checkFlag
        }
    };


    /**
     * slideBox列表变化回调,根据最新slide页面的下标,判断是下一页还是上一页,保存当前slide页中的题目数据到paperData中,并更新slideBox中的题目数据
     * @param newIndex
     */
    slideChange(newIndex) {
        let currentSmallQ = this.bigQList[this.bigQIndex]['qsList'][this.smallQIndex]; //当前小题


        //刚进入页面重置过slideBox下标为0时,触发slideBox的change
        if (this.slideChangeByEnterPage) {
            this.slideChangeByEnterPage = false;
            return
        }

        //改变之前的slide页下标
        let slideBeforeChangeIndex = this.slideChangeDirection ? //改变为向后一页
        (this.$ionicSlideBoxDelegate.currentIndex() + 2) % 3 :
        (this.$ionicSlideBoxDelegate.currentIndex() + 1) % 3;

        //获取当前小题的最答案
        let ionSlideEle = this.getIonSlideEle(slideBeforeChangeIndex);
        let currentQNewAns = this.getAndSaveCurrentQNewAns(currentSmallQ, ionSlideEle, false);
        //保存试题
        if (currentQNewAns.hasChangeAnsFlag) {
            this.savePaper(
                currentSmallQ,
                false,
                currentQNewAns.isAllInputBoxesEmpty,
                // currentQNewAns.currentQInputListClone,
                currentQNewAns.ansStrArray
            );
        }

        //当前题目的信息
        let currentSmallQRefreshData = {
            bigQIndex: this.bigQIndex, //当前所在大题下标
            smallQIndex: this.smallQIndex //当前小题在其大题中的下标
        };
        let newSmallQ = this.slideBoxDataList[newIndex].displayData; //slideBox改变之后的最新小题
        currentSmallQRefreshData.bigQIndex = newSmallQ.bigQArrayIndex;
        currentSmallQRefreshData.smallQIndex = newSmallQ.smallQArrayIndex;
        console.log(currentSmallQRefreshData);
        //更新当前题目信息
        this.refreshCurrentSmallQByNewSlide(currentSmallQRefreshData);
        //刷新slideBox中页面数据
        this.refreshSlideBoxList(newIndex);
        this.solidBoxInfo.currentIndex = this.$ionicSlideBoxDelegate.currentIndex();
        this.$ionicScrollDelegate.scrollTop();
    };

    handleSpecial() {
        this.getScope().$root.$broadcast('keyboard.hide.change.question');
        // this.getScope().$root.$broadcast('simplifyKeyboard.hide');
        $(document).trigger('click');//保存答案前，触犯一次点击事件，清除掉空分数。
        this.draftShow = false;
        this.getScope().$root.$broadcast('draft.hide');
        this.getScope().$broadcast('question.slide.change', {init: false});

    }

    /**
     * 进入下一个slide页面,本小题isLast=false才执行
     */
    goNextQuestion() {
        if (this.debounce())return;
        this.slideChangeDirection = 1;
        this.handleSpecial();
        this.$ionicSlideBoxDelegate.next();
    };

    /**
     * 进入上一个slide页面,本小题isFirst=false才执行
     */
    previousQuestion() {
        if (this.debounce())return;
        this.slideChangeDirection = 0;
        this.handleSpecial();
        this.$ionicSlideBoxDelegate.previous();
    };

    /**
     * 防止点击一次，输入两次的问题
     */
    debounce() {
        if (!this.lastInputTime)this.lastInputTime = new Date().getTime();
        let nowInputTime = new Date().getTime();
        let debounceTime = nowInputTime - this.lastInputTime;
        this.lastInputTime = nowInputTime;
        console.log(debounceTime)
        if (debounceTime < 250 && debounceTime != 0)return true;
        return false;
    }



    getCountDownStartTime() {
        let countDownStart = 0;
        if (!this.paperTime) {
            countDownStart = Number(this.limitTime) * 60;
            //如果改作业还没创建计时器，这记录开始作业时间
            this.updateOralPaperLimitTime(this.selectedWork.instanceId, new Date().getTime());
        }
        if (this.paperTime) {
            let currentDate = new Date().getTime();
            countDownStart = Number(this.limitTime) * 60 - Math.round((Number(currentDate) - Number(this.paperTime.startTime)) / 1000);
            if (countDownStart < 0) countDownStart = 0
        }
        return countDownStart;
    }
    /**
     * 实时更新本地存储的限时 单位秒s
     */
    timeCountCallBack(countDown) {
        if (!this.paperTime || this.paperTime && !this.paperTime.countDownTimer) {
            this.updateOralPaperLimitTime(this.selectedWork.paperId, null, this.stopTimer.timer);
        }
    }

    timeEndCallBack() {
        if (this.paperTime) {
            this.spentTime = Number(this.limitTime) * 60;
            this.commonService.showAlert('提示','答题时间已到，返回总览页面提交。').then(()=>{
                this.back();
            });
        }
    }
    timeRestCallback(countDown) {
        this.spentTime = Number(this.limitTime) * 60 - countDown;
    }
    startTimer() {
        this.startTimeFlag = true;
    }
    showNormalTitle(){
        return this.redoFlag == 'true' || (this.currentSmallQ && this.selectedWork
            &&this.selectedWork.publishType!=this.finalData.WORK_TYPE.MATCH_WORK
            &&this.selectedWork.publishType!=this.finalData.WORK_TYPE.ORAL_WORK
            &&this.selectedWork.publishType!=this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
            &&this.selectedWork.publishType!=this.finalData.WORK_TYPE.FINAL_ACCESS)
    }
    isOralWork(){
        //将期末测评的定时器显示与口算一致，时间紧张暂时共用下
        return this.selectedWork
            && (this.selectedWork.publishType == this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
            || this.selectedWork.publishType == this.finalData.WORK_TYPE.ORAL_WORK
            || this.selectedWork.publishType == this.finalData.WORK_TYPE.FINAL_ACCESS)
    }
}

export default DoQuestionCtrl;



