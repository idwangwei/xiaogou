/**
 * Created by ZL on 2017/9/13.
 */
import $ from 'jquery';
import {Inject, View, Directive, select} from '../../module';
@View('assign_oral_arithmetic', {
    url: 'assign_oral_arithmetic/:isFirst',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$state',
        '$rootScope',
        '$ngRedux',
        '$ionicPopup',
        '$timeout',
        'commonService',
        'finalData',
        'workChapterPaperService'

    ]
})

class assignOralArithmeticCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    workChapterPaperService;
    optionCount = [
        {
            name: '10道',
            value: 10,
            selected: true
        },
        {
            name: '20道',
            value: 20,
            selected: false
        },
        {
            name: '30道',
            value: 30,
            selected: false
        },
        {
            name: '自定义',
            value: '',
            selected: false,
            diy: true
        }
    ];
    optionTime = [
        {
            name: '10分钟',
            value: 10,
            selected: true
        },
        {
            name: '30分钟',
            value: 30,
            selected: false
        },
        {
            name: '不限制',
            value: -1,
            selected: false
        },
        {
            name: '自定义',
            value: '',
            selected: false,
            diy: true
        }
    ];
    optionHandwrite= true;
    paperName = '';

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.profile_user_auth.user.userId) userId;
    @select(state=>state.wr_selected_unit) selectedUnit;
    constructor(){

        
    }
    initData() {
        this.paperName = this.workChapterPaperService.oralCalculationTempQues.paperName;
        let isFirstStr = this.getStateService().params.isFirst;
        if (typeof isFirstStr == 'string') {
            this.isFirst = JSON.parse(this.getStateService().params.isFirst);
        } else {
            this.isFirst = isFirstStr;
        }
    }


    selectCount(item) {
        angular.forEach(this.optionCount, (v, k)=> {
            this.optionCount[k].selected = false;
        });
        item.selected = true;
        this.optionCount[this.optionCount.length - 1].value = '';
    }

    setDiyCount(item) {
        if (Number(item.value) <= 0) {
            this.commonService.alertDialog('请输入大于0的数', 800);
            item.value = '';
            return;
        }
        if (Number(item.value) > 100) {
            this.commonService.alertDialog('题量最多布置100道', 800);
            item.value = 100;
            return;
        }
    }

    selectTime(item) {
        angular.forEach(this.optionTime, (v, k)=> {
            this.optionTime[k].selected = false;
        });
        item.selected = true;
        this.optionTime[this.optionTime.length - 1].value = '';
    }

    setDiyTime(item) {

        if (Number(item.value) <= 0 || !Number.isInteger(Number(item.value))) {
            this.commonService.alertDialog('请输入大于0的整数', 1500);
            item.value = '';
            $('.time-setting-item-diy input').val('');
            return;
        }
    }

    onAfterEnterView() {
        this.initData();
        this.workChapterPaperService.checkClassStudentCount(this.isFirst)
            .then((data)=> {
                if(data&&data.code==200){
                    if (data.normalPaperView) {
                        this.commonService.showAlert('温馨提示', data.normalPaperView || '老师所带的班级中，没有一个班级的人数是大于等于5，则不能够布置作业')
                            .then(()=> {
                                this.go('work_chapter_paper');
                            });

                    }
                }else{
                    this.commonService.alertDialog(data.msg||'班级校验失败');
                }
            })
    }

    onBeforeEnterView() {

    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {


    }

    back() {
        this.go('work_chapter_paper');
    }

    getQuesNumAndLimitTime() {
        let quesNum = 0;
        let limtTime = 0;

        angular.forEach(this.optionCount, (v, k)=> {
            if (this.optionCount[k].selected) quesNum = Number(this.optionCount[k].value);
        });
        angular.forEach(this.optionTime, (v, k)=> {
            if (this.optionTime[k].selected) limtTime = Number(this.optionTime[k].value);
        });

        return {quesNum: quesNum, limitTime: limtTime};
    }

    mapActionToThis() {
        return {
            selectPaper: this.workChapterPaperService.selectedDetailPaper.bind(this.workChapterPaperService),
        }
    }

    builderQues() {
        let obj = this.getQuesNumAndLimitTime();
        if (!obj.quesNum) {
            this.commonService.showAlert('警告', '自定义题量设置不能为空');
            return
        }
        if (!obj.limitTime) {
            this.commonService.showAlert('警告', '自定义时间设置不能为空');
            return
        }
        this.workChapterPaperService
            .produceOralCalculation(this.userId, this.selectedUnit.unitId, obj.quesNum, obj.limitTime,this.optionHandwrite)
            .then((data)=> {
                if (data && data.code == 200) {
                    this.selectPaper(JSON.parse(data.paper));
                    this.go('oral_arithmetic_view', {
                        isFirst:this.isFirst,
                        publishType:this.optionHandwrite?this.finalData.WORK_TYPE.ORAL_WORK:this.finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
                    });
                } else {
                    this.commonService.showAlert('提示', '该单元没有口算题可布置');
                }

            });

    }
    changeHandWrite(){
        if(!this.optionHandwrite){
            this.commonService.alertDialog('答题方式修改为键盘输入',2500);
        }else {
            this.commonService.alertDialog('答题方式修改为手写输入',2500);
        }
    }


}

export default assignOralArithmeticCtrl;