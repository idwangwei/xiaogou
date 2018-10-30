/**
 * Created by 邓小龙 on 2015/2/01.
 */
import {Inject, View, Directive, select} from '../../module';
import localStore from 'local_store/localStore';
import _each from 'lodash.foreach';

@View('about', {
    url: '/about',
    template: require('./about.html'),
    styles: require('./about.less'),
    inject: ['$ngRedux',
        '$scope',
        'appInfoService',
        '$log',
        'ngLocalStore',
        'commonService',
        '$rootScope',
        '$state']
})
class AboutCtrl {
    appInfoService;
    ngLocalStore;
    constructor(){
        this.initFlags();
        this.initData();
    }

    initFlags() {
        this.clickCount = 0;
        this.paperAnsArray = [];
        this.appNumVersion = "";
        this.initCtrl = false;
    }

    initData() {
        this.localStore = localStore;
    }

    onAfterEnterView() {
    }

    back() {
        this.go('home.me');
    }

    clickImg() {
        this.clickCount++;
        if (this.clickCount == 4) {
            this.getLocalStorageAns();
        }
        if (this.clickCount === 5) {
            this.localStore.clear();
        }
    }

    getLocalStorageAns() {
        var saveAnsInfo;
        var me = this;
        saveAnsInfo = me.commonService.getLocalStorage('do_paper_time');

        _each(saveAnsInfo, function (obj) {
            if (!obj.paperInstanceID) {
                return
            }
            let paperLocalAns = me.$ngRedux.getState().wl_paper_answer[me.loginName + '/' + obj.paperInstanceID];
            if (paperLocalAns && paperLocalAns.length != 0) {
                var paper = {};
                paper.paperName = obj.paperName;
                paper.intervalTime = (obj.intervalTime / 1000) + "S";
                paper.saveAnsCount = paperLocalAns.length;
                me.paperAnsArray.push(paper);
            }
        });


    }

    onReceiveProps(selectedState, selectedAction) {
        this.$log.debug('about receive props ....');
        let $scope = this.getScope();
        Object.assign($scope, selectedState, selectedAction);
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.appNumVersion = this.commonService.getAppNumVersion();
        }

        if (!this.changeLog)
            this.getChangeLog();
    }

    mapStateToThis(state) {
        return {
            loginName: state.profile_user_auth.user.loginName,
            /*  appNumVersion: state.app_info.appVersion,*/
            changeLog: state.app_info.changeLog
        }
    }

    mapActionToThis() {
        return {
            getAppNumVersion: this.appInfoService.getAppNumVersion,
            getChangeLog: this.appInfoService.getChangeLog
        }
    }

}