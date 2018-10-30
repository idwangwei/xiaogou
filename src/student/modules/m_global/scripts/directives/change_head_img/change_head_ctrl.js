/**
 * Created by Administrator on 2017/5/11.
 */

// import BaseController from 'base_components/base_ctrl';
import changeBtn from './change_head_image/change_btn.png';
import chooseBtn from './change_head_image/choose_head.png';

class changeHeadCtrl {

    constructor($scope, $state, $ngRedux, profileService, $rootScope, commonService) {
        // super(arguments);
        this.initData();
    }

    initData() {
        this.currtenHead = this.$ngRedux.getState().user_reward_base.avator;
        this.changeHeadImgIndex = this.profileService.changeHeadImg.bind(this.profileService);
        this.headImgs = [];
        this.changeBtn = changeBtn;
        this.chooseBtn = chooseBtn;
        if (this.currtenHead == 'default') this.currtenHead = '1';
        for (let i = 0; i < 32; i++) {
            this.headImgs[i] = {};
            this.headImgs[i].index = i + 1;
            this.headImgs[i].status = false;
            if (this.currtenHead == this.headImgs[i].index) this.headImgs[i].status = true;
        }
    }


    changeHead($event) {
        $event.stopPropagation();
        let index = 1;
        angular.forEach(this.headImgs, (v, k)=> {
            if (this.headImgs[k].status) index = this.headImgs[k].index;
        });
        this.changeHeadImgIndex(index);

    }

    hideChangeHead() {
        this.$rootScope.showChangeHeadFlag = false;
    }

    getHeight() {
        let h = window.screen.height;
        let hh = Math.floor(h * 0.65) - 100 - 55 - 10;
        if (hh < 0) hh = 0;
        return hh;

    }

    chooseHeadImg(item, $event) {
        $event.stopPropagation();
        angular.forEach(this.headImgs, (v, k)=> {
            this.headImgs[k].status = false;
        });
        item.status = true;
    }

    /*  onBeforeLeaveView() {

     }

     onReceiveProps() {
     }

     onAfterEnterView() {
     }*/

    /*  mapStateToThis(state) {
     return {
     currtenHead: state.user_reward_base.avator
     }
     }

     mapActionToThis() {
     return {
     changeHeadImgIndex: this.profileService.changeHeadImg.bind(this.profileService),
     }
     }*/
}
changeHeadCtrl.$inject = ['$scope', '$state', '$ngRedux', 'profileService', '$rootScope', 'commonService'];
export default changeHeadCtrl;