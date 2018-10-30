/**
 * Created by ww on 2017/8/11.
 */
import {Inject, View, Directive, select} from 'ngDecoratorForStudent/ng-decorator';
import html2canvas from 'html2canvas/dist/html2canvas';
import weChatIcon from './../../../../m_boot/bootImages/wechat.ico';
import friendCircle from './../../../../m_boot/bootImages/friend-circle.png';
import '../../../music/feedPetBgMusic.mp3';
import '../../../music/hatchPetBgMusic.mp3';
import '../../../music/petPageBgMusic.mp3';
import '../../../music/petEatMusic1.mp3';
import '../../../music/petEatMusic2.mp3';
import '../../../music/petEatMusic3.mp3';


// import rewardBox from './../../../sImages/qq.ico';

@View('pet_page', {
    url: '/pet_page/:urlFrom/:backWorkReportUrl',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject: ['$scope'
        ,'$rootScope'
        ,'$state'
        ,'$ngRedux'
        ,'$ionicSlideBoxDelegate'
        ,'$timeout'
        ,'commonService'
        ,'increaseScoreService'
        ,'$ionicActionSheet'
        ,'profileService']
})

export default class {
    commonService;
    $ionicSlideBoxDelegate;
    $timeout;
    increaseScoreService;
    $ionicActionSheet;
    profileService;
    @select(state=>state.profile_user_auth.user) user;
    @select(state=>state.user_reward_base) rewardBase;
    @select(state=>state.pet_info.foodArr) foodArr;
    @select(state=>state.pet_info.petArr) petArr;
    @select(state=>state.pet_info.firstGuide) firstGuide;
    @select(state=>state.pet_info.sharePetSuccess) sharePetSuccess;
    @select(state=>state.pet_info.canGetReward) canGetReward;
    @select(state=>state.pet_info.hasHatchEggs) hasHatchEggs;


    currentShowPetIndex = 0;
    isFirstPet = true;
    isLastPet = false;
    initCtrl = false;
    isShowHelpDialog = false;
    isShowShareDialog = false;
    hasSelectedFirstEgg = false; //执行第一次选择宠物蛋
    feedPetRetFlag = false; //喂养宠物请求中
    firstEggId = 1;
    showHatchFirstPetAnimation = false; //孵化第一个宠物显示特效的flag
    petLevelUp = false; //宠物喂养时升级
    feedPetTimeDown = true; //喂养宠物时间间隔flag
    isShowPetShareFloatPic = false;//显示要分享的图层
    getRewardSuccess = false; //成功获取到分享奖励
    showGuideHand = false; //显示小手点击食物引导
    fetchFlag = true;
    configDataPipe() {
        this.dataPipe.when(()=>!this.initCtrl)
            .then(()=> {
                this.initCtrl = true;
                //获取宠物信息
                this.getServerData();
            })
    }

    getServerData(){
        //获取数据
        this.fetchFlag = true;
        this.increaseScoreService.getAllPet().then((hasPets)=>{
            this.$ionicSlideBoxDelegate.update();
            this.fetchFlag = false;


        },()=>{
            this.commonService.alertDialog('获取重新信息失败，请稍后再试',2000);
        });
        
    }

    back() {
        if(this.isShowHelpDialog){
            this.isShowHelpDialog = false;
            this.getScope().$digest();
            return;
        }else if(this.isShowShareDialog){
            this.isShowShareDialog = false;
            this.getScope().$digest();
            return;
        }else if(this.isNoFeedDialog){
            this.isNoFeedDialog = false;
            this.getScope().$digest();
            return;
        }
        let params = this.getStateService().params;
        params.isIncreaseScore = true;
        this.go(params.urlFrom,params);
        this.getScope().$root.$injector.get('$ionicViewSwitcher').nextDirection('back');
        this.showGuideHand = false;

    }

    onBeforeLeaveView() {
    }
    onBeforeEnterView(){
    }
    onAfterEnterView() {
        if(this.firstGuide){
            this.increaseScoreService.changeFirstPetGuideFlag();
        }
    }

    firstSelectEgg(egg){
        //孵化第一个宠物蛋
        this.increaseScoreService.hatchPet({group:egg},true).then(()=>{
            this.getRootScope().hatchPetBgMusic.currentTime = 0;
            this.getRootScope().hatchPetBgMusic.play();
            this.hasSelectedFirstEgg = true;
            this.showHatchFirstPetAnimation = true;
            this.firstEggId = egg;
            this.$ionicSlideBoxDelegate.$getByHandle('pet-box-slide').update();

        },()=>{
            this.commonService.alertDialog('孵化失败，请稍后再试',2000)
        });

    }

    gotoFeedPet(e){
        e.preventDefault();
        this.increaseScoreService.changeHatchFirstPetStatus();
        this.showGuideHand = true;
    }

