/**
 * Created by liangqinli on 2016/12/9.
 */
import {Inject, View, Directive, select} from '../../module';
@View('stuPassLevels', {
    url: '/stuPassLevels?grade&classId&passLevels&stuName',
    cache: false,
    template: require('./stu-pass-levels.html'),
    styles: require('./../rapid_calc_count/rapid-calc-count.less'),
    inject: ["$scope"
        , "$rootScope"
        , "$state"
        , "$timeout"
        , "$ionicPopup"
        , "$ngRedux"
        , "$ionicTabsDelegate"
        , "$ionicSideMenuDelegate"
        , "$ionicScrollDelegate"
        , "$log"
        , "commonService"
        , 'rapidCalcCountService']
})
class stuPassLevels {
    @select(() => {
    }) noob;

    constructor() {
        this.initData();
        this.rapidCalcCountService.getRcLevelsName(this.grade, this.classId).then((data) => {
            if (data) this.levelsName = data;
        });
        /*后退注册*/

    }

    initData() {
        var params = this.getStateService().params;
        this.grade = Number(params.grade) + 1;
        this.classId = params.classId;
        this.passLevels = Number(params.passLevels);
        this.stuName = params.stuName;
        this.levelsName = [];
        //console.log(params);
    }

    back() {
        this.go('home.compute')
    }

    help() {
        this.$ionicPopup.alert({
            title: '信息提示',
            template: `<p>绿色背景为学生速算已通过的关卡，紫色背景为未通过的关卡</p>`,
            okText: '确定'
        });
    }
}
export default stuPassLevels;