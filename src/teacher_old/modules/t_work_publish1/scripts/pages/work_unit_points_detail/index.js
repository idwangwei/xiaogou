/**
 * Created by Administrator on 2016/8/3.
 */

import {Inject, View, Directive, select} from '../../module';
const SUBHEADER_TEXT='教学要点';
@View('work_unit_points_detail', {
    url: '/work_unit_points_detail',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:[
        '$rootScope'
        ,'$scope'
        ,'$state'
        ,'$ionicHistory'
        ,'$ionicPopup'
        ,'$ionicScrollDelegate'
        ,'$ngRedux'
        ,'commonService'
    ]
})
class WorkUnitPointsDetailCtrl{
    constructor(){
        this.initData();
    }
    initData(){
        this.subHeaderText = SUBHEADER_TEXT;
        this.headerText = null;
        this.isUnit = true;
        this.pointsList = [];
        this.isIos = this.commonService.judgeSYS() === 2;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData(){}

    back(){
        this.$ionicHistory.goBack();
    }
    help(){
        this.$ionicPopup.alert({
            title: '提示信息',
            template: '<p>展示信息为当前单元所包含的知识点。</p>',
            okText: '确定'
        });
    }

    /**
     * 滚动到顶部
     */
    scrollTop () {
        this.$ionicScrollDelegate.scrollTop(true);
    };
    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition () {
        if (this.$ionicScrollDelegate.getScrollPosition().top>= 250) {
            $('.scrollToTop').fadeIn();
        }
        else {
            $('.scrollToTop').fadeOut();
        }
    };

    mapStateToThis(state) {
        let selectUnit = state.wr_selected_unit;
        let unitPoints = state.wr_unit_points;
        let unitId = selectUnit && selectUnit.unitId;
        let headerText = selectUnit && selectUnit.unitName;

        return {
            selectUnit:state.wr_selected_unit,
            unitPoints:state.wr_unit_points,
            headerText:headerText,
            pointsList:unitPoints[unitId]
        }
    }
    mapActionToThis() {
        return {
        }
    }
}
export default WorkUnitPointsDetailCtrl;