    /**
     * 喂养宠物
     * @param e
     * @param food
     */
    feedPet(e,food){
        this.showGuideHand = false;

        if(!this.feedPetTimeDown || this.feedPetRetFlag){
            this.commonService.alertDialog('喂养太快啦',2000);
            return;
        }

        let $target = $(e.currentTarget);
        $target.addClass('click-scale-animation');
        $target.on('animationend',()=>{
            $target.removeClass('click-scale-animation');
            $target.off('animationend');
        });
        $target.on('webkitAnimationEnd',()=>{
            $target.removeClass('click-scale-animation');
            $target.off('webkitAnimationEnd');
        });

        if(food.count < 1){
            this.isNoFeedDialog = true;
            return;
        }

        let currentPet = this.petArr[this.currentShowPetIndex];

        this.feedPetRetFlag = true;
        this.increaseScoreService.handleFeedPet({petId:currentPet.id,foodId:food.id},currentPet.phase).then((isLevelUp)=>{
            this.$ionicSlideBoxDelegate.$getByHandle('pet-box-slide').update();
            this.feedPetRetFlag = false;
            if(food.id == 3){
                this.getRootScope().feedPetBgMusic.currentTime = 0;
                this.getRootScope().feedPetBgMusic.play();
            }else {
                this.getRootScope().petEatMusic[currentPet.type-1].currentTime = 0;
                this.getRootScope().petEatMusic[currentPet.type-1].play();
            }

            if(isLevelUp && currentPet.phase == 4){
                this.isPetLevelMax = true;
            }

            //喂养成功动画
            this.feedPetTimeDown = false;
            let timeId = this.$timeout(()=>{
                this.feedPetTimeDown = true;
                this.showBubble = false;

                this.$timeout.cancel(timeId);
            },1000);
            this.petLevelUp = true;
            this.showBubble = food.id == 3?2:1;

        },(data)=>{
            this.commonService.alertDialog(data.msg,2000);
            this.feedPetRetFlag = false;
        });
    }

    /**
     * 孵化宠物
     */
    hatchPet(){
        let currentEgg = this.petArr[this.currentShowPetIndex];
        if(this.rewardBase.credits < 300){
            this.commonService.showAlert('提示','<p style="text-align: center">能量不足</p>');
            return;
        }
        this.increaseScoreService.hatchPet({group:currentEgg.type}).then(()=>{
            this.$ionicSlideBoxDelegate.$getByHandle('pet-box-slide').update();
            this.getRootScope().hatchPetBgMusic.currentTime = 0;
            this.getRootScope().hatchPetBgMusic.play();

            this.petLevelUp = true;
            this.getRewardInfoServer();
        },()=>{
            this.commonService.alertDialog('孵化失败，请稍后再试',2000)
        });
    }

    showNextPet(){
        this.$ionicSlideBoxDelegate.next(200);
        this.currentShowPetIndex = this.$ionicSlideBoxDelegate.currentIndex();
        if(this.currentShowPetIndex == this.petArr.length-1){
            this.isLastPet = true;
            this.isFirstPet = false;
        }else {
            this.isLastPet = false;
            this.isFirstPet = false;
        }
    }
    showPrePet(){
        this.$ionicSlideBoxDelegate.previous(200);
        this.currentShowPetIndex = this.$ionicSlideBoxDelegate.currentIndex();
        if(this.currentShowPetIndex == 0){
            this.isFirstPet = true;
            this.isLastPet = false;
        }else {
            this.isLastPet = false;
            this.isFirstPet = false;
        }
    }

    /**
     * 宠物slide页面滑动执行
     * @param index
     */
    slideHasChanged(index){
        this.currentShowPetIndex = index;
        if(index == 0){
            this.isFirstPet = true;
            this.isLastPet = false;
        }
        else if(index == this.petArr.length-1){
            this.isLastPet = true;
            this.isFirstPet = false;
        }
        else {
            this.isLastPet = false;
            this.isFirstPet = false;
        }
    }


    showHelp(){
        this.isShowHelpDialog = true;
    }
    hideHelp(e){
        e.preventDefault();
        this.isShowHelpDialog = false;
    }

