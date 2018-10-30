/**
 * Created by 邓小龙 on 2015/9/11.
 * description 重置密码第一步：验证要找回的账号
 */

import {Inject, View, Directive, select} from '../../module';

@View('reset_pass_status', {
    url: '/reset_pass_status/:loginName',
    cache: false,
    template: require('./reset_pass_status.html'),
    inject: ['$scope'
        , '$ionicHistory'
        , '$state'
        , '$log'
        , '$ngRedux']
})
class resetPassStatusCtrl {
    $log;
    $ionicHistory;

    onAfterEnterView() {
        if (!this.getStateService().params.loginName) {
            this.$log.error("没有参数!");
            return;
        }
        this.loginName = this.getStateService().params.loginName;
    }

    back() {
        this.$ionicHistory.goBack();//返回到列表展示
    };
}
export default resetPassStatusCtrl;