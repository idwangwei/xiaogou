/**
 * Created by ZL on 2017/1/9.
 */
import friendCircle from "./../../../../m_boot/bootImages/friend-circle.png";
import {Inject, View, Directive, select} from '../../module';

@View('weixin_pay_select', {
    url: '/weixin_pay_select/:urlFrom/:backWorkReportUrl/:isIncreaseScore',
    styles: require('./weixin_pay_select.less'),
    template: require('./weixin_pay_select.html'),
    inject:['$scope'
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
        , '$ionicActionSheet'
        ,'$ionicSlideBoxDelegate'
        ,'bargainService'
        ,'finalData']
})
class weixinPaySelect{
    @select(state=>state.fetch_goods_menus_processing) isLoadingProcessing;
    @select(state=>state.diagnose_goods_menus_list) diagnoseGoodsMenusList;
    constructor(){
        this.initFlags();
        this.initData();
    }
    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过
        this.screenWidth = window.innerWidth;
        this.isIos = this.commonService.judgeSYS() == 2;
    }

    initData() {
        this.goodsDescription = [
            "精准分析学生的薄弱考点",
            "智能推送薄弱考点的针对性练习",
            "所有考点的诊断报告",
            "每一道题的详细答案和解析",
            "紧扣考纲，快速提分"
        ];
        this.goodsDescriptionV2 = [
            "开通“诊断提分”可以对整个教材所有课时的考点进行全面诊断分析。",
            "考点和题目由11名小升初命题专家，21名特级教师，联合一线名师， 以历年小升初和期末真题为基础，紧扣考纲，精心打造。"
        ];
        this.quesAndAns = [
            {
                ques:{
                    text:'我练了一堆题，可到底哪些考点还没覆盖到？哪些已经掌握？哪些还要加强呢？',
                    img:'diagnose_promote/diagnose_promote_img01.png'
                },
                ans:{
                    text:'用“诊断提分”查漏补缺！',
                    img:'diagnose_promote/diagnose_promote_img.png'
                }
            },
            {
                ques:{
                    text:'找到我的薄弱考点，到哪里去进行针对性练习呢？',
                    img:'diagnose_promote/diagnose_promote_img02.png'
                },
                ans:{
                    text:'用“诊断提分”智能变式训练！',
                    img:'diagnose_promote/diagnose_promote_img.png'
                }
            },
            {
                ques:{
                    text:'通过“诊断提分”测试版，很多同学的期末考试成绩提高了一大截， 成功晋级学霸。',
                    img:'diagnose_promote/diagnose_promote_img03.png'
                },
                ans:{
                    text:'现在正式版已推出，欢迎加入。',
                    img:'diagnose_promote/diagnose_promote_img.png'
                }
            }
        ];
        this.backUrl = this.getStateService().params.urlFrom || "home.diagnose02";//this.$stateParams.urlFrom;
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
        this.shareFlag = false;
        this.friendCircle = friendCircle;
        this.isIncreaseScore = this.getStateService().params.isIncreaseScore == 'true' || this.getRootScope().isIncreaseScore;
    }

    toGroupBuying() {
        this.go('group_buying', 'forward', {urlFrom: this.backUrl, backWorkReportUrl: this.backWorkReportUrl});

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
        this.$ionicSlideBoxDelegate.$getByHandle('game-goods-select-box').update();
        this.shareFlag = false;
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
        /*angular.forEach(this.diagnoseGoodsMenusList,(v,k)=>{
            this.diagnoseGoodsMenusList[k].shareFlag = false;
            this.diagnoseGoodsMenusList[k].fee = Number(this.diagnoseGoodsMenusList[k].desc.fee);
        });*/
        // this.diagnoseGoodsMenusList = _.indexBy(this.diagnoseGoodsMenusList, 'fee');

        // this.ensurePageData();

        // this.towGoodsMenusList
        this.getBargainInfo();
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            if(!this.isIncreaseScore){
                this.fetchGoodsMenus()
            }
        }
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
            // console.log('Thank you for not eating my delicious ice cream cone');
            this.go('weixin_pay', 'forward', {urlFrom: this.backUrl, backWorkReportUrl: this.backWorkReportUrl,cut:(this.bargainData.data.discountPrice||0)/100});
        });
    }

    back() {
        var title = '提示';
        var info = '<div style="text-align: center; width=100%;"><p>确定要退出支付吗?</p></div>';
        this.commonService.showConfirm(title, info).then((res)=> {
            if (!res)return;
            this.go(this.isIncreaseScore ? 'diagnose_knowledge02':this.backUrl
                ,{backWorkReportUrl: this.backWorkReportUrl, isIncreaseScore:this.isIncreaseScore}
            );
        });
    }

    selectGood() {
        var selectGood = "";
        angular.forEach(this.diagnoseGoodsMenusList, (v, k) => {
            if (this.diagnoseGoodsMenusList[k].selected) {
                selectGood = this.diagnoseGoodsMenusList[k];
            }
        });
        if (!selectGood) {
            this.$ionicLoading.show({
                template: "请先选择一个版本",
                duration: 800
            });
            return;
        }
        if(this.bargainData.data.discountPrice-selectGood.desc.maxDis*100>0){
            this.bargainData.data.discountPrice=selectGood.desc.maxDis*100;
        }
        this.selectGoodService(selectGood, this.callBack.bind(this));
    }

    selectGoodClick(index) {
        if (!this.diagnoseGoodsMenusList[index].selected) {
            angular.forEach(this.diagnoseGoodsMenusList, (v, k) => {
                this.diagnoseGoodsMenusList[k].selected = false;
            });
            this.diagnoseGoodsMenusList[index].selected = true;
            this.getBargainInfo(this.diagnoseGoodsMenusList[index]);
        } else {
            this.resetBargainInfo()
            this.diagnoseGoodsMenusList[index].selected = false;
        }

    }
    /**
     * 分享
     */
    shareForFavorable($event) {
        if(typeof $event === 'object'&& $event.stopPropagation){
            $event.stopPropagation();
        }else if(event && event.stopPropagation){
            event.stopPropagation();
        }

        if (this.getRootScope().platform.IS_WINDOWS || this.getRootScope().platform.IS_MAC_OS){
            this.commonService.showAlert('温馨提示','请用手机登录智算365，去分享');
            return;
        }

        let shareContent = `智算365的“学霸驯宠”，用强大的智能技术，助我的孩子轻松提分！`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="friend-circle-share-img" src="${friendCircle}">推荐到朋友圈`},
            ],
            titleText: `<div style="text-align: center">
                        <div class="share-content">${shareContent}</div></div>`,
            cancelText: '取消',
            buttonClicked: (index)=> {
                if (!this.getScope().$root.weChatInstalled) {
                    this.commonService.showAlert("提示", "没有安装微信！");
                    return;
                }
                Wechat.share({
                    scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                    message: {
                        title: shareContent,
                        description: shareContent,
                        text: shareContent,
                        thumb: "http://xuexiv.com/img/icon.png",
                        mediaTagName: "TEST-TAG-001",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>dotalist</action>",
                        media: {
                            type: Wechat.Type.LINK,
                            webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
                        }
                    },
                }, ()=> {
                    this.commonService.showAlert("提示", "分享成功！");
                    this.shareFlag = true;
                }, (reason)=> {
                    this.commonService.showAlert("提示", reason);
                });

                return true;
            }
        });
    }

    calculateOriginalPrice(item,freePrice){
        let price = item.desc.saleFee || item.desc.fee;
        return Number(price) + Number(freePrice);
    }

   /* mapStateToThis(state) {
        return {
            isLoadingProcessing: state.fetch_goods_menus_processing,
            diagnoseGoodsMenusList: state.diagnose_goods_menus_list
        };
    }
*/
    mapActionToThis() {
        return {
            fetchGoodsMenus: this.wxPayService.fetchGoodsMenus.bind(this.wxPayService),
            selectGoodService: this.wxPayService.selectedGood.bind(this.wxPayService)
        }
    }
    gotoBargainIndex(){
        var selectGood = "";
        angular.forEach(this.diagnoseGoodsMenusList, (v, k) => {
            if (this.diagnoseGoodsMenusList[k].selected) {
                selectGood = this.diagnoseGoodsMenusList[k];
            }
        });
        this.go("bargain_index",{id:selectGood.id,maxDis:selectGood.desc.maxDis,title:"学霸驯宠"+selectGood.desc.subTitle,oldTotal:selectGood.desc.fee*100})
        // this.go("bargain_detail")
    }
    gotoBargainDetail(){
        var selectGood = "";
        angular.forEach(this.diagnoseGoodsMenusList, (v, k) => {
            if (this.diagnoseGoodsMenusList[k].selected) {
                selectGood = this.diagnoseGoodsMenusList[k];
            }
        });
        this.selectGoodService(selectGood, new Function());
        this.go("bargain_detail",{id:this.bargainData.data.id,payUrl:"weixin_pay",title:"学霸驯宠"+selectGood.desc.subTitle,oldTotal:selectGood.desc.fee*100,goodsId:selectGood.id,maxDis:selectGood.desc.maxDis})
        // this.go("bargain_detail")
    }
    getBargainInfo(item){
        if(!item){
            var selectGood = "";
            angular.forEach(this.diagnoseGoodsMenusList, (v, k) => {
                if (this.diagnoseGoodsMenusList[k].selected) {
                    selectGood = this.diagnoseGoodsMenusList[k];
                }
            });
            if(selectGood=="") return
            item=selectGood
        }
        this.bargainService.fetchBargainStatus({
            goodsId:item.id
        }).then((data)=>{
            data.title="学霸驯宠"+item.desc.subTitle;
            data.oldTotal=item.desc.fee*100;
            data.maxDis=item.desc.maxDis||0;
            data.goodsId=item.id;
            this.bargainData={
                status:data.status,
                data:data
            }
        })
    }
    resetBargainInfo(){
        this.bargainData={
            status:-2,
            data:{}
        }
    }
}