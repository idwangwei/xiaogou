/**
 * Author 邓小龙 on 2015/11/5.
 * @description 学生确认表扬
 */
import BaseController from 'base_components/base_ctrl';
import _find from 'lodash.find';
import './style.less';
class HolidayWorkPraiseCtrl extends BaseController {
    constructor() {
        super(arguments);
        console.log('fsafdfafs');
    }

    onReceiveProps() {
        this.initStuPraise();
    }

    onAfterEnterView() {
        this.initFlags();
        if (this.selectedWork && !this.stuPraiseInitlized) {
            this.stuPraiseInitlized = true;
            this.fetchStuPraise(this.selectedWork, this.sId);
        }
    }

    initFlags() {
        this.stuPraiseInitlized = false;
    }

    initStuPraise() {
        if (this.selectedWork && !this.stuPraiseInitlized) {
            this.stuPraiseInitlized = true;
            this.fetchStuPraise(this.selectedWork, this.sId);
        }
    }

    /**
     * 选择表扬类型
     * @param praiseType
     */
    selectPraiseType(praiseType) {
        if (praiseType.selected) {
            angular.forEach(this.stuPraise.praiseTypeList, function (praiseType) {
                praiseType.selected = false;
            });
        } else {
            angular.forEach(this.stuPraise.praiseTypeList, function (praiseType) {
                praiseType.selected = false;
            });
            praiseType.selected = true;
        }
    };

    /**
     * 确认评价
     */
    comfirmPraise() {
        let content = "";
        let encourage = [];
        angular.forEach(this.stuPraise.praiseTypeList, function (praise) {
            if (praise.selected) {
                encourage.push(praise.type);
            }
        });
        let studentPraise = this.stuPraise.messageS||'';
        content = studentPraise == "" ? content : studentPraise;
        content=content=="undefined"?'':content;
        if (content != "") {
            encourage.push(101);
        }

        let postInfo = this.paperService.postsInfo[this.serverInterface.S_CONFIRM_APPRAISE];
        if(postInfo) {
            postInfo.cancelDefer.resolve(true);
        }

        this.stuConfirmA(this.selectedWork, encourage, content);
    }

    back(){
        if(this.stateUrlFrom&&this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH)>-1)//入口缓存了urlFrom，表明作业列表是从奥数进入的
            this.go("olympic_math_work_list", 'none',{urlFrom:this.stateUrlFrom});//改错后返回试卷列表
        else
            this.go("holiday_work_list", 'none');//改错后返回试卷列表
    }

    mapStateToThis(state) {
        let userId = state.profile_user_auth.user.userId;
        let clzId = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom ==='olympic_math_s' ? userId:state.wl_selected_clazz.id;
        let selectedWork = state.wl_selected_work,
            workList = state.wl_clazz_list_with_works[clzId],
            sId = state.profile_user_auth.user.userId;
        //let idx = findIndex(workList, {instanceId:selectedWork.instanceId});
        //selectedWork.paperIndex = idx; // added by LW on 20160607
        if(!workList)return{};
        let stuPraise = _find(workList,{instanceId:selectedWork.instanceId}).paperInfo.studentPraise || {};
        if(stuPraise.messageS === 'undefined'){
            stuPraise.messageS = '';
        }
        return {
            stateUrlFrom:state.work_list_route.urlFrom,
            selectedWork: selectedWork,
            stuPraise: stuPraise,
            sId: sId
        };
    }

    mapActionToThis() {
        return {
            fetchStuPraise: this.workStatisticsServices.fetchStuPraise,
            stuConfirmA:this.paperService.stuConfirmA
        };
    }
}
HolidayWorkPraiseCtrl.$inject = [
    '$scope',
    '$state',
    'workStatisticsServices',
    'paperService',
    'serverInterface',
    '$ngRedux',
    'finalData',
    'paperService',
    '$rootScope'
];
export default HolidayWorkPraiseCtrl
