/**
 * Created by 华海川 on 2015/8/11.
 * @description 班级详情controller
 */
import {Inject, View, Directive, select} from '../../module';
@View('clazz_detail', {
    url: '/clazz_detail',
    template: require('./clazz_detail.html'),
    styles: require('./style.less'),
    inject:['$ngRedux',
        '$rootScope',
        '$scope',
        '$log',
        '$state']
})
class ClazzDetailCtrl{
    onReceiveProps(selectedState) {
        this.$log.debug('clazz_detail receive props .... ');
        Object.assign(this, selectedState);
    }

    mapStateToThis(state) {
        return {
            clazz: state.profile_clazz.selectedClazz
        }
    }

    back(){
        this.go('clazz_manage');
    }
}

