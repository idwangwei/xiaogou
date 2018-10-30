/**
 * Author ww on 2016/10/18.
 * @description 错误学生列表controller
 */

import {Inject, View, Directive, select} from '../../module';
import _each from 'lodash.foreach';
import _sortBy from 'lodash.sortby';

@View('error_student_list', {
    url: '/error_student_list',
    template: require('./error_student_list.html'),
    styles: require('./error_student_list.less'),
    inject:[
        '$scope'
        , '$state'
        , '$rootScope'
        , '$ionicScrollDelegate'
        , '$ionicActionSheet'
        , '$ngRedux'
        , '$ionicHistory'
        , 'workListService'
    ]
})

export default class ErrorStudentListCtrl{
    $ionicScrollDelegate;
    $ionicActionSheet;
    $ionicHistory;
    @select(state=>state.wl_selected_work) currentWork;
    @select(state=>state.wl_statistics_error_info) statErrorInfo;
    @select(state=>state.wl_fetch_statistics_error_info_processing) fetchProcessing;
    cBNameFlag = false;
    cBQFlag = false;

    constructor(){


    }
    back() {
        //this.getStateService().go('work_statistics')
        this.$ionicHistory.goBack()
    }
    /**
     * 滚动到顶部
     */
    scrollTop() {
        this.$ionicScrollDelegate.scrollTop(true);
    };
    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition() {
        if (this.$ionicScrollDelegate.getScrollPosition().top >= 250) {
            $('.scrollToTop').fadeIn();
        }
        else {
            $('.scrollToTop').fadeOut();
        }
    };



    /**
     * 显示名称控制
     */
    showNameManage() {
        if(!this.statErrorInfo.errorStudentList){return}

        this.cBNameFlag = !this.cBNameFlag;
        _each(this.statErrorInfo.errorStudentList, (stu)=>{
            stu.showAllNameFlag = this.cBNameFlag;
        });
    };

    /**
     * 显示试题控制
     */
    showQManage() {
        if(!this.statErrorInfo.errorStudentList){return}

        this.cBQFlag = !this.cBQFlag;
        _each(this.statErrorInfo.errorStudentList, (stu)=>{
            stu.showQFlag = this.cBQFlag;
        });
    };

    /**
     * 显示学生姓名
     */
    showStuName($event, stu) {
        stu.showAllNameFlag = !stu.showAllNameFlag;
        $event.stopPropagation();
    };

    /**
     * 展示或隐藏试题
     * @param stu
     */
    showQ ($event, stu) {
        stu.showQFlag = !stu.showQFlag;
        $event.stopPropagation();
    };

    /**
     * 排序
     */
    handleSortBtnClick() {
        var hideSheet = this.$ionicActionSheet.show({
            /* titleText: "学生成绩排序",*/
            buttons: [
                {text: "<b class='ion-arrow-down-c'>分数(高-低)</b>"},
                {text: "<b class='ion-arrow-up-c'>分数(低-高)</b>"}
            ],
            buttonClicked: (index)=>{
                hideSheet();//点击编辑菜单后，就隐藏编辑菜单。
                this.statErrorInfo.errorStudentList = _sortBy(this.statErrorInfo.errorStudentList, (data)=>{
                    return index ? data.score : -data.score;
                });

            },
            cancelText: "<b class='ion-forward'>取消</b>"
        });
    };

}