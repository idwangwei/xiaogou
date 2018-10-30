/**
 * Created by ww on 2017/5/11.
 */

import {Inject, View, Directive, select} from '../../module';

@View('teacher_share_intro', {
    url: '/teacher_share_intro/:backUrl',
    template: require('./teacher_share_intro.html'),
    style:require('./teacher_share_intro.less'),
    inject:['$scope', '$rootScope', '$state', '$ngRedux']
})

class clazzDetailCtrl {
    $ngRedux;
    backUrl = this.getStateService().params.backUrl || 'home.work_list';

    @select(state=>state.profile_user_auth.user) user;
    constructor(){
        /*后退注册*/
        
    }
    gotoShare(){
        this.getStateService().go('teacher_share_info',{backUrl:this.backUrl});
    }

    back(){
        this.getStateService().go(this.backUrl);
    }
}

export default clazzDetailCtrl