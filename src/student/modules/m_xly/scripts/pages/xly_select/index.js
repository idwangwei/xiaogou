/**
 * Created by ZL on 2017/7/12.
 */
import {Inject, View, Directive, select} from '../../module';

@View('xly_select', {
    url: '/xly_select/:backUrl/:isIncreaseScore',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:['$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', '$ionicHistory', '$ionicLoading', 'commonService', 'wxPayService']
})
class dayTaskCtrl {
    commonService;
    wxPayService;
    xlyObj = {};
    goodsListObj = {};
    // currentPlan = '';
    goodsDesc = {};
    plans = [
        {type: 'planA', text: 'A计划', selected: true},
        {type: 'planB', text: 'B计划', selected: false}];
    currentPlan = this.plans[0].type;

    @select(state=>state.fetch_diagnose_camp_goods_processing) processing;

    initData() {
        this.backUrl = this.getStateService().params.backUrl || "home.study_index";
        this.xlyObj = {};
        this.goodsListObj = {};
        this.goodsDesc = {};
        /* this.plans = [
         {type: 'planA', text: 'A计划', selected: true},
         {type: 'planB', text: 'B计划', selected: false}];*/

        // this.isLoadingProcessing = true;
    }

    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过
    }

    changePlan($index) {
        this.currentPlan = this.plans[$index].type;
        angular.forEach(this.plans, (v, k)=> {
            this.plans[k].selected = false;
        });
        this.plans[$index].selected = true;
        this.getCurrentPlanDesc();
    }

    back() {
        this.go(this.backUrl, this.getStateService().params);
        this.getScope().$root.$injector.get('$ionicViewSwitcher').nextDirection('back');
    }

    joinPlan() {
        this.go('year_card_pay', {xlyType: this.currentPlan});
    }

    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
    }

    onAfterEnterView() {
        this.initData();
        this.fetchCampGoodsList().then((data)=> {
            if (data && data.code == 200) {
                this.analyzeData(data);
                // this.isLoadingProcessing = false;
            }
        });
    }

    /**
     * 解析数据
     */
    analyzeData(data) {
        if (data.xly) {
            angular.forEach(data.xly, (item)=> {
                item.desc = JSON.parse(item.desc);
                //todo 国庆大礼包
                // item.desc.saleFee = 399;
                // item.desc.saleMsg = '双节优惠价';
                if (!this.xlyObj[item.desc.type]) this.xlyObj[item.desc.type] = [];
                this.xlyObj[item.desc.type].push(item);
            });
        }

        let keyArr = Object.keys(this.xlyObj);
        angular.forEach(keyArr, (v, k)=> {
            this.goodsListObj[v] = angular.copy(data[v]);
        });

        this.getCurrentPlanDesc();

    }

    getCurrentPlanDesc() {
        if (this.xlyObj[this.currentPlan]) {
            this.goodsDesc = this.xlyObj[this.currentPlan][0];
        }
    }

    alertDialog() {
        let htmlStr = '<p><b>1.</b>您先加入计划，然后将您的账号分享给您要邀请的人。</p>' +
            '<p><b>2.</b>让被邀请人在加入本计划时，输入您的账号领取50元奖金。</p>' +
            '<p><b>3.</b>ta加入成功后，您的邀请就成功了！</p>'
        this.commonService.showAlert('如何邀请？', htmlStr,'我知道了！');
    }

    configDataPipe() {
    }

    mapActionToThis() {
        return {
            fetchCampGoodsList: this.wxPayService.fetchCampGoods.bind(this.wxPayService),
        }
    }


}

// export default dayTaskCtrl;