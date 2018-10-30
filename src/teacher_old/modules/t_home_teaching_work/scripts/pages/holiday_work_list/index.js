/**
 * Created by ww on 2017/10/20.
 */
import {Inject, View, Directive, select}from  '../../module';

@View('holiday_work_list', {
    url: '/holiday_work_list',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: [
        '$scope'
        , 'commonService'
        , 'workListService'
        , '$state'
        , '$ngRedux'
        , '$rootScope'
    ]
})
class HolidayWorkListCtrl {
    commonService;
    workListService;

    initCtrl = false;
    @select((state)=> {
        return state.holiday_clazz_list_with_work[state.wl_selected_clazz.id]
    }) holidayWorkList;

    back = ()=> this.go('home.work_list',{category: 2, workType: 2});//返回到worklist页面

    constructor() {
        this.openingTime = new Date("2018/07/01 0:0:0").getTime();
        this.systemTime = this.workListService.systemTime;
    }


    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
    }

    mapActionToThis() {
        return {
            // selectPaper: this.workChapterPaperService.selectedDetailPaper.bind(this.workChapterPaperService),
        }
    }

    reviewWorkDetail(paper){
        //选择并保存当前试卷
        this.workListService.selectPublishWork(paper);
        this.getRootScope().workStuListBackUrl = 'holiday_work_list';
        this.getStateService().go("work_student_list", {paperInstanceId: paper.instanceId, isNoPublish: 1});
    }

    ifShow($index) {
        try {
            if (!this.workList || !this.workList.length) return false;

            let currentItem = this.workList[$index];
            let previousItem = this.workList[$index - 1];
            if ($index == 0) {
                return true
            }
            let currentMonth = currentItem.paperInfo.publishTimeDate.split('-')[2];
            let previousMonth = previousItem.paperInfo.publishTimeDate.split('-')[2];
            return currentMonth != previousMonth;
        } catch (err) {
        }
    }


}

export default HolidayWorkListCtrl;