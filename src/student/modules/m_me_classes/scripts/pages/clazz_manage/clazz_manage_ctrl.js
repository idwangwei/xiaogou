/**
 * Created by 彭建伦 on 2015/7/29.
 */
import {Inject, View, Directive, select} from '../../module';
@View('clazz_manage', {
    url: '/clazz_manage',
    template: require('./clazz_list.html'),
    styles: require('./style.less'),
    inject: ['$ngRedux',
        '$scope',
        '$rootScope',
        'profileService',
        '$log',
        '$state',
        '$rootScope']
})
class clazzManageCtrl {
    $log;
    $ngRedux;
    $scope;
    profileService;

    onReceiveProps(selectedState, selectedAction) {
        this.$log.debug('clazz_manage receive props ....');
        Object.assign(this, selectedAction, selectedState);
    }


    loadCallback() {
        this.getScope().$broadcast('scroll.refreshComplete');
    }

    pullRefresh() {
        this.fetchClazzList(this.loadCallback.bind(this));
    }

    onUpdate() {
        this.fetchClazzList();
    }

    mapStateToThis(state) {
        return {
            clazzList: state.profile_clazz.passClazzList
        }
    }

    mapActionToThis() {
        let profileService = this.profileService;
        return {
            fetchClazzList: profileService.fetchClazzList.bind(profileService),
            changeClazz: profileService.changeClazz.bind(profileService)
        }
    }

    goToClazzDetail(clazz) {
        this.changeClazz(clazz);
        this.go('clazz_detail', 'forward');
    }

    back() {
        this.go('home.me');
    }
}






