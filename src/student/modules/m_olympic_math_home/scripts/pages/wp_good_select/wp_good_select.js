/**
 * Created by ZL on 2017/3/2.
 */
import lodash_assign from 'lodash.assign';
import _ from 'underscore';
import {Inject, View, Directive, select} from '../../module';
@View('wp_good_select', {
    url: '/wp_good_pay_select/:urlFrom',
    template: require('./wp_good_select.html'),
    styles: require('./wp_good_select.less'),
    inject: [
        '$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , 'commonService'
        , '$ngRedux'
        , '$ionicPopup'
        , 'wxpayOmService'
        , '$ionicLoading'
        , '$timeout'
        , '$ionicHistory'
        , 'workStatisticsServices'
    ]
})
class wpGoodSelect{
    constructor() {
        this.initFlags();
        this.initData();
    }

    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }

    initData() {
        this.goodsDescription = [
            "所选年级所有考点的奥数题",
            "每一道题的详细答案和解析",
            "自由组卷练习，巩固薄弱环节"
        ];
        this.grades = [
            {name: '一年级', value: '一年级'},
            {name: '二年级', value: '二年级'},
            {name: '三年级', value: '三年级'},
            {name: '四年级', value: '四年级'},
            {name: '五年级', value: '五年级'},
            {name: '六年级', value: '六年级'}
        ];
        this.allGrade = "一到六年级";
        this.isShowSelect = false;
        this.selectGrade = null;
        this.goodsMenusList = [];
        this.allGoodsList = "";
        this.defaultGrade = "";
        this.selectedGrade = '三年级';//TODO 去掉

        // this.loadStatus = true;//商品列表加载状态


        this.urlFrom = this.getStateService().params.urlFrom || "home.olympic_math_home";//this.$stateParams.urlFrom;

    }

    hideSelectList() {
        this.isShowSelect = false;
    }

    /**
     * 显示年级选择框
     */
    showSelectGrade() {
        this.isShowSelect = false;//TODO 删除
        // this.toast("其他年级暂未开放", 1000);
        this.commonService.alertDialog("其他年级暂未开放!", 800);
        return;

        if (this.isShowSelect) {
            this.isShowSelect = false;
        } else {
            this.isShowSelect = true;
        }
    };

    /**
     * 选择年级
     */
    clickSelectGrade(item) {
        this.selectGrade = item.value;
        this.getGoodsListByGrade();
        this.isShowSelect = false;
    }

    /**
     * 根据选择的年级获取相应的商品列表
     */
    getGoodsListByGrade() {
        this.goodsMenusList.length = 0;
        angular.forEach(this.allGoodsList, (v, k)=> {
            var gradeMark = this.allGoodsList[k].desc.title.match(/(\S*)\u5e74\u7ea7/)[0];
            // var sMark = this.allGoodsList[k].desc.title.match(/([\u4e00-\u9fa5])/g).join("").match(/\u5e74\u7ea7(\S*)\u5965\u6570/)[1];
            var sMark = this.allGoodsList[k].desc.title.match(/\u5e74\u7ea7（(\S*)）\u5965\u6570/)[1];
            if (gradeMark == this.selectGrade || gradeMark == this.allGrade) {
                //this.allGoodsList[k].desc.fee != "0"屏蔽10天免费的商品
                if (this.selectGrade == "三年级" && sMark == "上册" && this.allGoodsList[k].desc.fee != "0") {
                    // this.allGoodsList[k].available = true;
                    this.goodsMenusList.push(lodash_assign({available: true}, this.allGoodsList[k]));
                } else {
                    this.goodsMenusList.push(lodash_assign({}, this.allGoodsList[k]));
                }

            }
        });
    }

    /**
     * 数据加载失败重新加载、
     * @param index
     */
    reFfetchGoodsList() {
        this.fetchGoodsMenusList().then((data)=> {
            if (data.code == 200) {
                this.getGoodsListByGrade();
            }
        });
    }

    selectGoodClick(index) {

        if (!this.goodsMenusList[index].available) {
            // this.toast("该内容暂未开放", 1000);
            this.commonService.alertDialog("该内容暂未开放!", 800);
            return;
        }

        if (!this.goodsMenusList[index].selected) {
            angular.forEach(this.goodsMenusList, (v, k) => {
                this.goodsMenusList[k].selected = false;
            });
            this.goodsMenusList[index].selected = true;
        } else {
            this.goodsMenusList[index].selected = false;
        }
    }

    selectGood() {
        var selectGood = "";
        angular.forEach(this.goodsMenusList, (v, k) => {
            if (this.goodsMenusList[k].selected) {
                selectGood = this.goodsMenusList[k];
            }
        });
        if (!selectGood) {
            this.$ionicLoading.show({
                template: "请先选择一个版本",
                duration: 800
            });
            return;
        }

        if (selectGood.desc.fee == 0) {
            this.selectGoodService(selectGood);
            if (this.selectGrade) this.selectGradeService(this.selectGrade);
            this.dealFreeGood(selectGood);
        } else {
            var gradeNum = this.setGoodIndex(selectGood);//
            var reminderWord = this.checkRepeatBuy(gradeNum);
            if (reminderWord) {
                var title = '提示';
                var info = '<div style="text-align: center; width=100%;"><p>'
                    + reminderWord
                    + '已包含在您已经购买的商品中，确定还要购买吗?'
                    + '</p></div>';
                this.commonService.showConfirm(title, info).then((res)=> {
                    if (!res)return;
                    this.selectGoodService(selectGood, this.callBack.bind(this));
                    if (this.selectGrade) this.selectGradeService(this.selectGrade);
                });
            } else {
                this.selectGoodService(selectGood, this.callBack.bind(this));
                if (this.selectGrade)  this.selectGradeService(this.selectGrade);
            }
        }
    }

    /**
     * 处理免费商品
     */
    dealFreeGood(selectGood) {
        this.orderFreeGoods(selectGood.id)
            .then((data)=> {
                if (data.code == 200) {
                    var alertPopup = this.myPormp('购买成功');
                    alertPopup.then((res)=> {
                        this.fetchOlympicMathVips(this.goToOlympicMath.bind(this));
                    });
                } else if (data.code.toString().match('700')) {//失败
                    this.myPormp(data.msg);
                } else {
                    this.myPormp('购买过程中，出现些意外');
                }
            });
    }

    //免费购买的成功回调
    goToOlympicMath() {

        if (this.urlFrom == "olympic_math_work_list") {
            let param = this.workStatisticsServices.routeInfo.urlFrom;
            this.go(this.urlFrom, {urlFrom: param});
        } else {
            this.go(this.urlFrom);
        }
    }


    setGoodIndex(selectDood) {
        let gradesList = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
        let grade = selectDood.desc.title.match(/(\S*)\u5e74\u7ea7/)[0];
        let semester = selectDood.desc.title.match(/\u5e74\u7ea7(\S*)\u5965\u6570/)[1];
        semester = semester.match(/([\u4e00-\u9fa5])/g).join("");

        if (grade == "一到六") {
            return _.range(13).slice(1);
        }
        return this.getGradeNum(gradesList.indexOf(grade), semester);
    }

    getGradeNum(index, semester) {
        var gradeNum = [];
        if (semester == '上册') gradeNum.push(index * 2 + 1);
        if (semester == '下册') gradeNum.push(index * 2 + 2);
        if (semester == '上、下册') gradeNum.push(index * 2 + 1, index * 2 + 2);
        return gradeNum;
    }

    /**
     * 判断是否重复购买
     */
    checkRepeatBuy_old(gradeNum) {
        var vipStr = "";
        let gradesList = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
        angular.forEach(this.vips, (v, k)=> {
            if (Object.keys(v)[0] && Object.keys(v)[0].match('mathematicalOlympiad') && Number(Object.values(v)[0]) > 0) {
                vipStr += Object.keys(v)[0];
            }
        });
        var vipGoodsIndex = vipStr.match(/\d+/g);//所有购买过的商品编号
        vipGoodsIndex = _.uniq(vipGoodsIndex);
        var repeatGood = [];//重复购买的商品编号
        var reminderWord = "";//提示重复的年级
        angular.forEach(gradeNum, (v, k)=> {
            if (vipGoodsIndex.indexOf(gradeNum[k].toString()) != -1) {
                repeatGood.push(k);
                var gradeStr = "";
                var semesterStr = "";
                if (Number(gradeNum[k]) % 2) {
                    gradeStr = gradesList[(Number(gradeNum[k]) - 1) / 2];
                    semesterStr = "上册";
                } else {
                    gradeStr = gradesList[(Number(gradeNum[k]) - 2) / 2];
                    semesterStr = "下册";
                }
                reminderWord += '《' + gradeStr + semesterStr + '》'
            }
        });

        return reminderWord;


    }


    /**
     * 判断是否重复购买
     */
    checkRepeatBuy(gradeNum) {
        // var vipStr = "";
        let gradesList = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
        var mathOlymVip = null;
        angular.forEach(this.vips, (v, k)=> {
            if (Object.keys(v)[0] && Object.keys(v)[0].match('mathematicalOlympiad')) {
                mathOlymVip = lodash_assign({}, this.vips[k]);
            }
        });
        if (!mathOlymVip || mathOlymVip && !mathOlymVip.mathematicalOlympiad) return;

        var vipGoodsIndex = Object.keys(mathOlymVip.mathematicalOlympiad);//所有购买过的商品编号
        vipGoodsIndex = _.uniq(vipGoodsIndex);

        var repeatGood = [];//重复购买的商品编号
        var reminderWord = "";//提示重复的年级
        angular.forEach(gradeNum, (v, k)=> {
            if (vipGoodsIndex.indexOf(gradeNum[k].toString()) != -1) {
                repeatGood.push(k);
                var gradeStr = "";
                var semesterStr = "";
                if (Number(gradeNum[k]) % 2) {
                    gradeStr = gradesList[(Number(gradeNum[k]) - 1) / 2];
                    semesterStr = "上册";
                } else {
                    gradeStr = gradesList[(Number(gradeNum[k]) - 2) / 2];
                    semesterStr = "下册";
                }
                reminderWord += '《' + gradeStr + semesterStr + '》'
            }
        });

        return reminderWord;


    }

    callBack() {
        var alertPopup = this.$ionicPopup.alert({
            title: '确认支付',
            template: '<div style="text-align: center; width=100%;"><p>购买前必须告诉爸爸妈妈</p><p>不要擅自购买哦！</p></div>',
            buttons: [
                {text: '说过了，去支付'}
            ]
        });
        alertPopup.then((res)=> {
            this.go('wp_good_pay', 'forward', {urlFrom: this.urlFrom});
        });
    }


    /**
     * 测试题
     */
    doQuestion() {
        this.$ionicPopup.prompt({
            template: 'π等于多少？',
            title: '测试题',
            subTitle: 'π等于多少',
            inputType: 'text',
            inputPlaceholder: '输入答案',
            defaultText: '',
            maxLength: 6,
            cancelText: '取消', // String (默认: 'Cancel')。取消按钮的文字。
            okText: '确定', // String (默认: 'OK')。OK按钮的文字。
        }).then(function (res) {
            if (res == 3.14) {
                console.log('您的答案是', res);
            } else {
                return;
            }

        });
    }


    doQuestion1() {

        // $scope.showPopup = function() {
        this.quesAns = "";

        // An elaborate, custom popup
        var myPopup = this.$ionicPopup.show({
            template: '<input type="password" ng-model="quesAns">',
            title: 'Enter Wi-Fi Password',
            subTitle: 'Please use normal things',
            scope: this,
            buttons: [
                {text: '取消'},
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!this.quesAns) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            console.log('您的答案是', this.quesAns);
                            return this.quesAns;
                        }
                    }
                },
            ]
        });
        /* myPopup.then(function(res) {
         console.log('Tapped!', res);
         });*/

    }


    back() {
        var title = '提示';
        var info = '<div style="text-align: center; width=100%;"><p>确定要退出支付吗?</p></div>';
        this.commonService.showConfirm(title, info).then((res)=> {
            if (!res)return;
            if (this.urlFrom == "olympic_math_work_list") {
                let param = this.workStatisticsServices.routeInfo.urlFrom;
                this.go(this.urlFrom, {urlFrom: param});
            } else {
                this.go(this.urlFrom);
            }

        });
    }

    /**
     * 弹出提示框
     * @param msg
     */
    toast(msg, t) {
        let time = t || 1000;
        if (window.parent.plugins && window.parent.plugins.toast) {
            window.parent.plugins.toast.show(msg, time, 'center');
        } else {
            this.$ionicLoading.show({
                template: msg,
                duration: time,
                noBackdrop: true
            });
        }
    }

    /**
     * 提示语
     */
    myPormp(msg) {
        var alertPopup = this.$ionicPopup.alert({
            title: '购买结果',
            template: '<div style="text-align: center; width=100%;">' + msg + '</div>',
            buttons: [
                {text: '确定'}
            ]
        });
        return alertPopup;
    }

    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.wxpayOmService.cancelOmGoodsMenusRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.wxpayOmService.cancelOmGoodsMenusRequestList.splice(0, this.wxpayOmService.cancelOmGoodsMenusRequestList.length);//清空请求列表
    }


    onReceiveProps() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.fetchGoodsMenusList();
        }
        //设置选择年级的默认值
        if (this.selectedGrade) {
            this.selectGrade = this.selectedGrade;
            this.getGoodsListByGrade();
        } else if (this.classList && this.classList.length > 0) {
            this.defaultGrade = this.classList[0].grade;
            if (this.defaultGrade) {
                let index = Number(this.defaultGrade) - 1;
                this.selectGrade = this.grades[index].value;
                this.getGoodsListByGrade();
            }
        }

        /*if (this.classList && this.classList.length > 0) {
         this.defaultGrade = this.classList[0].grade;
         }
         if (this.defaultGrade) {
         let index = Number(this.defaultGrade) - 1;
         this.selectGrade = this.grades[index].value;
         this.getGoodsListByGrade();
         }*/
    }

    onAfterEnterView() {
    }

    mapStateToThis(state) {
        return {
            isLoadingProcessing: state.fetch_wei_xin_pay_02_goods_processing,
            allGoodsList: state.mo_goods_menus_list,
            vips: state.profile_user_auth.user.vips,
            classList: state.profile_clazz.passClazzList,
            // selectedGrade: state.wei_xin_pay_02_select_grade.grade, //TODO 后面去掉注释
        };
    }

    mapActionToThis() {
        return {
            fetchGoodsMenusList: this.wxpayOmService.fetchGoodsMenus.bind(this.wxpayOmService),
            selectGoodService: this.wxpayOmService.selectedGood.bind(this.wxpayOmService),
            selectGradeService: this.wxpayOmService.selectedGrade.bind(this.wxpayOmService),
            orderFreeGoods: this.wxpayOmService.orderFreeGoods.bind(this.wxpayOmService),
            fetchOlympicMathVips: this.workStatisticsServices.fetchOlympicMathVips.bind(this.workStatisticsServices)
        }
    }
}
