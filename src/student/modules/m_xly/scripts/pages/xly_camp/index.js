/**
 * Created by WL on 2017/7/6.
 */

import {Inject, View, Directive, select} from '../../module';

@View('smart_training_camp', {
    url: '/smart_training_camp/:backUrl',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:['$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', 'commonService','wxPayService']
})
class smartTrainingCamp {

    @select(state => (state.profile_user_auth.user.loginName)) loginName;
    @select(state => (state.smart_training_camp_info.joinTime)) joinTime;
    @select(state => (state.smart_training_camp_info.refund)) ShowMoney;
    @select(state => (state.smart_training_camp_info.progressReward)) progressRewardFlag; //共同进步奖是否已经领取
    @select(state => (state.smart_training_camp_info.studyReward)) studyRewardFlag;  //学霸训练奖是否已经领取
    @select(state => (state.smart_training_camp_info.invitation)) stuList;
    @select(state => (state.smart_training_camp_info.studyRewardExpire)) studyRewardExpire; //学霸训练奖是否可以领取
    @select(state => (state.smart_training_camp_info.endTime)) endTime;
    @select(state => (state.smart_training_camp_info.studyRewardDesc)) smartInfoDetails;
    @select(state => (state.smart_training_camp_info.progressRewardDesc)) improveInfoDetails;
    @select(state => (state.smart_training_camp_info.inviteReduce)) saleMoney; //优惠金额

    $stateParams;
    commonService;
    wxPayService;
    rewardType = this.wxPayService.rewardType;
    showPromptAlert = false;
    currentPromoteType = "";
    backUrl = this.$stateParams.backUrl || "home.study_index";
    promoteType = {
        SMART_SUCCESS: "SMART_SUCCESS",
        SMART_FAIL: "SMART_FAIL",
        IMPROVE_SUCCESS: "IMPROVE_SUCCESS",
        IMPROVE_FAIL: 'IMPROVE_FAIL',
    };
    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    initFlag() {
        this.showPromptAlert = false;
    }

    mapActionToThis() {
        let wxPayService = this.wxPayService;
        return {
            getCampInfo: wxPayService.getTrainingCampInfo.bind(wxPayService),
            getCampReward: wxPayService.getTrainCampReward.bind(wxPayService),
        }
    }

    onBeforeLeaveView() {
        this.wxPayService.cancelTrainingCampRequestList.forEach(cancelDefer => {
            cancelDefer.resolve(true);
        });
        this.wxPayService.cancelTrainingCampRequestList = [];
    }

    onReceiveProps() {

    }


    onAfterEnterView() {
        this.getRewardFlag = true;
        this.getMyCampInfo();
    }

    getMyCampInfo(){
        this.getCampInfo().then((data)=>{
            if(data.code != 200){
                this.commonService.alertDialog("网络连接不畅，请稍后重试...");
            }
        })
    }

    getMyCampReward(rewardType){
        this.getCampReward(rewardType).then((data)=>{
            this.getRewardFlag = true;
            if(data.code == 200){
                if(data.success){
                    this.showPromptAlert = true;
                }else{
                    this.commonService.alertDialog("领取奖励失败...");
                }
            }else{
                this.commonService.alertDialog("网络连接不畅，请稍后重试...");
            }
        })
    }

    /**
     * 显示领取学霸奖弹出框
     */
    showSmartAlert() {
        if(!this.getRewardFlag) return;
        if(!this.studyRewardExpire){ //不可领取
            this.currentPromoteType = this.promoteType.SMART_FAIL;
            this.showPromptAlert = true;
            return;
        }
        this.getRewardFlag = false;
        this.currentPromoteType = this.promoteType.SMART_SUCCESS;
        this.getMyCampReward(this.rewardType.STUDY);
    }


    /**
     * 显示领取共同进步奖弹出框
     */
    showImproveAlert() {
        if(!this.getRewardFlag) return;
        if(this.stuList && this.stuList.length < 2){
            this.currentPromoteType = this.promoteType.IMPROVE_FAIL;
            this.showPromptAlert = true;
            return;
        }
        this.getRewardFlag = false;
        this.currentPromoteType = this.promoteType.IMPROVE_SUCCESS;
        this.getMyCampReward(this.rewardType.IMPROVE);
    }

    hidePromote() {
        this.showPromptAlert = false;
    }


    back() {
        this.go(this.backUrl,{isIncreaseScore:this.getRootScope().isIncreaseScore});
        this.getScope().$root.$injector.get('$ionicViewSwitcher').nextDirection('back');

    }

    buyCheap(){
        this.go("year_card_pay");
    }


}


// export default smartTrainingCamp;