import {ViewDecorator} from "../../module";

@ViewDecorator("select_question", {
    inject: ["$ngRedux", "commonService", "finalData"]
})
class SelectQuestionCtrl {
    $ngRedux;
    finalData;
    commonService;

    getPaperDataFromService() {
        if (this.$ngRedux.getState().wl_selected_work.publishType === this.finalData.WORK_TYPE.ORAL_WORK
            && !this.commonService.isPC()) {
            this.skipToDoQuesPage();
        }
    }

    /**
     * 试题加载完成后跳转到作业页面
     */
    skipToDoQuesPage() {
        let bigQ = this.qsList[0];
        let smallq = bigQ.qsList[0];
        this.go("oral_calculation_do_question", "none", {
            paperId: this.selectedPaperId,
            paperInstanceId: this.selectedPaperInstanceId,
            redoFlag: this.getStateService().params.redoFlag
        });
    }
}