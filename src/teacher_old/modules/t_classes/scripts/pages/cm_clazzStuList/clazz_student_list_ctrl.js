/**
 * Created by 彭建伦 on 2015/7/29.
 */
const ROW_NUM = 3;

import {Inject, View, Directive, select} from '../../module';

@View('clazz_student_list', {
    url: '/clazz_student_list/?clazzId&type&stuNum',
    styles:require('./style.less'),
    template: require('./clazz_student_list.html'),
    inject:[
    '$scope',
    '$rootScope',
    '$log', '$stateParams',
    '$ionicActionSheet',
    '$ionicLoading', '$state',
    '$interval',
    'clazzService',
    'finalData',
    'commonService',
    '$ionicPopup',
    '$ngRedux']
})

class clazzStudentListCtrl {
    $log;
    $stateParams;
    $ionicActionSheet;
    $ionicLoading;
    $interval;
    clazzService;
    finalData;
    commonService;
    $ionicPopup;
    @select("cm_added_stu_list") Students;
    listType = this.$stateParams.type;
    stuNum = this.$stateParams.stuNum;
    clazzId = this.$stateParams.clazzId;
    reasons = [
        {code: '1', text: '班级已存在该学生'},
        {code: '2', text: '该生不是我班学生，请家长确认'},
        {code: '3', text: '无法确认学生身份，请补充信息'}
    ];
    Levels = [   //学生层级
        {level: 'A'},
        {level: 'B'},
        {level: 'C'},
        {level: 'D'}
    ];
    initCtrl = false;
    retFlag = false;

    showFlag = false;
    defaultOption = null;
    selectValue = {value:null};
    selectLevel = null;
    listIndex;
    editStudent = null;

    onAfterEnterView() {
        this.initRetFlag();
        if (this.listType == 1) {
            this.getAddedStuList();
        } else {
            this.getAddingStuList();
        }
    }

    back(){
        if(this.showFlag){
            this.showFlag=false
            this.getScope().$digest();
            return ;
        }
        this.go("home.clazz_manage")
    }

    initRetFlag() {
        if (!this.clazzId) { //参数判断
            this.$log.error("clazzId is undefined!");
            return;
        }
    }

    refreshStuList() {
        if (!this.clazzId) {
            this.getScope().$broadcast('scroll.refreshComplete');
            return
        }
        this.clazzService.getStuList({classId: this.clazzId, status: 1}).then(data=> {
            if (!data) {
                this.getScope().$broadcast('scroll.refreshComplete');
                this.commonService.alertDialog('网络连接不畅，请稍后再试');
            }
            this.retFlag = true;
            this.getScope().$broadcast('scroll.refreshComplete');
        });
    }

    /**
     * 选择原因
     * @param selectedReason
     */
    selectedReason(selectedReason) {
        angular.forEach(this.reasons, function (reason) {
            reason.selected = false;
        });
        selectedReason.selected = true;
    };

    /**
     * 根据班级ID获取班级中审核通过的学生
     */
    getAddedStuList() {
        this.clazzService.getStuList({classId: this.clazzId, status: 1}).then(data=> {
            if (!data) {
                this.commonService.alertDialog('网络连接不畅，请稍后再试');
            }
            this.retFlag = true;
        });
    }

    /**
     * 根据班级ID获取班级中申请的学生
     */
    getAddingStuList() {
        this.clazzService.getClazzStudentListByStatus(this.clazzId, this.finalData.CHECK_STATUS_AUDIT).then(data=> {
            if (data.code == 200) {
                this.hasSameName = false;
                data.records.forEach(item=> {
                    if (item.hasSameName == 1) {
                        this.hasSameName = true;
                    }
                });
                this.addingStus = this.commonService.getRowColArray(data.records, ROW_NUM);

                this.retFlag = true;
            } else {
                this.commonService.alertDialog(JSON.stringify(data.msg));
            }
        });
    }


