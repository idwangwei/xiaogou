/**
 * Created by qiyuexi on 2018/1/8.
 */
import {Inject, View, Directive, select} from '../../module';
@View('stuPassLevels', {
    url: '/stuPassLevels?grade&classId&passLevels&stuName',
    template:require('./page.html'),
    styles: require('./style.less'),
    inject:[
        "$scope", "$rootScope", "$state", "$timeout",
        "$ionicPopup", "$ngRedux", "$ionicTabsDelegate", "$ionicSideMenuDelegate","$ionicScrollDelegate", "$log",
        "commonService", "computeInterface"
    ]
})
class stuPassLevels{
    constructor(){
        this.initData();
        this.getRcLevelsName(this.grade, this.classId).then((data) => {
            if(data) this.levelsName = data;
        });
    }
    initData(){
        var params = this.getStateService().params;
        this.grade = Number(params.grade) + 1;
        this.classId = params.classId;
        this.passLevels = Number(params.passLevels);
        this.stuName = params.stuName;
        this.levelsName = [];
        //console.log(params);
    }
    getRcLevelsName(grade, classId){
        return this.commonService.commonPost(this.computeInterface.GET_RC_LEVELS_NAME, {grade, classId}).then((data) => {
            if(data.code === 200 && data.result && data.result.length > 0){
                return data.result;
            }else{
                this.commonService.alertDialog('服务器错误');
                return false;
            }
        })
    }
    back(){
        window.history.back();
    }
    help(){
        this.$ionicPopup.alert({
            title: '信息提示',
            template: `<p>绿色背景为学生速算已通过的关卡，紫色背景为未通过的关卡</p>`,
            okText: '确定'
        });
    }
    mapStateToThis(state) {
        return {
        }
    }
    mapActionToThis(){
        return {
        }
    }
}

export default stuPassLevels;