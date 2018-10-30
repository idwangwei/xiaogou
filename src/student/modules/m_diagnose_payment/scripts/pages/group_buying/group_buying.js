/**
 * Created by ZL on 2017/2/13.
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';

class groupBuying extends BaseController {
    constructor() {
        super(arguments);
    }

    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过
        this.screenWidth = window.innerWidth;
    }

    initData() {
        this.goodsDescriptionList = [
            "2至5人团，提高版/进阶版/无敌版分别优惠20元/30元/50元;",
            "6至10人团，提高版/进阶版/无敌版分别优惠20元/30元/50元；团购组织者优惠198元;",
            "11至20人团，提高版/进阶版/无敌版分别优惠20元/30元/50元；团购组织者优惠298元;",
            "20人以上团，提高版/进阶版/无敌版分别优惠20元/30元/50元；团购组织者优惠498元;",
        ];

        this.backUrl = this.getStateService().params.urlFrom || "home.diagnose02";//this.$stateParams.urlFrom;
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
    }


    onBeforeLeaveView() {
        //离开当前页面时，cancel由所有当前页发起的请求
        this.wxPayService.cancelDiagnoseGoodsMenusRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.wxPayService.cancelDiagnoseGoodsMenusRequestList.splice(0, this.wxPayService.cancelDiagnoseGoodsMenusRequestList.length);//清空请求列表
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    onAfterEnterView() {
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.fetchGoodsMenus();
        }
    }

    back() {
        this.go('weixin_pay_select', 'forward', {urlFrom: this.backUrl,backWorkReportUrl:this.backWorkReportUrl});
    }

    createTeam() {
        this.go('group_buying_create', 'forward', {urlFrom: this.backUrl,backWorkReportUrl:this.backWorkReportUrl});
    }

    mapStateToThis(state) {
        return {
            groupBuyingGoodsMenusList: state.group_buying_goods_list
        };
    }

    mapActionToThis() {
        return {
            fetchGoodsMenus: this.wxPayService.fetchGroupBuyingGoodsMenus.bind(this.wxPayService),
        }
    }
}
groupBuying.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , '$stateParams'
    , 'commonService'
    , '$ngRedux'
    , '$ionicPopup'
    , 'wxPayService'
    , '$ionicLoading'
    , '$timeout'
    , '$ionicHistory'
];
controllers.controller("groupBuying", groupBuying);

