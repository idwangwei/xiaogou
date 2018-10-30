/**
 * Created by 华海川 on 2016/3/26.
 * 作业列表和游戏列表共用选择班级
 */
/**
 * edit by zl on 2018.1.11
 * 暂时未使用的页面，放在这里，以后需要的时候修改
 */

import controllers from './../index';
import {stateGo} from './../../redux/lib/redux-ui-router/index';


class SelectClazzCtrl {
    constructor($scope, profileService, finalData, $ionicHistory, $state, $stateParams, commonService, $ngRedux, workStatisticsServices, gameService,$rootScope) {
        this.FROM_WORK_LIST = "work";
        this.FROM_GAME_LIST = "game";
        this.WORK_STYLE = {
            BAR: {"background": "#d2f7ef"},
            CONTENT: {"background": "#6dace4"},
            TITLE: {"color": "#4a6b9d"}
        };
        this.GAME_STYLE = {
            BAR: {"background": "#Fefecf"},
            CONTENT: {"background": "#F9766F"},
            TITLE: {"color": "#ec674a"}
        };
        this.$ionicHistory = $ionicHistory;
        this.$stateParams = $stateParams;
        this.commonService = commonService;
        this.$state = $state;
        this.$rootScope = $rootScope;
        let actions = {};
        Object.assign(actions, {
            changWorkListClazz: workStatisticsServices.changeClazz,
            changeGameListClazz: gameService.changeClazz
        });
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(function (selectedState, selectedAction) {
            Object.assign(this, selectedState, selectedAction);
        }.bind(this));
        this.initData();
        $scope.$on('$destroy', ()=> {
            unsubscribe();
        });
        this.$rootScope.viewGoBack = this.back.bind(this);
    }

    initData() {
        if (this.$stateParams.from == this.FROM_WORK_LIST) {              //作业和游戏列表样式初始化
            this.barBalanced = this.WORK_STYLE.BAR;
            this.contentBg = this.WORK_STYLE.CONTENT;
            this.titleColor = this.WORK_STYLE.TITLE
        } else {
            this.barBalanced = this.GAME_STYLE.BAR;
            this.contentBg = this.GAME_STYLE.CONTENT;
            this.titleColor = this.GAME_STYLE.TITLE;
        }
    }

    mapStateToThis(state) {
        return {
            passClazzList: state.getIn(['profile', 'passClazzList'])
        }
    }

    selectClazz(clazz) {
        if (this.$stateParams.from == this.FROM_WORK_LIST) {
            this.commonService.setLocalStorage("workSelectClazz", {name: clazz.name, id: clazz.id});
            this.changWorkListClazz(clazz);
            this.$state.go('home.work_list', {clzId: clazz.id});
        } else {
            this.commonService.setLocalStorage("gameSelectClazz", {name: clazz.name, id: clazz.id});
            this.changeGameListClazz(clazz);
            this.$state.go('home.game_list', {clzId: clazz.id});
        }
    }

    back() {
        this.$ionicHistory.goBack();
    }

}

SelectClazzCtrl.$inject = [
    '$scope',
    'profileService',
    'finalData',
    '$ionicHistory',
    '$state',
    '$stateParams',
    'commonService',
    '$ngRedux',
    'workStatisticsServices',
    'gameService',
    '$rootScope'
];
controllers.controller('selectClazzCtrl', SelectClazzCtrl);
