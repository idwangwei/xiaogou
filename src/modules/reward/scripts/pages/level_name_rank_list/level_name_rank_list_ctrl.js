/**
 * Created by WL on 2017/6/14.
 */

import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'levelNameRankList',
    template: require('./level_name_rank_list.html'),
    styles: require('./style.less'),
    replace: true
})

@View('reward_level_name_rank_list', {
    url: '/reward_level_name_rank_list',
    template: '<level-name-rank-list></level-name-rank-list>'
})

@Inject('$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', '$ionicHistory', 'rewardSystemService', 'commonService', '$ionicPopup', '$ionicLoading','workStatisticsServices')
class levelNameRankListCtrl {

    @select(state=>(state.get_level_name_rank_list)) levelRankList;
    @select(state => (state.level_name_list)) level_name_list;
    @select(state => (state.user_reward_base)) rewardBase;
    @select(state => (state.wl_selected_clazz)) selectedClazz;
    @select(state => (state.profile_clazz.passClazzList)) allClazzList;
    @select(state => (state.profile_clazz.clazzList)) clazzList;
    @select(state=>(state.profile_user_auth.user)) user;
    commonService;
    rewardSystemService;
    workStatisticsServices;
    $ionicHistory;
    constructor(){
        /*后退注册*/

    }
    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    loadLevelNameImg(levelInfo) {
        let imgUrl = 'group' + levelInfo.group + "Level";
        imgUrl += "Name" + (levelInfo.imgIndex + 1) + ".png";
        return this.getRootScope().loadImg('levelName/' + imgUrl);
    }

    getHeadImg(avator) {
        let headAvator = (avator == "default" || !avator) ? 1 : avator;
        let headUrl = 'head_images/user_head' + headAvator + '.png';
        return this.getRootScope().loadImg(headUrl);
    }


    onBeforeLeaveView() {
        this.rewardSystemService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.rewardSystemService.cancelRequestList.splice(0, this.rewardSystemService.cancelRequestList.length);
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        this.initFlag = false;
        this.getDataSuccessFlag = false;
        this.getLevelRankList();
    }

    getLevelRankList() {
        if(!this.selectedClazz || !this.selectedClazz.id){
            if(this.allClazzList.length == 0){
                this.initFlag = true;
                this.getDataSuccessFlag = true;
                this.rewardSystemService.clearClazzLevelNameRank();
                this.commonService.showAlert("温馨提示", "您还没有添加班级，赶快去家长端添加班级吧！");
                return;
            }
            let clazz = this.allClazzList[0];
            if(this.clazzList.length > 0){
                clazz = this.clazzList[0];
            }
            this.workStatisticsServices.changeClazz(clazz);
            this.selectedClazz = clazz;
        }

        this.rewardSystemService.getClazzLevelNameRank(this.selectedClazz.id).then((data)=>{
            this.initFlag = true;
            if(data && data.code == 200){
                this.getDataSuccessFlag = true;
                return;
            }else{
                this.getDataSuccessFlag = false;
            }
        })
    }

    back() {
        if(this.$ionicHistory.backView()!==null){
            this.$ionicHistory.goBack()
        }else{
            this.go('reward_level_name');
        }

    }


}


export default levelNameRankListCtrl;