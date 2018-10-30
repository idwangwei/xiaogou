import _findIndex from 'lodash.findindex';

import {Inject, View, Directive, select} from '../../module';

@View('clazz_study_statistics', {
    url: '/clazz_study_statistics',
    template: require('./clazz_study_statistics.html'),
    styles: require('./clazz_study_statistics.less'),
    inject: ["$scope"
        , "$ngRedux"
        , '$rootScope'
        , "studyStatiService"
        ,  "pageRefreshManager"
        , "$state"]
})
class StudyStatiCtrl{
    constructor() {
        this.initFlags();
        this.initData();
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    loadCallback() {
        this.getScope().$broadcast('scroll.refreshComplete');
    }

    pullRefresh() {
        if(!this.wl_selected_clazz.id) {
            this.loadCallback();
            return;
        }
        this.fetchStudyStati(this.wl_selected_clazz.id,this.loadCallback.bind(this),this.selectedTime,this.selectedType);
    }

    onUpdate() {
        if(this.wl_selected_clazz.id)
            this.fetchStudyStati(this.wl_selected_clazz.id,null,this.selectedTime,this.selectedType);
    }

    initFlags(){
        this.initStudyStatied=false;
    }

    initData(){
        window.innerWidth<=700?this.smallScreen=true:this.smallScreen=false;
        this.selectedTime = '';  //选择的值
        this.selectedType = 1;     //选择的值
        this.selectedTimeIndex = 0;  //选择的值
        this.selectedTypeIndex = 0;  //选择的值
        this.initTime();
        this.initFlag = {
            show: false
        };
        this.typeOptions = [{
            name: '上学期',
            value: 1
        },{
            name: '寒假作业',
            value: 2
        },{
            name: '下学期',
            value: 3
        },{
            name: '暑假作业',
            value: 4
        }];
    }

    handleTypeOnChange = (value) => {
        if(value===this.selectedType) return;
        this.changeStudyStatisParams(this.wl_selected_clazz.id,this.selectedTime,value);
        if(!this.wl_selected_clazz.id) return;
        this.fetchStudyStati(this.wl_selected_clazz.id,null,this.selectedTime,value);
    };
    handleTimeTypeOnChange = (value) => {
        if(value===this.selectedTime) return;
        this.changeStudyStatisParams(this.wl_selected_clazz.id,value,this.selectedType);
        if(!this.wl_selected_clazz.id) return;
        this.fetchStudyStati(this.wl_selected_clazz.id,null,value,this.selectedType);
    };

    initTime(){
        debugger
        this.timeOptions=[];
        let START_YEAR = 2015;                  //起始年份
        let date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1;
        let day = date.getDate();
        if(day<10) day="0"+day;
        let num=month+""+day-0;
        if (1 <= month && month < 9) {
            year = year - 1;
        }
        this.selectedType = 1;
        this.selectedTime = (year) + '-' + (year + 1);
        if(num>0&&num<301){
            this.selectedType=1;
        }
        if(num>=120&&num<301){
            this.selectedType=2;
        }
        if(num>=301&&num<701){
            this.selectedType=3;
        }
        if(num>=701&&num<901){
            this.selectedType=4;
        }
        for (let i = START_YEAR; i <= year; i++) {
            let temp = (i) + '-' + (i + 1) + ' 学年';
            this.timeOptions.push({
                name: temp,
                value: (i) + '-' + (i + 1)
            });
        }
    }

    ensurePageData() {
        let clzid = this.wl_selected_clazz.id;
        this.study_stati = this.clazz_with_study_stati[clzid];
        if (!this.initStudyStatied) {
            this.initStudyStatied=true;
            let studyStatisParams = this.study_statis_params;
            let storeParams = studyStatisParams[clzid], selectedTime, selectedType;

            if (storeParams) {
                selectedTime = storeParams.split('#')[0];
                selectedType = parseInt(storeParams.split('#')[1]);
                this.selectedTimeIndex = _findIndex(this.timeOptions, {value: selectedTime}) || 0;
                this.selectedTypeIndex = _findIndex(this.typeOptions, {value: selectedType}) || 0;
                this.selectedTime = selectedTime;
                this.selectedType = selectedType;
            } else {
                selectedTime = this.selectedTime;
                selectedType = this.selectedType;
                this.selectedTimeIndex = _findIndex(this.timeOptions, {value: selectedTime}) || 0;
                this.selectedTypeIndex = _findIndex(this.typeOptions, {value: selectedType}) || 0;
            }
            this.initFlag.show = true;
            if(!clzid) return;
            this.fetchStudyStati(clzid,null,selectedTime,selectedType);
        }
    }

    mapStateToThis(state) {
        return {
            wl_selected_clazz: state.wl_selected_clazz,
            study_statis_params: state.study_statis_params,
            clazz_with_study_stati: state.clazz_with_study_stati,
            fetch_study_stati_processing: state.fetch_study_stati_processing
        }
    }

    mapActionToThis() {
        let statS = this.studyStatiService;
        return {
            fetchStudyStati: statS.fetchStudyStati.bind(statS),
            changeStudyStatisParams: statS.changeStudyStatisParams.bind(statS)

        }
    }

    back(){
        this.go('home.work_list');
    }
}
