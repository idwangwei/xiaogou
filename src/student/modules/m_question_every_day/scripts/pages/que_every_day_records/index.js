/**
 * Created by ZL on 2017/12/19.
 */
import {Inject, View, Directive, select} from './../../module';


@View('que_every_day_records', {
    url: '/que_every_day_records/:questionId',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$state'
        , '$stateParams'
        , 'commonService'
        , '$ngRedux'
        , '$ionicPopup'
        , '$ionicTabsDelegate'
        , '$timeout'
        , '$ionicSideMenuDelegate'
        , 'subHeaderService'
        , 'dateUtil'
        , 'tabItemService'
        , '$rootScope'
        , 'questionEveryDayService'
        , '$ionicHistory'
    ]
})

class QueEveryDayRecordsCtrl {
    commonService;
    questionEveryDayService;
    $ionicHistory;
    $stateParams;
    @select(state=>state.micro_select_example_item) examSelectPoint;
    @select((state)=> {
        let examSelectPoint = state.micro_select_example_item;
        if (!examSelectPoint.groupId) return {};
        let questionInfo = state.example_with_question[examSelectPoint.groupId];//根据例从本地拉取题目信息
        if (!questionInfo) return {};
        return questionInfo
    }) questionInfo;

    constructor() {
        this.questionInfo= {
            id:this.$stateParams.questionId
        }
        this.errorQRecordsInitlized = false; //ctrl初始化后，是否已经加载过一次错题记录
    }

    /**
     * 初始化ctrl中的一些 flag
     */
    initFlags() {
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    callBack(data) {
        this.record = data[0];
    }

    onAfterEnterView() {
        if (this.questionInfo) {
            this.errorQRecordsInitlized = true;
            this.questionEveryDayService.fetchErrorQRecords(this.questionInfo, this.callBack.bind(this));
            return;
        }
    }

    ensurePageData() {
        if (this.questionInfo && !this.errorQRecordsInitlized) {
            this.errorQRecordsInitlized = true;
            this.questionEveryDayService.fetchErrorQRecords(this.questionInfo, this.callBack.bind(this));
        }
    }

    back() {
        if (this.$ionicHistory.backView() !== null) {
            this.$ionicHistory.goBack()
        } else {
            this.go('question_every_day_do_question', 'back');
        }
    }

    onBeforeLeaveView() {
    }
}

export default QueEveryDayRecordsCtrl;





