/**
 * Created by liangqinli on 2017/3/2.
 */
import _findIndex from 'lodash.findindex';
import {Inject, View, Directive, select} from '../../module';

@View('personal-math', {
    url: '/personal-math/:from',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ["$scope"
        , "$ngRedux"
        , '$rootScope'
        , "studyStatiService"
        ,  "pageRefreshManager"
        , "$state"
        ,"mathPaperService"
        ,"workStatisticsServices"]
})
class PersonalMath{
    constructor() {
        // super(arguments);
        this.initFlags();
        this.initData();
    }

    onReceiveProps() {
        if(this.initCount == 0 ){
            this.initCount++;
            this.isLoadingProcessing = true;
            this.getSelfInfo();
        }
    }
    

    pullRefresh() {
        this.getSelfInfo().then(() => {
            this.getScope().$broadcast('scroll.refreshComplete');
        });
    }

    onUpdate() {
        this.getSelfInfo();
    }

    initFlags(){
        this.initStudyStatied=false;
    }

    initData(){
        window.innerWidth<=700?this.smallScreen=true:this.smallScreen=false;
        this.selectedTime = '';  //选择的值
        this.selectedType = 0;     //选择的值
        this.selectedDefaultType = 0;
        this.selectedTimeIndex = 1;  //选择的值
        this.initTime();
        this.pageType = this.getStateService().params.from === 'from-self'; //是否是奥数自主练习
        this.initFlag = {
            show: false
        };
        this.typeOptions = [{
            name: '上学期',
            value: 1
        },{
            name: '下学期',
            value: 3
        }];
        this.initCount = 0;
    }

    handleTypeOnChange = (value) => {
       /* if(value===this.selectedType) return;*/
       /* this.changeStudyStatisParams(this.wl_selected_clazz.id,this.selectedTime,value);*/
       this.selectedType = value;
        this.getSelfInfo();
    };
    handleTimeTypeOnChange = (value) => {
       /* if(value===this.selectedTime) return;*/
        /*this.changeStudyStatisParams(this.wl_selected_clazz.id,value,this.selectedType);*/
        this.selectedTime = value;
        this.getSelfInfo();
    };

    initTime(){
        this.timeOptions=[];
        let START_YEAR = 2015;                  //起始年份
        let date = new Date(),year = date.getFullYear(),month = date.getMonth() + 1;
        if (1 <= month&&month < 9) {
            year = year - 1;
            this.selectedDefaultType = 1;
        }
        this.selectedTime= (year) + '-' + (year + 1);

        for (let i = START_YEAR; i <= year; i++) {
            let temp = (i) + '-' + (i + 1)+' 学年';
            this.timeOptions.push({
                name: temp,
                value: (i) + '-' + (i + 1)
            });
        }
    }
    getSelfInfo(){
        let params = {
            type: this.selectedType,
            startTime: this.selectedTime.slice(0,4),
            endTime: this.selectedTime.slice(-4)
        };
        if(this.pageType){
            return  this.getPracticeInfo(params).then( (data) => {
                    this.isLoadingProcessing = false;
                    if(data){
                        this.stuInfo = data;
                    }
                }).catch(err => {
                    this.isLoadingProcessing = false;
                    console.error(err);
                })

        }else{
            Object.assign(params, {
                classId: this.selectedClazz.id,
                publishType: 9
            });
            return  this.getTeacherInfo(params).then((data) => {
                this.isLoadingProcessing = false;
                if(data){
                    this.stuInfo = data;
                }
            }).catch(err => {
                this.isLoadingProcessing = false;
                console.error(err);
            })
        }

    }
    back(){
        this.go('olympic_math_work_list', {urlFrom: this.workStatisticsServices.routeInfo.urlFrom})
    }

    mapStateToThis(state) {
        return {
            selectedGrade: state.olympic_math_selected_grade,
            selectedClazz: state.olympic_math_selected_clazz,
            study_statis_params: state.study_statis_params,
            clazz_with_study_stati: state.clazz_with_study_stati,
            fetch_study_stati_processing: state.fetch_study_stati_processing
        }
    }

    mapActionToThis() {
        var statS = this.studyStatiService;
        return {
            changeStudyStatisParams: statS.changeStudyStatisParams.bind(statS),
            getPracticeInfo:  this.mathPaperService.getPracticeInfo.bind(this.mathPaperService),
            getTeacherInfo: this.mathPaperService.getPersonalInfo.bind(this.mathPaperService)

        }
    }
}