    showShare(){
        this.isShowShareDialog = true;
    }
    hideShare(e){
        e.preventDefault();
        $('.pet-share-dialog-wrap').hide();
        $('.pet-page-content').hide();
        $('.pet-page-header').hide();

        // $('.pet-page-header,.pet-page-content-bottom,.pet-slide-btn ').css({'opacity':'0'});
        // $('.content-top-process').addClass('process-opacity-0');
        // $('.content-top-process,.pet-page-header,.pet-page-content-bottom,.pet-slide-btn ').hide();
        $('.share-pet-float-warp').show();




        this.isShowShareDialog = false;
        html2canvas(document.body).then((canvas) => {
            // $('.pet-page-header,.pet-page-content-bottom,.pet-slide-btn ').css({'opacity':'1'});
            // if(this.petArr[this.currentShowPetIndex].phase != 0){
            //     $('.content-top-process').removeClass('process-opacity-0');
            // }
            // $('.content-top-process,.pet-page-header,.pet-page-content-bottom,.pet-slide-btn ').show();
            $('.share-pet-float-warp').hide();
            $('.pet-page-content').show();
            $('.pet-page-header').show();

            this.sharePet(canvas);
        });
    }
    closeShareDialog(e){
        if($(e.target).hasClass('pet-share-dialog-wrap')){
            this.isShowShareDialog = false;
        }
    }
    closeHelpDialog(e){
        if($(e.target).hasClass('pet-help-dialog-wrap')){
            this.isShowHelpDialog = false;
        }
    }
    sharePet(canvas) {

        this.$ionicActionSheet.show({
                buttons: [
                    {text: `<img class="reward-share-btn weChat-share-img" src="${weChatIcon}">分享到微信`},
                    {text: `<img class="reward-share-btn friend-circle-share-img" src="${friendCircle}">分享到朋友圈`}
                ],
                cancelText: '取消',
                buttonClicked: (index) => {
                    if (index == 0) {//点击分享到微信
                        if (!this.getRootScope().weChatInstalled) {
                            this.commonService.showAlert("提示", "没有安装微信！");
                            return;
                        }
                        Wechat.share({
                            scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                            message: {
                                title: this.user.name+'同学',
                                description: '在“提升”中孵化了宠物，一起去“提升”吧',
                                thumb: "http://xuexiv.com/img/icon.png",
                                mediaTagName: "TEST-TAG-001",
                                messageExt: "这是第三方带的测试字段",
                                messageAction: "<action>dotalist</action>",
                                media: {
                                    type: Wechat.Type.IMAGE,
                                    image: canvas.toDataURL("image/png"),
                                }
                            },
                        }, () => {
                            this.shareSuccess();
                        }, (reason) => {
                            this.commonService.showAlert("提示", reason);
                        });
                    }
                    if (index == 1) {//点击分享到微信朋友圈
                        if (!this.getRootScope().weChatInstalled) {
                            this.commonService.showAlert("提示", "没有安装微信！");
                            return;
                        }
                        Wechat.share({
                            scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                            message: {
                                title: this.user.name+'同学',
                                description: '在“提升”中孵化了宠物，一起去“提升”吧',
                                thumb: "http://xuexiv.com/img/icon.png",
                                mediaTagName: "TEST-TAG-001",
                                messageExt: "这是第三方带的测试字段",
                                messageAction: "<action>dotalist</action>",
                                media: {
                                    type: Wechat.Type.IMAGE,
                                    image: canvas.toDataURL("image/png"),
                                }
                            },
                        }, () => {
                            this.shareSuccess();
                        }, (reason) => {
                            this.commonService.showAlert("提示", reason);
                        });
                    }
                    return true;
                }
            });

    };

    shareSuccess(){
        this.increaseScoreService.changeShareSuccessFlag();
        this.isShowShareDialog = true;
    };

    gotoDoQuestion(e){
        e.preventDefault();
        this.isNoFeedDialog = false;
        this.back();
    }
    closeNoFoodDialog(e){
        if($(e.target).hasClass('pet-help-dialog-wrap')){
            this.isNoFeedDialog = false;
        }
    }
    mapActionToThis() {
        let profileService = this.profileService;
        return {
            getRewardInfoServer: profileService.getRewardInfoServer.bind(profileService)
        }
    }

    isShowInvite()  {
        if(typeof Wechat ==   "undefined") return false; //插件不存在不显示
        if(this.commonService.judgeSYS() == 1) return true; //安卓系统显示
        if(this.commonService.judgeSYS() == 3) return false; //非移动端设备不显示

        if (!this.appNumVersion){
            this.appNumVersion = this.commonService.getAppNumVersion()
        }

        if(!this.appNumVersion) return false;

        let ver = "1.8.8";
        let verArr = ver.split(".");
        let appVerArr = this.appNumVersion.split(".");
        while(appVerArr.length < verArr.length){
            appVerArr.push(0);
        }
        let isShow = true;
        for(let i = 0 ; i<appVerArr.length; i++){
            if(Number(appVerArr[i]) > Number(verArr[i])){
                break;
            }else if(Number(appVerArr[i]) < Number(verArr[i])){
                isShow = false;
                break;
            }
        }
        return isShow;
    }

    gotoGetShareReward(){
        if(!this.sharePetSuccess||!this.canGetReward){return}
        this.increaseScoreService.getShareReward().then(()=>{
            this.increaseScoreService.changeCanGetRewardFlag();
            this.isShowShareDialog = false;
            this.getRewardSuccess = true;
        },()=>{});
    }

    closePetLevelMaxDialog(e){
        if($(e.target).hasClass('pet-help-dialog-wrap')){
            this.isPetLevelMax = false;
        }
    }
    hideDialog(){
        this.isPetLevelMax = false;
    }
    getSharePic(){
        let pic;
        if(this.petArr[this.currentShowPetIndex].type == 0){
            return this.getRootScope().loadImg('pet_page/pet_1_0.png');
        }

        if(this.petArr[this.currentShowPetIndex].phase != 0){
            pic = 'pet_page/pet_'+this.petArr[this.currentShowPetIndex].type+'_'+this.petArr[this.currentShowPetIndex].phase+'_1.png'
        }else {
            pic = 'pet_page/pet_'+this.petArr[this.currentShowPetIndex].type+'_0.png'
        }
        return this.getRootScope().loadImg(pic)
    }
}


