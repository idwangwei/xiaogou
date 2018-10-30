/**
 * Created by WangLu on 2017/1/6.
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';

class GrowingClassmateList extends BaseController {
    constructor() {
        super(arguments);
    }

    initFlags(){

    }

    initData() {
        this.screenWidth = window.innerWidth;
    }

    onAfterEnterView () {
        if(!this.selectClazz || !this.selectClazz.id || this.clazzList.length == 1){
            this.setSelectedClazz(this.clazzList[0]);
        }
        this.getALlRecord();
    }

    onBeforeLeaveView(){
        this.$ionicSideMenuDelegate.toggleLeft(false); //离开页面之前关闭班级选择页面
        this.growingService.recordCancelRequestList.forEach(cancelDefer => {
            cancelDefer.resolve(true);
        });
        this.growingService.recordCancelRequestList = [];
    }

    mapStateToThis(state) {
        return {
            user: state.profile_user_auth.user,
            clazzList: state.profile_clazz.passClazzList, //班级列表
            selectClazz:state.growing_selected_clazz,
            classmateList:state.growing_selected_classmate_list,
        }
    }

    mapActionToThis() {
        let growingService = this.growingService;
        return {
            getAllClassRecords: growingService.getAllClassMateRecordCount.bind(growingService),
            setSelectedClazz: growingService.setSelectedClazz.bind(growingService),
            setSelectedClassmate: growingService.setSelectedClassmate.bind(growingService),
        }
    }

    showClazzMenu(){
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    growingSelectClazz(clazz){
        this.$ionicSideMenuDelegate.toggleLeft(false);
        this.setSelectedClazz(clazz);
        this.selectClazz = clazz;
        this.getALlRecord();
    }

    getALlRecord(){
        this.getListFlag = false;
        this.hasNewRecordFlag = false;
        let param = {
            classId:this.selectClazz.id,
            userId:this.user.userId
        };
        this.getAllClassRecords(param).then(data=>{
            this.getListFlag = true;
            if(data.code == 200){
                this.hasNewRecordFlag = true;
            }else{
                this.commonService.alertDialog('网络连接不畅，请稍后再试...');
            }
        })
    }

    goClassmateHome(stu){
        this.setSelectedClassmate({userId:stu.userId,userName:stu.userName,userGender:stu.gender,headId:stu.headPortraitUrl});
        this.go("growing_classmate_home",{gender:stu.gender,headId:stu.headPortraitUrl});
        //this.go("growing_classmate_home",{displayerId:stu.userId,displayerName:stu.userName});
    }

    getClassMateHead(imgId){
        return this.growingService.getHeadImg(imgId);
    }

    back(){
        this.go("home.growing");
    }
}
GrowingClassmateList.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , '$stateParams'
    , 'commonService'
    , '$ngRedux'
    , '$ionicPopup'
    ,'growingService'
    ,'$ionicLoading'
    ,"$ionicSideMenuDelegate"
];
controllers.controller("growingClassmateList", GrowingClassmateList);