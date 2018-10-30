/**
 * Created by 邓小龙 on 2017/2/17.
 */
import {Inject, View, Directive, select} from '../../module';

@View('register_success_new', {
    url: '/register_success_new/:tLoginName/:pLoginName/:sLoginName',
    cache: false,
    template: require('./register_success_new.html'),
    styles: require('./register_success_new.less'),
    inject: ['$scope', '$rootScope', '$ionicHistory', '$log', '$ngRedux', '$state', '$stateParams', 'commonService', 'dateUtil']
})
class registerSuccessNewCtrl {
    $log;
    $ionicHistory;
    $stateParams;
    commonService;
    dateUtil;

    @select(state=>state.profile_user_auth.isLogIn) isLogin;

    constructor() {
        this.initData();
    }


    /**
     * 初始化
     */
    initData() {
        if (this.$stateParams) {
            this.tLoginName = this.$stateParams.tLoginName;
            this.pLoginName = this.$stateParams.pLoginName;
            this.sLoginName = this.$stateParams.sLoginName;
            var formatStr = this.dateUtil.dateFormat.prototype.DEFAULT_DATE_TIME_CN_FORMAT;//格式成“2016年5月13日 11:30”
            var now = new Date();
            var createTime = this.dateUtil.dateFormat.prototype.format(now, formatStr); //当前日期
            var tUserNameList = this.commonService.getLocalStorage("tUserNameList") || [];
            var tUserNameInfo = {};
            tUserNameInfo.tUserName = this.tLoginName;
            tUserNameInfo.createTime = createTime;
            tUserNameList.push(tUserNameInfo);
            this.commonService.setLocalStorage("tUserNameList", tUserNameList);
        } else {
            this.$log.error("param is undefined！");
            //return;
        }
    }

    goToLogin(flag) {
        if (flag === 't') {
            this.go('system_login');
            return;
        }
        window.localStorage.setItem('currentSystem', JSON.stringify({id: 'student'}));
        window.location.href = '../../../../../../../student_index.html';
    }

}

export default registerSuccessNewCtrl;






