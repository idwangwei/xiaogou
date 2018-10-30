/**
 * Author 邓小龙 on 2015/9/2.
 * @description 表扬 controller
 */
import {Inject, View, Directive, select} from '../../module';

@View('work_praise_detail', {
    url: '/work_praise_detail/:urlFrom',
    template: require('./work_praise_detail.html'),
    styles: require('./work_praise_detail.less'),
    inject: ["$scope"
        ,"$state"
        ,"$ngRedux"
        ,"finalData"
        ,"workStatisticsServices"
        ,"$ionicHistory"
        ,'$rootScope']
})
class WorkPraiseDetailCtrl{
    urlFrom ='';
    constructor() {
        this.initFlags();
    }

    onReceiveProps() {
    }

    callBack(){
        this.retFlag=true;
    }

    getPraiseImg(imgUrl){
        let strArr = imgUrl.match(/^(.*)\.png$/);
        if(strArr&&strArr.length>0){
            return strArr[1]+'_120.png';
        }else{
            return imgUrl;
        }

    }
    onAfterEnterView() {
        this.urlFrom = this.getStateService().params.urlFrom;
        this.wData = this.workStatisticsServices.wData;//共享作业的数据
        this.retFlag=false;
        if(this.wData.correctedPraise&&this.wData.correctedPraise.showType){
            this.workStatisticsServices.getPraiseDetail(this.wData.correctedPraise.showType,this.wData.correctedPraise.work,this.callBack.bind(this));//获取评价列表
        }
    }

    initFlags() {
        /*this.wData = this.workStatisticsServices.wData;//共享作业的数据
        if(this.wData.correctedPraise&&this.wData.correctedPraise.showType){
            this.workStatisticsServices.getPraiseDetail(this.wData.correctedPraise.showType,this.wData.correctedPraise.work);//获取评价列表
        }*/
    }

    back() {
        if (this.urlFrom == 'holiday_work_list') {
            this.go("holiday_work_list", 'none');
        } else if (this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH) > -1)//入口缓存了urlFrom，表明作业列表是从奥数进入的
        {
            this.go("olympic_math_work_list", 'back', {urlFrom: this.stateUrlFrom});
        }//改错后返回试卷列表}
        else if (this.urlFrom == 'home.oral_calculation_work_list'){
            this.go("home.oral_calculation_work_list", 'none');
        }//改错后返回试卷列表}
        else {
            this.go("home.work_list", 'none');
        }

    };






    mapStateToThis(state) {
        let userId = state.profile_user_auth.user.userId;
        let clzId = state.work_list_route.urlFrom === 'olympic_math_t' ? state.olympic_math_selected_clazz.id : state.work_list_route.urlFrom ==='olympic_math_s' ? userId:state.wl_selected_clazz.id;
        let sId = state.profile_user_auth.user.userId;
        return {
            stateUrlFrom:state.work_list_route.urlFrom,
            sId: sId
        };
    }

    mapActionToThis() {
        return {
            fetchStuPraise: this.workStatisticsServices.fetchStuPraise
        };
    }
}