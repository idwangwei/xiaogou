/**
 * Created by ZL on 2017/9/14.
 */
import {Inject, View, Directive, select} from '../../module';
@View('oral_arithmetic_view', {
    url: 'oral_arithmetic_view/:isFirst/:publishType',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        ,'$state'
        ,'$rootScope'
        ,'$stateParams'
        ,'$ngRedux'
        ,'$ionicHistory'
        ,'$ionicLoading'
        ,'$ionicPopup'
        ,'$timeout'
        ,'commonService'
        ,'workManageService'
    ]
})
class OralArithmeticViewCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    workManageService;
    isOralflag = false;

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.wr_selected_paper) selectPaperInfo;
    @select(state=>state.wr_selected_unit) selectUnit;
    constructor(){
        
        
    }
    initData() {
        this.getQuesList();
        this.isOralflag = true;
        let isFirstStr = this.getStateService().params.isFirst;
        if (typeof isFirstStr == 'string') {
            this.isFirst = JSON.parse(isFirstStr);
        } else {
            this.isFirst = isFirstStr;
        }
    }

    getQuesList() {
        if (this.selectPaperInfo) {
            // return this.selectPaperInfo.qsTitles[0].qsList;
            angular.forEach(this.selectPaperInfo.qsTitles[0].qsList, (v, k)=> {
                this.selectPaperInfo.qsTitles[0].qsList[k].inputList = [];
            });
        }
    }


    onAfterEnterView() {
        this.initData();
    }

    onBeforeEnterView() {
        this.isOralflag = false;
    }

    back() {
        this.go('assign_oral_arithmetic',{isFirst:this.isFirst});
    }

    /**
     * 试做
     */
    tryToDoQuestion() {

    }

    /**
     * 布置口算作业
     */
    publishOralArithmetic() {
        this.workManageService.libWork.id = this.selectPaperInfo.basic.id;
        this.workManageService.libWork.name = this.selectPaperInfo.basic.title;
        this.go("work_pub", {from: 'oral_arithmetic_view',publishType:this.getStateService().params.publishType});
    }

}

export default OralArithmeticViewCtrl;