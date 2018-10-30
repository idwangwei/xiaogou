/**
 * Created by 华海川 on 2016/3/11.
 * 学生详情
 */

import {Inject, View, Directive, select} from '../../module';

@View('student_detail', {
    url: '/student_detail',
    styles: require('./style.less'),
    template: require('./student_detail.html'),
    inject: ['$scope'
        , '$state'
        , 'clazzService'
        , 'commonService'
        , '$rootScope', '$ngRedux'
        , '$ionicActionSheet'
        , '$log'
        , '$stateParams'
        , '$ionicPopup']
})

class studentDetailCtrl {
    clazzService;
    commonService;
    $ionicPopup;
    /*@select(state=>state.cm_select_stu_detail.student) studentInfo ;
     @select(state=>state.cm_select_stu_detail.parent) parentInfo ;*/
    @select(state=>state.cm_select_stu_detail) myInfo;
    studentParam = this.clazzService.studentParam; //学生列表过来的参数
    studentInfo;
    parentInfo;

    reasons = [
        {code: '1', text: '班级已存在该学生'},
        {code: '2', text: '该生不是我班学生，请家长确认'},
        {code: '3', text: '无法确认学生身份，请补充信息'}
    ];

    constructor() {


    }

    onAfterEnterView() {
        this.getStudentInfo();
    }

    getStudentInfo() {
        this.clazzService.getStudentInfo({stuId: this.studentParam.stuId}).then(data=> {
            if (data.code != 200) {
                this.commonService.alertDialog('网络连接不畅，请稍后再试', 1200);
            }
            this.studentInfo = data.student;
            this.parentInfo = data.parent;

            //todo 暴力修改家长名字为学生名字加（男的就为爸爸，女的就为妈妈）第二监护人不修改，待后端修改
            if (this.parentInfo instanceof Array) {
                this.parentInfo.forEach((item)=> {
                    if (item.loginName.match(/p/i)) {
                        item.name = this.studentInfo.name + (item.gender == 1 ? '爸爸' : '妈妈')
                    }
                })
            }
        });
    };

    /**
     * 选择原因
     * @param reason
     */
    selectedReason(selectedReason) {
        angular.forEach(this.reasons, function (reason) {
            reason.selected = false;
        });
        selectedReason.selected = true;
    };

    deleteStudent() {
        angular.forEach(this.reasons, function (reason) {
            reason.selected = false;
        });
        var template =
            `<div class="student_detail_file">
                    <p class="reason-tip">请选择一个拒绝该学生的原因：</p>
                    <div ng-repeat="reason in ctrl.reasons" >
                        <ion-checkbox ng-click="ctrl.selectedReason(reason)" ng-model="reason.selected" class="select-reason-checkbox">{{reason.text}}</ion-checkbox>
                    </div>
                </div>`;
        var deleteConfirm = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: template,
            title: "信息提示",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: e => {
                        var hasSelect = false;
                        angular.forEach(this.reasons, function (reason) {
                            if (reason.selected)
                                hasSelect = true;
                        });
                        if (!hasSelect) {
                            e.preventDefault();
                            return;
                        }
                        return true;
                    }
                },
                {
                    text: "取消",
                    type: "",
                    onTap: function (e) {
                        return false;
                    }
                }

            ]
        });
        deleteConfirm.then(res=> {
            if (res) {
                this.clazzService.deleteStudent({
                    classId: this.studentParam.clazzId,
                    studentId: this.studentParam.stuId
                }).then(data=> {
                    if (data.code == 200) {
                        this.commonService.alertDialog('删除成功');
                        this.getStateService().go('clazz_student_list', {
                            clazzId: this.studentParam.clazzId,
                            type: this.studentParam.listType,
                            stuNum: parseInt(this.studentParam.stuNum) - 1
                        });
                        return;
                    }
                    this.commonService.alertDialog('网络连接不畅，请稍后再试', 1200);
                })
            }
        });
    };

    back() {
        this.getStateService().go('clazz_student_list', {
            clazzId: this.studentParam.clazzId,
            type: this.studentParam.listType,
            stuNum: this.studentParam.stuNum
        });
    }
}

export default studentDetailCtrl;