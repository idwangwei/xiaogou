/**
 * Author 邓小龙 on 2017/03/03.
 * @description 作业列表
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';

class OlympicMathTListCtrl  extends WorkListCommonCtrl  {
    constructor() {
        super(arguments);
        this.initTimeSelect();
    }

}
OlympicMathTListCtrl.$inject = [
    '$scope'
    , '$state'
    , '$stateParams'
    , 'workStatisticsServices'
    , 'commonService'
    , 'profileService'
    , '$ngRedux'
    , 'pageRefreshManager'
    , '$ionicPopup'
    , 'paperService'
    , '$ionicTabsDelegate'
    , '$timeout'
    , 'finalData'
    , '$ionicSideMenuDelegate'
    , 'subHeaderService'
    , 'dateUtil'
    , 'pageRefreshManager'
    , '$rootScope'
    , '$ionicSlideBoxDelegate'
    , '$ionicTabsDelegate'
    , '$ionicPopover'
    , '$ionicScrollDelegate'
    , 'homeInfoService'
    , '$ionicPopover'


];
controllers.controller("olympicMathTListCtrl", OlympicMathTListCtrl);





