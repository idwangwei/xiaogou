/**
 * Created by qiyuexi on 2017/12/19.
 */
import {Inject, View, Directive, select} from './../../module';
import NTC from '../../tools/numToChinese'

@View('home.micro_unit_list', {
    url: '/micro_unit_list',
    views: {
        "study_index": {
            template: require('./page.html'),
            styles: require('./style.less'),
        }
    },
    inject: [
        '$scope'
        , '$state'
        , '$ngRedux'
        , '$stateParams'
        , '$ionicHistory'
        , '$rootScope'
        , '$ionicSideMenuDelegate'
        , 'microUnitService'
        , 'wxPayService'
        , '$ionicPopup'
    ]
})

class MicroUnitListCtrl {
    $ionicSideMenuDelegate
    microUnitService
    wxPayService
    $ionicPopup
    @select(state => state.micro_grade_list) allGradeList;
    @select(state => state.micro_unit_list) allUnitList;
    @select(state => state.micro_select_unit_grade) selectUnitGrade;
    @select(state => state.profile_user_auth.user.vips) vipInfo;

    onBeforeLeaveView() {
        this.microUnitService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.microUnitService.cancelRequestList.length = 0;
    }

    constructor() {
        this.resetGradeInfo = [];
        this.resetUnitList = [];
        this.resetGrassList = [];
        this.gradeList = [
            {
                id: "1",
                title: "一年级",
                subtitle: "上"
            },
            {
                id: "2",
                title: "一年级",
                subtitle: "下"
            },
            {
                id: "3",
                title: "二年级",
                subtitle: "上"
            },
            {
                id: "4",
                title: "二年级",
                subtitle: "下"
            },
            {
                id: "5",
                title: "三年级",
                subtitle: "上"
            }, {
                id: "6",
                title: "三年级",
                subtitle: "下"
            }, {
                id: "7",
                title: "四年级",
                subtitle: "上"
            }, {
                id: "8",
                title: "四年级",
                subtitle: "下"
            }, {
                id: "9",
                title: "五年级",
                subtitle: "上"
            }, {
                id: "10",
                title: "五年级",
                subtitle: "下"
            }, {
                id: "11",
                title: "六年级",
                subtitle: "上"
            }, {
                id: "12",
                title: "六年级",
                subtitle: "下"
            }
        ];
    }

    onAfterEnterView() {
        this.initData();
        this.initFn();
    }

    mapActionToThis() {
        return {
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService)
        }
    }

    /*初始化页面数据*/
    initData() {
        this.vipNum = 0;
        this.currentGrade = this.selectUnitGrade&&this.selectUnitGrade.id && this.selectUnitGrade || this.gradeList[5];//当前所选择的年级 如果state里面拿不到就取默认的三年级下册
    }

    /*初始化页面方法*/
    initFn() {
        this.getVipNum();
        this.paySuccessModifyVips().then(() => {
            this.getVipNum();
        });//更新个数
        this.fetchMicroGradeList().then(() => {
            this.setGradeList();
            this.fetchMicroUnitList().then(() => {
                this.setMicroUnitList();
                this.calcGrassPosition(this.resetUnitList.length)
            })
        })
    }

    /*草草的坐标*/
    calcGrassPosition(len) {
        let height = 98, width = 250;
        let vw = window.innerWidth;
        let arr = [];
        for (var i = 0; i < len; i++) {
            let top = i * height + Math.floor(Math.random() * (height - 20)) + 10
            let left = 0;
            if (i % 2 == 0) {
                left = (vw - width) / 2 - Math.floor(Math.random() * 50) - 25
            } else {
                left = (vw - width) / 2 + width + Math.floor(Math.random() * 40)
            }
            arr.push({left, top})
        }
        this.resetGrassList = arr;
        return arr;
    }

    /*切换左边slide menu*/
    toggleLeft() {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    changeGrade(v) {
        this.$ionicSideMenuDelegate.toggleLeft();
        if (v.id == this.currentGrade.id) return;//如果一样就不继续执行了
        this.microUnitService.selectMicroUnitGrade(v);//储存起来
        this.currentGrade = v;
        this.fetchMicroUnitList().then(() => {
            this.setMicroUnitList();
        })
    }

    fetchMicroUnitList() {
        return this.microUnitService.fetchMicroUnitList({
            teachingMaterial: "ASWK",
            grade: this.currentGrade.id
        })
    }

    setMicroUnitList() {
        this.resetUnitList = [];
        this.allUnitList.sort((a, b) => {
            return a.seq_num - b.seq_num;
        })
        this.allUnitList.forEach((x, i) => {
            let arr = x.content.split(" ");
            let isOpen = x.permission ? "enable" : "disable";
            arr[0] = arr[1].replace(/(\d+)./, "")
            arr[1] = RegExp.$1;
            this.resetUnitList.push({
                id: x.id,
                title: "第" + arr[1] + "讲",
                subtitle: arr[0],
                isOpen: isOpen,
                code: x.code
            })
        })
    }

    fetchMicroGradeList() {
        return this.microUnitService.fetchMicroGradeList({})
    }

    setGradeList() {
        this.resetGradeInfo = {
            data: [],
            isAllOpen: true
        };
        this.allGradeList.forEach((x, i) => {
            let itm = this.gradeList.find(y => y.id == x.id);
            Object.assign(x, itm);
            if (x.isOpen) {
                this.resetGradeInfo.data.push(x);
            }
        })
        if (this.resetGradeInfo.data.length < this.allGradeList.length) {
            this.resetGradeInfo.isAllOpen = false;
        }
        let index = this.resetGradeInfo.data.findIndex(x => x.id == this.currentGrade.id);
        if (index == -1) {
            this.currentGrade = this.resetGradeInfo.data[0];
            this.microUnitService.selectMicroUnitGrade(this.currentGrade);//储存起来
        }
    }

    getVipNum() {
        this.vipInfo.forEach((x, i) => {
            if (x.hasOwnProperty('tinyClassKey')) this.vipNum = x.tinyClassKey;
        });
    }

    /*去例子列表*/
    goToExample(v) {
        if (v.isOpen == "disable") {
            this.$ionicPopup.alert({
                title: '提示',
                template: '该课程还未开放，敬请期待！'
            });
            return;
        }
        this.microUnitService.selectMicroUnitItem(v);//储存起来
        this.go("micro_example_list")
    }

    /*去支付页面*/
    goToPay() {
        this.microUnitService.savePayBackUrl("home.micro_unit_list")
        this.go("micro_lecture_pay")
    }

    back() {
        /*如果侧滑打开了 那就先关闭侧滑 android返回键*/
        // if (this.$ionicSideMenuDelegate.isOpenLeft()) {
        //     this.$ionicSideMenuDelegate.toggleLeft();
        //     return;
        // }
        this.go('home.study_index', "back");
        // this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');
    }
}

export default MicroUnitListCtrl