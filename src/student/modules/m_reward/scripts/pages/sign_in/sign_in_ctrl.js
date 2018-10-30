/**
 * Created by Administrator on 2017/5/2.
 */
// import BaseController from 'base_components/base_ctrl';
import {Inject, View, Directive, select} from '../../module';
@View('reward_sign_in', {
    url: '/reward_sign_in/:getDone/:backUrl',
    template: require('./sign_in.html'),
    styles: require('./sign_in.less'),
    inject:[
        '$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        '$ionicHistory',
        'rewardSystemService',
        '$ionicLoading'
    ]
})

class signInCtrl {
    @select(state=>state.sign_in_info) signInfo;
    @select(state=>state.sign_in_status) signInTime;
    constructor(){
        /*后退注册*/

    }
    initData() {
        let date = new Date();
        this.dateStr = "" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDay();
        this.signDays = [];
        this.allDays = ['一', '二', '三', '四', '五', '六', '七'];
        this.isSignDone = false;
        this.getCapacity = 0;
    }

    loadSignImg(imgUrl) {
        return require('../../../reward_images/signIn/' + imgUrl);
    }

    signScoreMark(index) {
        /*  if (item.status) {
         return this.loadSignImg('sign_get.png');
         } else {*/
        let imgUrl = "sign_credits";
        if (Number(index) == 0) {
            imgUrl += '1' + ".png";
        } else {
            imgUrl += index + ".png";
        }
        /* switch (item.score) {
         case 10:
         imgUrl = 'sign_credits4.png';
         break;
         case 6:
         imgUrl = 'sign_credits1.png';
         break;
         case 4:
         imgUrl = 'sign_credits2.png';
         break;
         case 2:
         imgUrl = 'sign_credits3.png';
         break;
         default:
         imgUrl = 'sign_credits3.png';
         break;
         }*/
        return this.loadSignImg(imgUrl);

        // }

    }

    analysisSignInfo() {
        if (!this.signDays) return;
        var days = Object.keys(this.signInfo.credits);

        angular.forEach(days, (v, k)=> {
            this.signDays[Number(v) - 1] = {};
            this.signDays[Number(v) - 1].day = Number(v);
            this.signDays[Number(v) - 1].score = this.signInfo.credits[v];
            if (Number(v) <= this.signInfo.signed) this.signDays[Number(v) - 1].status = true;//已签到
            if (Number(v) - 1 == this.signInfo.signed) {
                this.signDays[Number(v) - 1].currentSign = true;
            }
        })

    }


    /**
     * 点击领取签到
     * @param flag
     */
    signIn(item) {
        if(item.status){
            this.toast("已领奖", 1000);
            return
        }
        if(item.day > this.signInfo.signed && (!item.currentSign||!this.signInfo.canSignIn)){
            this.toast("还未到领奖时间", 1000);
            return
        }
        if (!this.signInfo.canSignIn || this.isSignDone) {
            this.toast("今日已签到", 1000);
            return;
        }
        if (!item.currentSign) return;

        // if(!this.signInfo.canSignIn) return;
        let signServer = this.rewardSystemService.doneSignIn();
        signServer.then((data)=> {
            if (data && data.code == 200) {
                if (data.signOk) {
                    item.status = true;
                    this.isSignDone = true;
                    this.getCapacity =item.score;
                    // this.toast("签到成功", 1000);
                    this.showRewardPrompt();
                } else {
                    this.toast("签到失败", 1000);
                }
            }

        })

    }

    getSignInfo() {
        var signSrever = this.rewardSystemService.getSignInInfo();
        signSrever.then((data)=> {
            if (data && data.code == 200) {
                this.analysisSignInfo();
            }

        })
    }

    back() {
        if(this.getRootScope().showRewardPrompt){
            this.getRootScope().showRewardPrompt = false;
            this.getRootScope().$digest();
        }else if (this.backUrl) {
            this.go(this.backUrl)
        } else {
            this.go('home.me');
        }
    }

    /**
     * 弹出提示框
     * @param msg
     */
    toast(msg, t) {
        let time = t || 1000;
        this.$ionicLoading.show({
            template: msg,
            duration: time,
            noBackdrop: true
        });
    }

    showRewardPrompt(){
        this.getRootScope().showRewardPrompt = true;
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        this.initData();
        if (this.getDone) {
            this.analysisSignInfo();
        } else {
            this.getSignInfo();
        }
    }

    configDataPipe() {
        this.getDone = this.getStateService().params.getDone;
        this.backUrl = this.getStateService().params.backUrl;
    }
}