/**
 * Created by qiyuexi on 2018/3/7.
 */
/**
 * Created by qiyuexi on 2017/11/7.
 */
import {Inject, View, Directive, select} from '../../module';


@View('area_evaluation_build', {
    url: 'area_evaluation_build/:fromUrl',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope', '$state','$ngRedux','areaEvaluationService','areaEvaluationPubService','$stateParams','commonService','$ionicHistory','$rootScope','ionicDatePicker','ionicTimePicker'
    ]
})
class areaEvaluationBuildCtrl {
    areaEvaluationService
    areaEvaluationPubService
    ionicDatePicker
    ionicTimePicker
    commonService
    @select(state=>state.ae_compose_multi_unit_paper) paperInfo;
    @select(state=>state.ae_compose_temp_paper) paperInfoAll;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    onBeforeLeaveView() {
        this.areaEvaluationService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.areaEvaluationService.cancelRequestList.length=0;
    }
    onAfterEnterView(){
        this.initData();
    }
    constructor(){
        this.dateObj={
            weeksList: ["日", "一", "二", "三", "四", "五", "六"],
            monthsList: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            from: new Date(), //Optional
            to: new Date(2030, 12, 31), //Optional
            inputDate: new Date(),      //Optional
            mondayFirst: true,          //Optional
            disableWeekdays: [],       //Optional
            closeOnSelect: false,       //Optional
            templateType: 'modal',       //Optional
            setLabel: '选择',
            todayLabel: '今天',
            closeLabel: '关闭',
            dateFormat:"yyyy-MM-dd"
        }
        this.timeObj={
            inputTime: 50400,   //Optional
            format: 24,         //Optional
            step: 5,           //Optional
            setLabel: '设置',    //Optional
            closeLabel:"关闭"
        }
        this.timeIntervalOptions=this.getTimeIntervalOptions();
        this.gradeNameOptions=[
            {name:"一年级",value:1},
            {name:"二年级",value:2},
            {name:"三年级",value:3},
            {name:"四年级",value:4},
            {name:"五年级",value:5},
            {name:"六年级",value:6},
        ];
        this.isPC=this.commonService.judgeSYS() === 3;
        this.startDateTime={};
        this.endDateTime={};
        this.isStartDateTimeShowFlag=false;
        this.isEndDateTimeShowFlag=false;
    }
    /*初始化页面*/
    initData(){
        //表单的数据
        this.formObj={
            paperName: this.paperInfo.paperName,
            timeInterval:0,
            gradeName:0,
            startTime:new Date(),
            stopTime:new Date()
        }
        if(this.isPC){
            this.formObj.startTime=this.formatDate(new Date().getTime());
            this.formObj.stopTime=this.formatDate(new Date().getTime());
        }
        this.isBuilding=false;
    }
    submitForm(){
        if(this.isBuilding) return;
        if(!this.isPC){
            let startStr=this.formObj.startTime
            let endStr=this.formObj.stopTime
            if(typeof startStr=="string"){
                startStr=startStr.replace(/-/g,'/')
            }
            if(typeof endStr=="string"){
                endStr=endStr.replace(/-/g,'/')
            }
            this.formObj.startTime=this.formatDate(new Date(startStr).getTime());
            this.formObj.stopTime=this.formatDate(new Date(endStr).getTime());
        }
        console.log(this.formObj);
        if(!this.formObj.paperName){
            this.commonService.alertDialog("请填写试卷名称");
            return;
        }
        if(this.formObj.startTime>=this.formObj.stopTime){
            this.commonService.alertDialog("开始时间不能大于结束时间");
            return;
        }
        if(!this.formObj.timeInterval){
            this.commonService.alertDialog("请选择比赛时长");
            return;
        }

        if(!this.formObj.gradeName){
            this.commonService.alertDialog("请选择布置对象");
            return;
        }
        this.formObj.paperId=this.paperInfo.paper;
        this.formObj.groupId=this.clazzId;
        this.formObj.questionCount=this.paperInfo.questionCount;
        this.formObj.type=this.paperInfo.type;
        this.isBuilding=true;
        this.areaEvaluationService.createAE(this.formObj).then((flag)=>{
            if(flag){
                this.areaEvaluationPubService.pubPaperSucceed()
                this.go("area_evaluation_list")
            }else{
                this.commonService.alertDialog("布置失败");
            }
        }).finally(()=>{
            this.isBuilding=false;
        })
    }
    back() {
        // this.go('area_evaluation_check');
    }
    openDatePicker(type){
        document.activeElement.blur();//假装屏蔽键盘
        this.getRootScope().selectDateTimeFlag=true;
        if(type=='startTime'){
            this.isStartDateTimeShowFlag=true
            this.isEndDateTimeShowFlag=false
        }else {
            this.isStartDateTimeShowFlag=false
            this.isEndDateTimeShowFlag=true
        }
        /*let obj=Object.assign({
            callback: (val)=>{  //Mandatory
                this.formObj[type]=this.formatDate(val);
                this.openTimePicker(type);
            }
        },this.dateObj)
        this.ionicDatePicker.openDatePicker(obj);*/
    }
    openTimePicker(type){
        let obj=Object.assign({
            callback: (val)=>{  //Mandatory
                if (typeof (val) !== 'undefined') {
                    var selectedTime = new Date(val * 1000);
                    let h=selectedTime.getUTCHours();
                    let m=selectedTime.getUTCMinutes();
                    if(h<10){
                        h="0"+h
                    }
                    if(m<10){
                        m="0"+m
                    }
                    this.formObj[type]=this.formObj[type].split(" ")[0]+` ${h}:${m}:00`;
                }
            }
        },this.timeObj)
        this.ionicTimePicker.openTimePicker(obj);
    }
    selectDone(type){
        console.log(this.startDateTime)
        console.log(this.endDateTime)
        if(type==1){
            this.formObj.startTime=this.formatDirectiveDate(this.startDateTime)
        }else{
            this.formObj.stopTime=this.formatDirectiveDate(this.endDateTime)
        }
    }
    formatDirectiveDate(d){
        let h=d.hour;
        let m=d.minutes;
        let M=d.mouth;
        let D=d.date;
        let y=d.year;
        if(h<10){
            h="0"+h
        }
        if(m<10){
            m="0"+m
        }
        if(M<10){
            M="0"+M
        }
        if(D<10){
            D="0"+D
        }
        return `${y}-${M}-${D} ${h}:${m}:00`;
    }
    formatDate(val){
        let t=new Date(val);
        let h=t.getHours();
        let m=t.getMinutes();
        let M=t.getMonth()+1;
        let d=t.getDate();
        if(h<10){
            h="0"+h
        }
        if(m<10){
            m="0"+m
        }
        if(M<10){
            M="0"+M
        }
        if(d<10){
            d="0"+d
        }
        return `${t.getFullYear()}-${M}-${d} ${h}:${m}:00`;
    }
    getTimeIntervalOptions(){
        let arr=[];
        for (let i=5;i<=60;i++){
            arr.push({
                value:i,
                name:i+"分钟"
            })
        }
        return arr;
    }
}

export default areaEvaluationBuildCtrl