    /**
     * 选择学生
     * @param $event  点击事件
     * @param addingStu    申请的学生
     */
    selectStu($event, addingStu) {
        $event.currentTarget.firstElementChild.hidden = addingStu.selectedStu || false;
        addingStu.selectedStu = !addingStu.selectedStu;
    };


    /**
     * 通过
     */
    passBtnClick() {
        var checkedArray = this.commonService.getRowColArrayChecked(this.addingStus, "selectedStu", true);
        if (!checkedArray || checkedArray.length == 0) {
            this.commonService.alertDialog("请先选择学生！");
            return;
        }

        var template = '<div><p>您确定要通过该申请吗？</p></div>';
        this.commonService.showConfirm('信息提示', template).then(res=> {
            if (res)
                this.submitRequest(1);
        });

    };

    /**
     * 拒绝
     */
    refuseClick() {
        angular.forEach(this.reasons, function (reason) {
            reason.selected = false;
        });
        var checkedArray = this.commonService.getRowColArrayChecked(this.addingStus, "selectedStu", true);
        if (!checkedArray || checkedArray.length == 0) {
            this.commonService.alertDialog("请先选择学生！");
            return;
        }
        var template =
            `<div class="student_detail_file">
                    <p class="reason-tip">请选择一个拒绝该学生的原因：</p>
                    <div ng-repeat="reason in ctrl.reasons" >
                        <ion-checkbox ng-click="ctrl.selectedReason(reason)" ng-model="reason.selected" class="select-reason-checkbox">{{reason.text}}</ion-checkbox>
                    </div>
                </div>`;
        var refuseConfirm = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: template,
            title: "信息提示",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: e=> {
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
        refuseConfirm.then(res=> {
            if (res)
                this.submitRequest(-1);
        });

    };

    showAns() {
        this.$ionicPopup.alert({
            title: '常见问题',
            template: `
                <p style="color: #377AE6">问：后加入的学生能看到先前布置的作业吗？</p>
                 <p>答：1、先前发给“全班”的作业，后加入的学生能自动收到。</p>
                <p>2、先前分层布置的作业，后加入的学生看不到，需要老师将该学生分层后，在作业列表中按住作业项向左滑，点击“补发作业”。</p>
                <p style="color: #377AE6">问：怎么查看学生的信息？</p>
                <p>点击学生姓名可以查看学生详细信息</p>`,
            okText: '确定'
        });
    }

    /**
     * 忽略
     */
    ignoreClick() {
        this.submitRequest(-2);
    };

    /**
     * 提交请求
     * @param index 类型
     */
    submitRequest(index) {
        var checkedArray = this.commonService.getRowColArrayChecked(this.addingStus, "selectedStu", true);
        if (!checkedArray || checkedArray.length == 0) {
            this.commonService.alertDialog("请先选择学生！");
            return;
        }
        this.count = checkedArray.length;
        var details = [];
        for (var i = 0; i < checkedArray.length; i++) {
            var detail = {};
            detail.studentId = checkedArray[i]["id"];
            detail.status = index;
            details.push(detail);
        }
        if (details.length > 0) {
            this.clazzService.teacherAudit(this.clazzId, details).then(data=> {
                this.getAddingStuList();//刷新申请学生列表
                //801学生通过成功，同时成功补发作业数量
                //802学生通过成功，但是补发作业失败
                //803学生通过成功，班上还没有作业补发
                if (data && (data.code === 801 || data.code === 802 || data.code === 803)) {
                    var template = `<div><p style="font-size: 18px">${data.msg}</p></div>`;
                    this.commonService.showAlert('信息提示', template);
                    return;
                }
                this.commonService.alertDialog(data.msg, 2000);
            });
        }
    }

    /**
     * 获取当前编辑按钮的值
     * @param index 按钮索引
     * @returns 按钮的值
     */
    getBtnValue(index) {
        var btnValue;
        switch (index) {
            case 0: //审批通过
                btnValue = 1;
                break;
            case 1://拒绝
                btnValue = -1;
                break;
            case 2: //忽略
                btnValue = -2;
                break;
        }
        return btnValue;
    }

    /**
     * @description 处理编辑按钮的点击
     */
    handleEditBtnClick() {
        var hideSheet = this.$ionicActionSheet.show({
            /* titleText: "编辑学生",*/
            buttons: [
                {text: "<b class='ion-checkmark-circled'>通过</b>"},
                {text: "<b class='ion-close-circled'>拒绝</b>"},
                {text: "<b class='ion-navicon-round'>忽略</b>"}
            ],
            buttonClicked: index=> {
                console.log(this);
                hideSheet();//点击编辑菜单后，就隐藏编辑菜单。
                var checkedArray = this.commonService.getRowColArrayChecked(this.addingStus, "selectedStu", true);
                if (!checkedArray || checkedArray.length == 0) {
                    this.commonService.alertDialog("请先选择学生！");
                    return;
                }
                this.$ionicLoading.show({
                    template: "正在处理，请稍后..."
                });
                this.count = checkedArray.length;
                var status = this.getBtnValue(index);
                var details = [];
                for (var i = 0; i < checkedArray.length; i++) {
                    var detail = {};
                    detail.studentId = checkedArray[i]["id"];
                    detail.status = status;
                    details.push(detail);
                }
                if (details.length > 0) {
                    this.clazzService.teacherAudit(this.clazzId, details).then(data=> {
                        if (data) {
                            //处理成功!
                            //this.count=this.count-1;
                            this.$ionicLoading.hide();
                            this.getAddingStuList();//刷新申请学生列表
                            this.commonService.alertDialog("请求处理成功!");
                        }
                    });
                }

            },
            cancelText: "<b class='ion-forward'>取消</b>"
        });
    };

    levelChange(letter, $index) {
        $index = $index || this.listIndex;
        letter = letter || this.selectLevel;
        if (!this.selectValue.value) return;
        this.editStudent.level = this.selectValue.value;
        let currentStu = this.Students[letter][$index];
        this.clazzService.levelChange(letter, $index).then((data) => {
            if (!data) {
                this.commonService.alertDialog('网络连接不畅，请稍后再试', 1500);
            } else {
                this.commonService.alertDialog(
                    `<p>成功将 <span style="color: #00ff89">${currentStu.name}</span> 分到 <span style="color: #00ff89">${currentStu.level}</span> 层</p>`
                    , 1500
                );
            }
        });
    };

    answer() {
        this.$ionicPopup.alert({
            title: '信息提示',
            template: '<p>可以把学生分成不同层，对不同层发布不同作业</p>' +
            '<p>点击学生姓名可以查看学生详细信息</p>',
            okText: '确定'
        });
    };

    /**
     * 去学生详情
     */
    goStuDetail(stuId) {
        this.clazzService.studentParam.stuId = stuId;
        this.clazzService.studentParam.clazzId = this.clazzId;
        this.clazzService.studentParam.listType = this.listType;
        this.clazzService.studentParam.stuNum = this.stuNum;
        this.getStateService().go("student_detail");
    }

    filterStuGetFillNum(stuArry, isSameName) {
        let num = 0;
        for (let i = 0; i < stuArry.length; i++) {
            if (isSameName && stuArry[i].hasSameName == 1) {
                num++
            }
            if (!isSameName && stuArry[i].hasSameName == 0) {
                num++
            }
        }
        return (ROW_NUM - num % ROW_NUM) % ROW_NUM + '';
    }

    showListSelect(student, letter, $index) {
        this.showFlag = true;
        this.selectLevel = letter;
        this.Levels.forEach((v, k)=> {
            if (this.Levels[k].level == student.level) this.defaultOption = Number(k);
        });
        this.listIndex = $index;
        this.editStudent = student;
    }
}

export default clazzStudentListCtrl
