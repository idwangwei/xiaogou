/**
 * Created by ZL on 2017/7/12.
 */
import {Inject} from '../../module';

@Inject('$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', '$ionicHistory', '$ionicLoading')
class campPacksCtrl {
    $ngRedux;

    initData() {
    }

    goToXlyPage() {
        let xlyVipFlag = false;
        if (this.$ngRedux.getState().profile_user_auth.user.vips) {
            angular.forEach(this.$ngRedux.getState().profile_user_auth.user.vips, (v, k)=> {
                if (this.$ngRedux.getState().profile_user_auth.user.vips[k].xly) xlyVipFlag = true
            });
        }
        if (xlyVipFlag) {
            // this.getStateService().go('year_card_pay');
            this.getStateService().go('smart_training_camp',{backUrl:this.backUrl});
            console.log('已加入训练营');
        } else {
            this.getStateService().go('xly_select',{backUrl:this.backUrl,isIncreaseScore:this.getScope().isIncreaseScore});
            console.log('未加入训练营');
        }
        this.getScope().$root.$injector.get('$ionicViewSwitcher').nextDirection('forward');
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        this.initData();
    }

    configDataPipe() {
    }

}

export default campPacksCtrl;